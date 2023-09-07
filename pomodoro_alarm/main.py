from datetime import datetime
from time import sleep
from playsound import playsound
import os

# getting PWD according to OS using string manual method
current_dir = os.getcwd()
print(current_dir)
if current_dir[-4:] == "repo":
    # if Windows
    if "C:\\" in current_dir:
        current_dir = str(current_dir) + "\\python\\python2022\\pomodoro\\"
        print(current_dir)
    
    # if Linux
    else:
        current_dir = str(current_dir) + "/python/python2022/pomodoro/"
else:
    if "C:\\" in current_dir:
        current_dir += "\\"
    else:
        current_dir += "/"

bell_file = current_dir + "bell.mp3"
schedule_file_name = "schedule.txt"
schedule_file = current_dir + schedule_file_name

with open(schedule_file, 'r') as file:
        
        # content in format for each string: 11:00-11:25: Pomodoro 1 (work)
        schedule = file.read()

# Split the schedule into individual events
events = schedule.split("\n")
event_index_counter = -1
next_event_index = 0

for event in events:
    event_index_counter += 1
    event_name = event.split(":")[3][1:]
    event_time = event.split("-")[0]
    current_time = datetime.now().time()
    event_time = datetime.strptime(event.split("-")[0], '%H:%M').time()
    time_diff = datetime.combine(datetime.today(), event_time) - datetime.combine(datetime.today(), current_time)
    minutes, seconds = divmod(time_diff.total_seconds(), 60)
    if minutes > 0:
        print(f"Waiting for {event_name} in {event_time} after {str(minutes).split('.')[0]} minutes...")
    if minutes > 0:
        while minutes != -1:
            sleep(1)
            current_time = datetime.now().time()
            event_time = datetime.strptime(event.split("-")[0], '%H:%M').time()
            time_diff = datetime.combine(datetime.today(), event_time) - datetime.combine(datetime.today(), current_time)
            minutes, seconds = divmod(time_diff.total_seconds(), 60)
        print(f"Playing {event_name} at {event_time}")
        playsound(bell_file)
        sleep(10)
        playsound(bell_file)
    else:
        print(f"skipping {event_name} at {event_time}")