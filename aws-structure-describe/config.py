from dotenv import load_dotenv
import os
import gspread

# get variables from .env file
load_dotenv()

# Variables

# AWS creds
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")

# Google sheet variables
gsheet_engine = True  # True - Gsheet update, False - print()
gsheet_creds_path = "/home/red/secrets/gauth_creds.json"
google_sheet_name = "TEST_GSHEET"
google_tab_name = "TEST_GSHEET"

# Turn off unnecessary here
ec2_check = True
sg_check = True  # works only with ec2
ecs_check = True
elb_check = True
vpc_check = True  # works only with ec2

# for vpc check
vpcs = []
cidrs = []

# for sg check
sg_rules_formatted_array = []
# End of variables

# Gsheet engine
if gsheet_engine:
    # Google API credentials

    # define service account with creds path defining
    sa = gspread.service_account(gsheet_creds_path)

    # open proper gsheet
    sh = sa.open(google_sheet_name)

    # define proper work sheet
    wks = sh.worksheet(google_tab_name)