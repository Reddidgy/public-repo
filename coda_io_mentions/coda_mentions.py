print("Starting script...")
import os
import requests
import json
import hashlib
import html
import re
from dotenv import load_dotenv

# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Load environment variables from .env file using absolute path
ENV_FILE = os.path.join(SCRIPT_DIR, '.env')
load_dotenv(ENV_FILE)

CODA_API_TOKEN = os.getenv('MY_CODA_TOKEN')
TG_API_TOKEN = os.getenv('TG_API_TOKEN')
ENABLED_MENTIONS = [m.strip() for m in os.getenv('ENABLED_MENTIONS', '').split(',') if m.strip()]
ENABLED_CHANNELS = [c.strip() for c in os.getenv('ENABLED_CHANNELS', '').split(',') if c.strip()]
ENABLED_TGNAMES = [n.strip() for n in os.getenv('ENABLED_TGNAMES', '').split(',') if n.strip()]
BASE_URL = 'https://coda.io/apis/v1'
STATE_FILE = os.path.join(SCRIPT_DIR, 'seen_mentions.json')

def get_headers():
    return {
        'Authorization': f'Bearer {CODA_API_TOKEN}'
    }

def get_paginated_items(url, params=None):
    """Generic helper to fetch all items from a paginated Coda endpoint."""
    all_items = []
    headers = get_headers()
    while url:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        all_items.extend(data.get('items', []))
        url = data.get('nextPageLink') # Coda provides the full URL for the next page
        params = None # nextPageLink already includes params
    return all_items

def list_docs():
    """Lists docs the user has access to."""
    url = f'{BASE_URL}/docs'
    return get_paginated_items(url)

def list_pages(doc_id):
    """Lists pages in a specific doc."""
    url = f'{BASE_URL}/docs/{doc_id}/pages'
    return get_paginated_items(url)

def whoami():
    """Returns info about the authenticated user."""
    url = f'{BASE_URL}/whoami'
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json()

def list_activity(doc_id):
    """Lists activity in a specific doc."""
    url = f'{BASE_URL}/docs/{doc_id}/activity'
    return get_paginated_items(url)

def list_tables(doc_id):
    """Lists tables in a specific doc."""
    url = f'{BASE_URL}/docs/{doc_id}/tables'
    return get_paginated_items(url)

def list_rows(doc_id, table_id):
    """Lists rows in a specific table."""
    url = f'{BASE_URL}/docs/{doc_id}/tables/{table_id}/rows'
    params = {'valueFormat': 'rich'}
    return get_paginated_items(url, params=params)

def get_page_content(doc_id, page_id):
    """Gets content of a specific page."""
    url = f'{BASE_URL}/docs/{doc_id}/pages/{page_id}/content'
    return get_paginated_items(url)

def escape_markdown_v2(text):
    """Escapes Telegram MarkdownV2 special characters."""
    # List of special characters that need to be escaped in MarkdownV2
    # _, *, [, ], (, ), ~, `, >, #, +, -, =, |, {, }, ., !
    escape_chars = r'_*[]()~`>#+-=|{}.!'
    return re.sub(f'([{re.escape(escape_chars)}])', r'\\\1', text)

def get_doc_name(doc_id):
    """Returns the name of a specific document."""
    url = f'{BASE_URL}/docs/{doc_id}'
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json().get('name')

