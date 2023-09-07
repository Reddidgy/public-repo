import os
# https://onlinealarmkur.com/en/#05:54 link format

alarm_schedule = """11:00-11:25: Pomodoro 1 (work)
11:25-11:30: Short Break
11:30-11:55: Pomodoro 2 (work)
11:55-12:00: Short Break
12:00-12:25: Pomodoro 3 (work)
12:25-12:30: Short Break
12:30-12:55: Pomodoro 4 (work)
12:55-13:00: Short Break
13:00-13:25: Pomodoro 5 (work)
13:25-13:30: Short Break
13:30-13:55: Pomodoro 6 (work)
13:55-14:00: Short Break (before lunch)
14:00-15:00: Lunch Break (1 hour)
15:00-15:25: Pomodoro 7 (work)
15:25-15:30: Short Break
15:30-15:55: Pomodoro 8 (work)
15:55-16:00: Short Break
16:00-16:25: Pomodoro 9 (work)
16:25-16:30: Short Break
16:30-16:55: Pomodoro 10 (work)
16:55-17:00: Short Break
17:00-17:25: Pomodoro 11 (work)
17:25-17:30: Short Break
17:30-17:55: Pomodoro 12 (work)
17:55-18:00: Short Break
18:00-18:25: Pomodoro 13 (work)
18:25-18:30: Short Break
18:30-18:55: Pomodoro 14 (work)
18:55-19:00: Short Break"""

alarm_template_link = "https://onlinealarmkur.com/en/#"
html_page = ""

#print(alarm_schedule.split('\n'))
for string in alarm_schedule.split('\n'):
    zagolovok = ""
    alarm_time = string.split("-")[0]
    for part in string.split(" ")[1:]:
        zagolovok += f" {part}"
    new_string = f'{string.split(" ")[0]} <a href="{alarm_template_link}{alarm_time}">{zagolovok}</a><br>'
    print(new_string)