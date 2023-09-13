# Simple script to format main script to format to add to install script

root_path = ".."
main_file_name = "main.sh"
install_script_file_name = "install.sh"
excluded_variables = ["$tg_token", "$tgchat_id", "$hour_start_work", "$hour_end_work", "$hubstaff_message", "$USER"]
eof_preffix = "eof_format_"


def Strip_Script(script):
    formatted_script = script.strip().replace("\n", "")
    return formatted_script


try:
    # Open original main script
    with open(f"{root_path}/{main_file_name}", 'r', encoding='utf-8') as infile:
        main_file_content = infile.read()

    # Open install script to compare and break this script if no need to format
    with open(f"{root_path}/{install_script_file_name}", 'r', encoding='utf-8') as infile:
        install_file_content = infile.read()
    eof_script_in_install = \
    install_file_content.split("cat << EOF > \"$hubstaff_idle_monitor_path\"/daemon.sh")[1].split("EOF")[0]

    new_file_content = main_file_content.replace("$", "\$")
    for excluded_variable in excluded_variables:
        new_file_content = new_file_content.replace(f"\{excluded_variable}", excluded_variable)

    if Strip_Script(new_file_content) != Strip_Script(eof_script_in_install):
        # Write to format copy to add with EOF frames to install
        with open(f"{root_path}/{eof_preffix}{main_file_name}", 'w') as file:
            file.write(new_file_content)
        print("Success")
    else:
        print("No need to make any changes inside install.sh")
except:
    print(f"Something wrong with file {main_file_name} format process.")
