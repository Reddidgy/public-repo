#!/bin/bash

### Variables ###
hubstaff_idle_monitor_path="/home/$USER/.local/share/hubstaff_idle_monitor"
message="Your Hubstaff is NOT TURNED ON!"
token_api_server_ip=192.168.100.9
token_api_server_port=3000

# Telegram (got from get_tg_message_events.py)
#tgchat_id="139474562" # Marina
tgchat_id="647018455" # Rodion # todo: final change to Marina here

echo Trying to get telegram token from $token_api_server_ip:$token_api_server_port
tg_token=$(curl -s $token_api_server_ip:$token_api_server_port) && echo Token received!

echo Starting to install hubstaff_monitor alerting system.
mkdir -p "$hubstaff_idle_monitor_path"

echo Placing config file to "$hubstaff_idle_monitor_path"

echo Daemon placing to "$hubstaff_idle_monitor_path"
cat << EOF > "$hubstaff_idle_monitor_path"/daemon.sh
#!/bin/bash
# Script for cron to check we're tracking our activity in hubstaff.
# For open crontab use \`crontab -e\`

# Variables
hub_id=\$(ls /home/\$USER/.local/share/HubStaff/data/hubstaff.com | grep -v well-known)
hub_path="/home/\$USER/.local/share/HubStaff/data/hubstaff.com/\$hub_id/"
hubstaff_warning_message="Your Hubstaff is NOT TURNED ON!"

day_of_week=\$(date | awk '{print \$1}')
if [ "\$day_of_week" != "Sat" ] && [ "\$day_of_week" != "Sun" ]; then
  echo Today is a working day
  # Get the current hour
  current_hour=\$(date +%H)

  # Check if the current hour is greater than or equal to 10 and less than 20
  if [ "\$current_hour" -ge 10 ] && [ "\$current_hour" -lt 20 ]; then
    echo "Working time"
    file_modification_time=\$(stat -c "%Y" "\${hub_path}TrackedActivity.xml")
    current_time=\$(date +"%s")

    # shellcheck disable=SC2004
    # Difference between current time and tracked activity file
    time_diff=\$((\$current_time - file_modification_time))
    if [ \$time_diff -gt 300 ]; then
      # Send message via private bot message
      response=\$(curl -s -X POST "https://api.telegram.org/bot$tg_token/sendMessage" -d "chat_id=$tgchat_id" -d "text=\$hubstaff_warning_message")
    fi
  else
    echo "Not working time"
    # todo: final change - delete this request
    response=\$(curl -s -X POST "https://api.telegram.org/bot$tg_token/sendMessage" -d "chat_id=$tgchat_id" -d "text=\$hubstaff_warning_message")
  fi
fi
EOF
chmod +x "$hubstaff_idle_monitor_path/daemon.sh"
echo Daemon placed and permissions were configure to execute
# todo: final change to 10 minutes
crontab -l | { cat; echo "*/1 * * * * $hubstaff_idle_monitor_path/daemon.sh"; } | crontab -
echo Daemon added to crontab
echo Install completed