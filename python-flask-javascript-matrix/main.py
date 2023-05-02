from flask import Flask, render_template
from time import sleep
import threading
import os
import random
from turbo_flask import Turbo

timer = 0

app = Flask(__name__)
turbo = Turbo(app)
donottriggeragain = False
writing_now = False
TEMPLATES_FOLDER = f"templates/"
to_default_cp = f"cp {TEMPLATES_FOLDER}strong_base_backup.html {TEMPLATES_FOLDER}base.html"
os.system(to_default_cp)
end_matrix_string = "<script>var intervalId = window.setInterval(function(){ \
  readTextFile(\"after_matrix\");; \
}, 10);</script>"
matrix_ended = False
random_charset = "qwertyuiop[]asdfghjkl;m,.1234567890-=!@#$%^*()_+QWERTYUIOPASDFGHJKLXCVBNZNM"
max_random_char_index = (len(random_charset) - 1)

cp_command = f"cp {TEMPLATES_FOLDER}base.html {TEMPLATES_FOLDER}base_backup.html"
os.system(cp_command)

# VARS
length_string = 51   # length of main string
main_string = ""    # our main string
row_object_array = []

appear_chance = 4  # percents
row_length = 14
wait_after_each_row = 7
wait_if_rand_not_appear = 3


def loop():
    while 0 == 0:
        print("loop")


def defaultize_base(*argv):
    if "full_default" in argv:
        to_default_cp = f"cp {TEMPLATES_FOLDER}strong_base_backup0.html {TEMPLATES_FOLDER}base.html"
        os.system(to_default_cp)
    else:
        to_default_cp = f"cp {TEMPLATES_FOLDER}strong_base_backup.html {TEMPLATES_FOLDER}base.html"
        os.system(to_default_cp)
    to_default_cp = f"cp {TEMPLATES_FOLDER}matrix_backup.html {TEMPLATES_FOLDER}matrix.html"
    os.system(to_default_cp)

    return True


def write_to_base(str):
    with open(f"{TEMPLATES_FOLDER}base.html", 'a') as file1:
        file1.write(str)


def read_textfile(textfile):
    file1 = open(f"{TEMPLATES_FOLDER}{textfile}.html", "r")
    realtext_content = file1.read()
    realtext_content = realtext_content.replace("\n", "<br>")
    file1.close()
    return realtext_content


def read_matrix_file():
    file1 = open(f"{TEMPLATES_FOLDER}matrix.html", "r")
    content = file1.read()
    return content


def write_matrix_to_base(main_string, mode):
    # # DEBUG:
    # mode = "force"
    global writing_now
    current_matrix_file = read_matrix_file()

    current_matrix = current_matrix_file.split("<table>")[1]
    # current_matrix = current_matrix_file.split(
    #     "<table><tr>")[1]
    # current_matrix = current_matrix.replace(
    #     current_matrix.split("</tr>")[-1].replace("</tr>", ""), "")
    matrix_headers = "<table>"
    # current_matrix = current_matrix.replace(
    #     current_matrix.split("<tr>")[-1], "")
    if mode == "force":
        string_to_change = "<tr>" + current_matrix.split("<tr>")[-2]
        current_matrix = current_matrix.replace(string_to_change, "")

    content_to_write = matrix_headers + main_string + current_matrix

    writing_now = True
    with open("templates/matrix.html", "w") as file1:
        # Writing data to a file
        file1.write(content_to_write)
    writing_now = False


def text_to_matrix(text):
    current_matrix_file = read_matrix_file()
    matrix_headers = current_matrix_file
    content_to_write = matrix_headers + text
    writing_now = True
    with open("templates/matrix.html", "w") as file1:
        # Writing data to a file
        file1.write(content_to_write)
    writing_now = False
    return True


def get_random_char():
    return random_charset[random.randint(0, max_random_char_index)]


def matrix_func():
    main_string = ""

    def row_appear_chance():
        x = random.randint(1, 100)
        if x < appear_chance:               # 4 = 40% of appearing  TODO: add percentage
            return True
        else:
            return False

    # INIT
    # Creating row_object array according to length_string
    for index in range(0, length_string):
        row_object_array.append(
            {'index': index,
             'wait_for': random.randint(0, 20),
             'state': 'passive',
             'current_char': '<td>&nbsp</td>'})

    iterations = 100
    count = 45              # fo rewrite
    mode = "default"
    while iterations != 101:                                                          #infinite loop broken here for public purposes. should be 0
        count -= 1
        if count < 0 and mode != "force":
            mode = "force"
        write_matrix_to_base(main_string, mode)
        # ##################
        main_string = ""
        iterations -= 1
        # ma1in func of row_object_array updating to the current state
        for row_object in row_object_array:
            if row_object["wait_for"] != 0:
                row_object["wait_for"] -= 1
            if row_object["state"] == "active":
                # Active row
                # ended random row
                if row_object["wait_for"] == 0:
                    row_object["state"] = "passive"
                    row_object["current_char"] = "<td>&nbsp</td>"

                else:
                    # random row is alive
                    current_random_char = get_random_char()
                    if row_object["wait_for"] == (row_length + wait_after_each_row) - 1:
                        row_object["current_char"] = "<td style=\"color:#ffffff\">" + \
                            current_random_char + "</td>"
                    elif row_object["wait_for"] == (row_length + wait_after_each_row) - 2:
                        row_object["current_char"] = "<td style=\"color:#00ff00\">" + \
                            current_random_char + "</td>"
                    else:
                        row_object["current_char"] = "<td>" + \
                            current_random_char + "</td>"
            else:
                # Passive row
                if row_object["wait_for"] == 0:
                    if row_appear_chance():
                        row_object["state"] = "active"
                        row_object["wait_for"] = row_length + \
                            wait_after_each_row
                        # row_object["current_char"] = get_random_char()
                    else:                                                           # still passive by chance
                        row_object["wait_for"] = wait_if_rand_not_appear
                else:
                    pass

            main_string += row_object["current_char"]

            # array output
            # for row_object in row_object_array:
            #     main_string += row_object["current_char"]
            #     #print(row_object)
        sleep(0.10)
        # print("MATRIX FINISHED!!!111")
        # main_string += "</tr><tr>"
        main_string = "<tr>" + main_string + "</tr>"
    return True


