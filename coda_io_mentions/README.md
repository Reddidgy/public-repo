# Coda API Test Python

A Python-based utility to interact with the Coda.io API, specifically designed to detect mentions and notify via Telegram.

## Features

- **Document/Page Listing**: Retrieve accessible documents and pages.
- **Mention Detection**: Scans pages and tables in the "First" doc for mentions of emails specified in `ENABLED_MENTIONS`.
- **Telegram Notifications**: Alerts multiple channels specified in `ENABLED_CHANNELS`.
# Coda Mention Notifier

A robust Python utility that monitors Coda.io documents for user mentions and broadcasts formatted alerts to specific Telegram channels. This tool supports multi-user monitoring with granular state tracking to prevent duplicate notifications.

## Features

- **Granular Mention Detection**: Identifies mentions in both document pages and table rows.
- **Smart Deduplication**: Uses a local state file (`seen_mentions.json`) to track individual occurrences, ensuring you are only notified once per unique mention.
- **User-Channel Mapping**: Supports a one-to-one mapping by index, allowing alerts for User A to go to Channel A, and User B to Channel B.
- **MarkdownV2 Formatting**: Sends clearly structured Telegram messages using MarkdownV2 bolding and user-friendly aliases.
- **Content Cleaning**: Automatically strips the `@mention` or email token from the notification content to provide a cleaner context.

## Installation

1.  **Clone the repository** (or copy the script files).
2.  **Install Python 3.x** if not already available.
3.  **Install dependencies**:
    ```bash
    pip install requests python-dotenv
    ```

## Configuration

Create a `.env` file in the root directory. You can use `.env.example` as a template.

### Environment Variables

| Variable | Description |
| :--- | :--- |
| `MY_CODA_TOKEN` | Your Coda API Bearer Token. |
| `TG_API_TOKEN` | Your Telegram Bot Token (from @BotFather). |
| `ENABLED_MENTIONS` | Comma-separated list of emails to monitor (e.g., `user1@gmail.com,user2@gmail.com`). |
| `ENABLED_CHANNELS` | Comma-separated list of Telegram Channel/Chat IDs (e.g., `123456,-1001234567`). |

### User-Channel Mapping Logic

The application maps monitored users to notification channels by their **position** in the comma-separated lists. 

**Example:**
- `ENABLED_MENTIONS=alice@example.com, bob@example.com`
- `ENABLED_CHANNELS=111111, 222222`

Mentions of **Alice** will be sent to channel **111111**, while mentions of **Bob** will be sent to channel **222222**.

## Usage

Run the detection script:
```bash
python coda_mentions.py
```

The script will:
1. Authenticate with Coda.
2. Scan the specified document for new mentions.
3. Send formatted Telegram alerts for any newly discovered mentions.
4. Update `seen_mentions.json` to persist the state.

## Maintenance

- **`seen_mentions.json`**: Stores unique identifiers for all processed mentions. Delete this file if you wish to reset the history and receive notifications for old mentions again.
- **`coda_mentions.py`**: The primary executable logic.
