#!/bin/bash
# Script for cron to check we're tracking our activity in hubstaff.
# For open crontab use \`crontab -e\`

# Variables
hub_id=$(ls /home/$USER/.local/share/HubStaff/data/hubstaff.com | grep -v well-known)
hub_path="/home/$USER/.local/share/HubStaff/data/hubstaff.com/$hub_id/"

day_of_week=$(date | awk '{print $1}')
if [ "$day_of_week" != "Sat" ] && [ "$day_of_week" != "Sun" ]; then
  echo Today is a working day
  # Get the current hour
  current_hour=$(date +%H)

  # Check if the current hour is greater than or equal to 10 and less than 20
  if [ "$current_hour" -ge $hour_start_work ] && [ "$current_hour" -lt $hour_end_work ]; then
    echo "Working time"
    file_modification_time=$(stat -c "%Y" "${hub_path}TrackedActivity.xml")
    current_time=$(date +"%s")

    # shellcheck disable=SC2004
    # Difference between current time and tracked activity file
    time_diff=$(($current_time - file_modification_time))
    if [ $time_diff -gt 300 ]; then
      # Send message via private bot message
      response=$(curl -s -X POST "https://api.telegram.org/bot$tg_token/sendMessage" -d "chat_id=$tgchat_id" -d "text=$hubstaff_message")
    fi
  else
    echo "Not working time"
#    response=$(curl -s -X POST "https://api.telegram.org/bot$tg_token/sendMessage" -d "chat_id=$tgchat_id" -d "text=$hubstaff_warning_message")
  fi
fi