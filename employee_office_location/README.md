## Employee Finder Helper Program

This is a simple helper program designed to locate employees in the office using the Slack channel. The program is triggered by a Slack message from a user, and if the message contains a command, it accesses Google Sheets via an authentication token to retrieve relevant information. Subsequently, it returns this information to the Slack channel.

### Example Response:

- **Employee:** Aleksey Fedorov
- **Company:** SomeCompany
- **Team:** Backend
- **Office:** 409-411
- **Floor:** 4

### Features

There are several features available, and I've even added a fun game! You can initiate an attack in the game by mentioning an employee.

### Code

All the code for this program can be found in the `main.py` file. We make use of dictionaries stored in JSON format for efficient data handling.