def send_telegram_message(token, channel_id, text):
    """Sends a message to a Telegram channel."""
    if not token or not channel_id:
        print("Telegram token or channel ID missing. Skipping notification.")
        return None
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = {
        'chat_id': channel_id,
        'text': text,
        'parse_mode': 'MarkdownV2'
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code != 200:
            print(f"Failed to send Telegram message: {response.status_code} {response.text}")
            print(f"Payload sent: {json.dumps(payload, indent=2)}")
            if "chat not found" in response.text:
                print("HINT: The Telegram chat_id might be incorrect, or the bot is not a member of the chat/channel.")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Failed to send Telegram message: {e}")
        return None

def load_seen_mentions():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return set(data)
                elif isinstance(data, dict):
                    # Migration: convert from dict of mention objects to list of IDs
                    seen_ids = set()
                    for state_key, mentions in data.items():
                        for m in mentions:
                            if isinstance(m, dict) and 'unique_id' in m:
                                seen_ids.add(f"{state_key}#{m['unique_id']}")
                            elif isinstance(m, str):
                                seen_ids.add(f"{state_key}#{m}")
                    return seen_ids
        except Exception as e:
            print(f"Error loading state file: {e}")
    return set()

def save_seen_mentions(seen):
    with open(STATE_FILE, 'w') as f:
        json.dump(sorted(list(seen)), f, indent=4)

def get_content_hash(content):
    return hashlib.md5(content.encode('utf-8')).hexdigest()

def find_mentions_in_data(data, target_emails):
    """
    Recursively finds all mentions of any of the target users in Coda data.
    Returns a list of dicts with detailed info about each mention.
    """
    detailed_mentions = []

    def search_recursive(item, current_content=""):
        if isinstance(item, dict):
            # Check for Person object (rich format)
            if item.get('@type') == 'Person' or ('email' in item and 'name' in item):
                email = item.get('email', '').lower()
                if any(email == target.lower() for target in target_emails):
                    detailed_mentions.append({
                        'type': 'person',
                        'email': email,
                        'name': item.get('name', 'Unknown User'),
                        'content': current_content if isinstance(current_content, str) else str(item),
                        'raw_id': f"person_{json.dumps(item, sort_keys=True)}"
                    })

            # Recurse into all items
            for key, val in item.items():
                # If we are in a table row, the val might be the content we want
                search_recursive(val, val if isinstance(val, str) else current_content)

        elif isinstance(item, list):
            for sub_item in item:
                search_recursive(sub_item, sub_item if isinstance(sub_item, str) else current_content)

        elif isinstance(item, str):
            low_data = item.lower()
            for target in target_emails:
                target_low = target.lower()
                count = low_data.count(target_low)
                for _ in range(count):
                    detailed_mentions.append({
                        'type': 'text',
                        'email': target_low,
                        'name': target_low,
                        'content': item,
                        'raw_id': f"text_email_{target_low}"
                    })

    search_recursive(data)

    # Try to resolve names for text mentions from known users
    # or from nearby person objects
    email_to_name = {
        'ugarov.r@gmail.com': 'Reddidgy',
        'evgeniy.putilin@gmail.com': 'eputilin'
    }

    # Pre-collect names from person objects in this block
    for m in detailed_mentions:
        if m['type'] == 'person' and m['email'] in email_to_name:
            email_to_name[m['email']] = m['name']

    # Make mentions unique within this block for state tracking
    unique_detailed = []
    counts = {}
    for m in detailed_mentions:
        if m['type'] == 'text' and m['email'] in email_to_name:
            m['name'] = email_to_name[m['email']]

        counts[m['raw_id']] = counts.get(m['raw_id'], 0) + 1
        m['unique_id'] = f"{m['raw_id']}_{counts[m['raw_id']]}"
        unique_detailed.append(m)

    return unique_detailed

def clean_content(content_str, mention_to_strip, target_email=None):
    """Strips the mention text and cleans up whitespace."""
    if not isinstance(content_str, str):
        content_str = str(content_str)

    # 1. Strip Markdown links: [Name](mailto:email) or [Name](...)
    # This captures the case in the user example
    content_str = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', content_str)

    # 2. Strip emails
    if target_email:
        content_str = content_str.replace(target_email, "")

    # 3. Strip mention name with possible @
    cleaned = content_str.replace(f"@{mention_to_strip}", "")
    cleaned = cleaned.replace(mention_to_strip, "")

    # Basic cleanup of punctuation typically left after stripping
    cleaned = cleaned.replace(" | ", " ").strip()
    cleaned = re.sub(r'^[:\s|]+|[:\s|]+$', '', cleaned)

    # Final cleanup
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def get_display_name_from_email(email):
    # Mapping for known users if needed, or we get it from Person object
    # The requirement says to use Display Name (e.g. "Evgeny Putilin")
    # I'll try to find it in the Person object if available during scan.
    pass

def main():
    if not CODA_API_TOKEN:
        print("Error: MY_CODA_TOKEN not found in .env file.")
        return

    if not ENABLED_MENTIONS:
        print("Error: ENABLED_MENTIONS not found or empty in .env file.")
        return

    if not ENABLED_CHANNELS:
        print("Error: ENABLED_CHANNELS not found or empty in .env file.")
        return

    # Create mapping between users and channels based on their order in the lists
    # email_to_channel = {email: channel_id, ...}
    email_to_channel = {}
    for i in range(min(len(ENABLED_MENTIONS), len(ENABLED_CHANNELS))):
        email_to_channel[ENABLED_MENTIONS[i].lower()] = ENABLED_CHANNELS[i]

    # Create mapping between users and Telegram names based on their order in the lists
    # email_to_tgname = {email: tgname, ...}
    email_to_tgname = {}
    for i in range(min(len(ENABLED_MENTIONS), len(ENABLED_TGNAMES))):
        email_to_tgname[ENABLED_MENTIONS[i].lower()] = ENABLED_TGNAMES[i]

    seen_mentions = load_seen_mentions()
    new_seen_mentions = seen_mentions.copy()

    try:
        print("Checking authentication...")
        user_info = whoami()
        print(f"Authenticated as: {user_info.get('name')} ({user_info.get('email')})")

        print("Fetching documents...")
        # Get the specific document name
        doc_id = 'whaPyIDcHS'
        try:
            full_doc_name = get_doc_name(doc_id)
        except Exception:
            full_doc_name = "First" # Fallback

        print(f"Searching for mentions of {', '.join(ENABLED_MENTIONS)} in doc '{full_doc_name}' ({doc_id})...")

        found_new = False

        # Search in pages
        pages = list_pages(doc_id)
        for page in pages:
            print(f"Checking page: {page['name']}")
            try:
                items = get_page_content(doc_id, page['id'])
                for item in items:
                    item_id = item.get('id')
                    item_content = item.get('itemContent', {})

                    detailed_mentions = find_mentions_in_data(item_content, ENABLED_MENTIONS)

                    if detailed_mentions:
                        state_key = f"page_{item_id}"

                        for m in detailed_mentions:
                            mention_full_id = f"{state_key}#{m['unique_id']}"

                            if mention_full_id not in seen_mentions:
                                print(f"New mention(s) in page {page['name']}!")
                                # Use name from mapping if available, otherwise fallback to Coda display name
                                target_email = m['email'].lower()
                                display_name = email_to_tgname.get(target_email, m.get('name', 'Unknown User'))

                                section_name = page['name']
                                browser_url = page.get('browserLink', '')

                                # Ensure we have clean content
                                content_found = m['content']
                                cleaned = clean_content(content_found, display_name, m['email']).replace(display_name, "").strip()

                                # Use * for bold in MarkdownV2
                                msg = (
                                    f"New mention for @{escape_markdown_v2(display_name)} in *{escape_markdown_v2(full_doc_name)}*\n"
                                    f"*Section:* {escape_markdown_v2(section_name)}\n"
                                    f"*Content:* {escape_markdown_v2(cleaned)}\n"
                                    f"*URL:* {escape_markdown_v2(browser_url)}"
                                )

                                # Send only to the mapped channel for this user
                                target_email = m['email'].lower()
                                if target_email in email_to_channel:
                                    send_telegram_message(TG_API_TOKEN, email_to_channel[target_email], msg)
                                else:
                                    print(f"Warning: No channel mapped for user {target_email}")

                                new_seen_mentions.add(mention_full_id)
                                found_new = True

            except Exception as e:
                print(f"Error checking page {page['name']}: {e}")

        # Search in tables
        tables = list_tables(doc_id)
        for table in tables:
            print(f"Checking table: {table['name']}")
            try:
                rows = list_rows(doc_id, table['id'])
                for row in rows:
                    row_id = row.get('id')
                    row_values = row.get('values', {})

                    detailed_mentions = find_mentions_in_data(row_values, ENABLED_MENTIONS)

                    if detailed_mentions:
                        state_key = f"table_{table['id']}_row_{row_id}"

                        for m in detailed_mentions:
                            mention_full_id = f"{state_key}#{m['unique_id']}"

                            if mention_full_id not in seen_mentions:
                                row_display_name = row.get('name') or 'Unnamed'
                                print(f"Mention(s) found in table '{table['name']}', row '{row_display_name}'")

                                # Use name from mapping if available, otherwise fallback to Coda display name
                                target_email = m['email'].lower()
                                display_name = email_to_tgname.get(target_email, m.get('name', 'Unknown User'))

                                section_name = table['name']
                                browser_url = row.get('browserLink', '')

                                # Use the specific content block where mention was found
                                content_found = m['content']
                                cleaned = clean_content(content_found, display_name, m['email']).replace(display_name, "").strip()

                                msg = (
                                    f"New mention for @{escape_markdown_v2(display_name)} in *{escape_markdown_v2(full_doc_name)}*\n"
                                    f"*Section:* {escape_markdown_v2(section_name)}\n"
                                    f"*Content:* {escape_markdown_v2(cleaned)}\n"
                                    f"*URL:* {escape_markdown_v2(browser_url)}"
                                )

                                # Send only to the mapped channel for this user
                                target_email = m['email'].lower()
                                if target_email in email_to_channel:
                                    send_telegram_message(TG_API_TOKEN, email_to_channel[target_email], msg)
                                else:
                                    print(f"Warning: No channel mapped for user {target_email}")

                                new_seen_mentions.add(mention_full_id)
                                found_new = True
            except Exception as e:
                print(f"Error checking table {table['name']}: {e}")

        if found_new:
            save_seen_mentions(new_seen_mentions)
        else:
            print("No new mentions found.")

    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except Exception as err:
        print(f"An error occurred: {err}")

if __name__ == '__main__':
    main()
