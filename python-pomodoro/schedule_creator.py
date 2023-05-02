# Name: schedule_creator.py
# Author: Rodion Ugarov
# Date: 2023-18-02
# Description: This program calculates the area and perimeter of a rectangle given its length and width.
# # This program is designed to create a schedule for an alarm clock pomodoro program. 
# # Pomodoro is a time management technique where work is divided into intervals of 25 minutes, 
# # called "pomodoros," followed by short breaks. Every fourth break is a long break. 
# # Users input their preferred start and end times and the program will generate a schedule of 
# # pomodoros and breaks between the specified start and end times.

# Ask user to input start and end times in hh:mm format
start_time = input("Enter start time (hh:mm): ")
end_time = input("Enter end time (hh:mm): ")
# start_time = "23:00"
# end_time = "02:00"

# Ask user to input length of work session, short break, and long break in minutes
# Default values are 25, 5, and 15 minutes respectively
work_session_minutes = int(input("Enter work session minutes (default: 25): ") or 25)
short_break_minutes = int(input("Enter short break minutes (default: 5): ") or 5)
long_break_minutes = int(input("Enter long break minutes (default: 15): ") or 15)

# Convert start and end times to minutes since midnight
start_hour, start_min = start_time.split(":")
end_hour, end_min = end_time.split(":")

start_time_in_minutes = int(start_hour) * 60 + int(start_min)
end_time_in_minutes = int(end_hour) * 60 + int(end_min)

# Add 1440 minutes to end time if it is before the start time
if end_time_in_minutes < start_time_in_minutes:
    end_time_in_minutes += 1440

# Initialize pomodoro counter
pomodoro_count = 1


# Loop until end time is reached
while start_time_in_minutes + work_session_minutes <= end_time_in_minutes:
    
    # Calculate end time for current pomodoro
    pomodoro_end_time_in_minutes = start_time_in_minutes + work_session_minutes
    
    # Print start and end time for current pomodoro and indicate whether it is a work or break period
    start_hour, start_min = divmod(start_time_in_minutes, 60)
    end_hour, end_min = divmod(pomodoro_end_time_in_minutes, 60)

    print(f"{start_hour % 24:02}:{start_min:02}-{end_hour % 24:02}:{end_min:02}: Pomodoro {pomodoro_count} (work)")

    
    # Update start time to end time of current pomodoro
    start_time_in_minutes = pomodoro_end_time_in_minutes
    
    # Print start and end time for long break
    if pomodoro_count % 4 == 0:
        break_duration = long_break_minutes
        start_hour, start_min = divmod(start_time_in_minutes, 60)
        end_hour, end_min = divmod(start_time_in_minutes + break_duration, 60)
        print(f"{start_hour % 24:02}:{start_min:02}-{end_hour % 24:02}:{end_min:02}: Long Break")

    # Print start and end time for short break
    else:
        break_duration = short_break_minutes
        start_hour, start_min = divmod(start_time_in_minutes, 60)
        end_hour, end_min = divmod(start_time_in_minutes + break_duration, 60)
        print(f"{start_hour % 24:02}:{start_min:02}-{end_hour % 24:02}:{end_min:02}: Short Break")
    
    # Increment pomodoro counter and update start time        
    pomodoro_count += 1
    start_time_in_minutes += break_duration

# If there is time remaining after the final pomodoro, print start and end time for an additional work session
if start_time_in_minutes < end_time_in_minutes:
    start_hour, start_min = divmod(start_time_in_minutes, 60)
    end_hour, end_min = divmod(end_time_in_minutes, 60)
    print(f"{start_hour % 24:02}:{start_min:02}-{end_hour % 24:02}:{end_min:02}: Pomodoro {pomodoro_count} (work)")
