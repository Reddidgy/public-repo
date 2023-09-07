## What is it?

This application provides a description of your AWS infrastructure, offering valuable insights into your AWS accounts.

At its current stage, it provides descriptions for the following components:
- EC2 instances and Security Groups
- VPCs with CIDRs
- Load Balancers
- ECS clusters

I have utilized this tool after run to extract information from Google Sheets and to visualize the infrastructure using Miro. If you have any suggestions for streamlining these manual steps, please feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/rodion-ugarov/) or [Telegram](@Reddidgy).

## How to get started
To get started, follow these steps:
1. Install the required Python packages using `pip3 install -r requirements.txt`.
2. Make necessary configuration changes (details below).
3. Run the application with `python3 main.py`.

## Configuration Details
To configure the application, make changes in the following places:
- `gsheet_creds_path` variable: Set the path to your JSON credentials file from Google.
- Other variables in `config.py`.
- Create a `.env` file based on the example provided in `example.env`.

