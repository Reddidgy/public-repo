#!/bin/bash

### Variables ###
hubstaff_idle_monitor_path="/home/$USER/.local/share/hubstaff_idle_monitor"
hubstaff_message="Your HubStaff is NOT ENABLED!"
run_script_every_minutes=10
hour_start_work=10
hour_end_work=20

# Telegram (got from get_tg_message_events.py)
tgchat_id="139474562" # Marina
#tgchat_id="647018455" # Rodion
token_api_server_ip=192.168.100.9
token_api_server_port=3000

### START ###
echo Trying to get telegram token from $token_api_server_ip:$token_api_server_port
# You can change token and just to paste your token (tg_token="XXXXX")
tg_token=$(curl -s $token_api_server_ip:$token_api_server_port) && echo Token received!
if [ "$tg_token" ];then
  echo Token gathered from $token_api_server_ip:$token_api_server_port
else
  echo Can not get token from $token_api_server_ip:$token_api_server_port
  echo Make sure your server is available or change tg_token string in "$0"
  exit
fi

echo Starting to install hubstaff_monitor alerting system.
mkdir -p "$hubstaff_idle_monitor_path"

echo Placing config file to "$hubstaff_idle_monitor_path"

echo Daemon placing to "$hubstaff_idle_monitor_path"
cat << EOF > "$hubstaff_idle_monitor_path"/daemon.sh
#!/bin/bash
# Script for cron to check we're tracking our activity in hubstaff.
# For open crontab use \`crontab -e\`

# Variables
hub_id=\$(ls /home/$USER/.local/share/HubStaff/data/hubstaff.com | grep -v well-known)
hub_path="/home/$USER/.local/share/HubStaff/data/hubstaff.com/\$hub_id/"

day_of_week=\$(date | awk '{print \$1}')
if [ "\$day_of_week" != "Sat" ] && [ "\$day_of_week" != "Sun" ]; then
  echo Today is a working day
  # Get the current hour
  current_hour=\$(date +%H)

  # Check if the current hour is greater than or equal to 10 and less than 20
  if [ "\$current_hour" -ge $hour_start_work ] && [ "\$current_hour" -lt $hour_end_work ]; then
    echo "Working time"
    file_modification_time=\$(stat -c "%Y" "\${hub_path}TrackedActivity.xml")
    current_time=\$(date +"%s")

    # shellcheck disable=SC2004
    # Difference between current time and tracked activity file
    time_diff=\$((\$current_time - file_modification_time))
    if [ \$time_diff -gt 60 ]; then
      # Send message via private bot message
      response=\$(curl -s -X POST "https://api.telegram.org/bot$tg_token/sendMessage" -d "chat_id=$tgchat_id" -d "text=$hubstaff_message")
    fi
  else
    echo "Not working time"
#    response=\$(curl -s -X POST "https://api.telegram.org/bot$tg_token/sendMessage" -d "chat_id=$tgchat_id" -d "text=\$hubstaff_warning_message")
  fi
fi
EOF
chmod +x "$hubstaff_idle_monitor_path/daemon.sh"
echo Daemon placed and permissions were configure to execute

crontab -l | { cat; echo "*/$run_script_every_minutes * * * * $hubstaff_idle_monitor_path/daemon.sh 2>&1 | tee $hubstaff_idle_monitor_path/last_log.txt"; } | crontab -
echo Daemon added to crontab
echo Install completed