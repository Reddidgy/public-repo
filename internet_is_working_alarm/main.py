from time import sleep
import pygame
import subprocess

# Variables
mp3_file_path = "alarm.mp3"


def linux_command(command):
    # Run the command and capture the output
    command_output = subprocess.check_output(command, shell=True, universal_newlines=True)
    return command_output


def init():
    print("Start init!")
    response = linux_command("ls -la | grep alarm.mp3 | awk '{print $9}'")
    if response == "":
        linux_command("wget --output-document=alarm.mp3 "
                      "https://drive.google.com/uc?id=1KIjpTx8EGSFD7KzyFdUJ8AsBUfh37RbC")
    print("Init successful!")
    return True


def play_sound():
    # Initialize Pygame
    pygame.init()

    # Set up the Pygame mixer
    pygame.mixer.init()

    # Load the mp3 file into Pygame
    pygame.mixer.music.load(mp3_file_path)

    # Play the mp3 file
    pygame.mixer.music.play()

    # Wait until the mp3 file is finished playing
    while pygame.mixer.music.get_busy():
        pass

    # Clean up Pygame and skobka
    pygame.quit()
    return True


def try_ping():
    # The command you want to execute
    ping_output = linux_command("ping 1.1.1.1 -c 1")
    return ping_output


def main():
    init()
    while True:
        sleep(5)
        try:
            output = try_ping()
            if "time=" in output:
                print("play sound")
                play_sound()
                sleep(20)
        except:
            print("No internet still!")
            pass


if __name__ == '__main__':
    main()