def read_and_write_content(realtext_content):
    isTag = False
    current_tag = ""
    current_char = ""

    read_array = realtext_content.split("{{ pause 5 }}")
    for abzac in read_array:
        sleep(3)
        for bukvo_index in range(0, len(abzac)):
            # tag checking
            current_char = abzac[bukvo_index]
            if current_char == "<":
                isTag = True
                current_tag += current_char
            elif current_char == ">":
                isTag = False
                current_tag += current_char
                # print(f"=======TAG TO WRITE: {current_tag}")
                text_to_matrix(current_tag)
                current_tag = ""
            elif isTag and current_char != ">":
                current_tag += current_char
            else:
                # print(f"To write: {current_char}")
                text_to_matrix(current_char)
            # END OF BUKVA
            sleep(0.07)
        # END OF ABZAC


# MAIN FUNC
def load_text(name):
    print("FUNC STARTED!")
    global donottriggeragain
    donottriggeragain = True
    # PATH = "/home/rodion_ugarov/git/private-repo/python/python2022/flask/flask_learning/"

    loading_count = 20  # loading before starting text
    defaultize_base()

    cp_command = f"cp {TEMPLATES_FOLDER}base.html {TEMPLATES_FOLDER}base_backup.html"
    os.system(cp_command)
    #
    # for i in range(0, 5):
    #     print(i)
    # f = open

    # OPENING PASHKINAS TEXT 1

    # INIT
    # Read first text file
    # WAKE UP NEO
    realtext_content = read_textfile("realtext1")

    # To add loading bar                                              # RETURN ME
    loading_string = "Loading........Podozhdite.......eshe nemnogo..."
    for i in loading_string:
        sleep(0.1)
        text_to_matrix(i)

    sleep(3)              # RETURN ME

    new_loading_string = ""

    for i in range(0, 10):
        sleep(0.2)
        for i in loading_string:
            if random.randint(1, 100) < 50:
                char = get_random_char()
            else:
                char = i

            color_chance = random.randint(1, 100)
            if color_chance < 15:
                # <td style=\"color:#ffffff\">"
                # <td style=\"color:#00ff00\">"
                # <font color=white>123123123123213
                char = f"<font color=white>{char}</font>"
            elif color_chance < 60:
                char = f"<font color=green>{char}</font>"
            else:
                char = f"<font color=#00ff00>{char}</font>"
            new_loading_string += char
            # print(new_loading_string)
            defaultize_base()
            text_to_matrix(
                f"<table>{new_loading_string}")
        new_loading_string = ""
    sleep(1)

    defaultize_base()
    print("matrix started...")
    while not matrix_func():
        pass
    loop()
    matrix_ended = True

    defaultize_base()
    for i in "...":
        sleep(0.2)
        text_to_matrix(i)
    read_and_write_content(realtext_content)

    # SPOILER HTML
    # <details>
    #     <summary>Details</summary>
    #     Something small enough to escape casual notice.
    # </details>
    #
    # realtext_content = read_textfile("realtext2")
    # sleep(0.1)
    # text_to_matrix(realtext_content)
    # # defaultize_base("full_default")
    print("matrix was finished")
    # RETURN ME END

    # PRINTING TEXT

    # LAST FILE
    # to_default_cp = f"cp {TEMPLATES_FOLDER}last.html {TEMPLATES_FOLDER}base.html"
    # os.system(to_default_cp)
    donottriggeragain = False
    print("FUNC FINISHED!")


@app.before_first_request
def before_first_request():
    threading.Thread(target=update_load).start()


def update_load():
    global writing_now

    with app.app_context():
        while True:
            sleep(0.1)
            if not writing_now:
                turbo.push(turbo.replace(
                    render_template('skeleton_matrix.html'), 'matrix'))


@app.route('/go', methods=['GET'])
def user():
    if not donottriggeragain:
        # load_text("yes")
        x = threading.Thread(target=load_text, args=(1,))
        x.start()
    return render_template("base.html")


@app.route('/matrix', methods=['GET'])
def matrix():
    return render_template("skeleton_matrix.html")


@app.route('/test', methods=['GET'])
def test():
    return render_template("after_matrix.html")


#
# @app.route('/after_matrix', methods=['GET'])
# def after_matrix():
#     return render_template("after_matrix.html")

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
