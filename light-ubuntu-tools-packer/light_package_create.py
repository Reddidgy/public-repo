import os


# Func to get output from linux to python variables
def linux(a):
    return os.popen(a).read()


# Main copying function with folder recheck
def mkdir_and_copy(from_where, to):
    from_where = str(from_where)
    to = str(to)
    # /usr/bin/curl /home/rodion_ugarov/packages/curl/usr/bin/
    # Checking created/notcreated directory for bin file
    existing = os.path.exists(to)
    if not existing:
        linux(f"mkdir {to} -p")

    # Copying new file
    existing = os.path.exists(f"{to}")
    cp_command = f"cp {from_where} {to} -r -L".replace("\n", "")
    os.system(cp_command)
    return True


# To handle archives with extractor and without
def delete_old_copy_new_tar():
    old_packages_archive_path = f"{packages_dir}packages.tar.gz"
    existing = os.path.exists(old_packages_archive_path)
    if not existing:
        os.system(f"cd {packages_dir}.. && tar zcvf /tmp/packages.tar.gz ./packages && \
        cp /tmp/packages.tar.gz {packages_dir} && rm -rf /tmp/packages.tar.gz")
    else:
        os.system(f"rm -rf {packages_dir}packages.tar.gz && \cd {packages_dir}.. && tar zcvf /tmp/packages.tar.gz ./packages && \
        cp /tmp/packages.tar.gz {packages_dir} && rm -rf /tmp/packages.tar.gz")

    return True


# to avoid problems with old files in packages folder
def clean_packages_folder():
    existing = os.path.exists(packages_dir)
    if existing:
        os.system(f"rm -rf {packages_dir}*")
    else:
        linux("mkdir ~/packages/")
    return True


# Preparation
user = linux('whoami')
user = str(user).replace("\n", "")
packages_dir = f"/home/{user}/packages/"
print(f"Packages Directory is {packages_dir}")


# libs which using for cp, mkdir, ls commands to avoid bus errors
forbidden_array = [
    '/lib/x86_64-linux-gnu/libselinux.so.1',
    '/lib/x86_64-linux-gnu/libacl.so.1',
    '/lib/x86_64-linux-gnu/libattr.so.1',
    '/lib/x86_64-linux-gnu/libc.so.6',
    '/lib/x86_64-linux-gnu/libpcre2-8.so.0',
    '/lib64/ld-linux-x86-64.so.2']

# array for further apps to process
apps = []


clean_packages_folder()

# Welcome prompt
print("This little application will help you to get little tools \
from ubuntu with all their dependencies.")
print("Please type application with space delimiter. \
 Example:\"telnet curl wget\" ")

# DEBUG
apps_input = input(":")
# apps_input = "curl telnet wget ping"
# END DEBUG

# Adding each app to array for further processing
for app in apps_input.replace("\n", "").split(" "):
    apps.append(app)
print(f"Choosen apps: {apps}")

# Main cycle of processing apps
for app in apps:
    # os.system("pwd")
    path = f"/home/{user}/packages/{app}"

    # print(f"Current path is {path}. Press any key to continue...")

    # checking created or not /home/user/packages/curl
    existing = os.path.exists(path)

    if not existing:
        print("Package path isn't exists")
        os.system(f"mkdir {path} -p")
    else:
        print(f"Package path {path} exists")

    bin_full_path = linux(f'which {app}')   # /usr/bin/curl
    bin_full_path = str(bin_full_path).replace(
        "\n", "")          # forcing to string
    bin_directory_path = ""

    # Path markup for new bin file
    for i in bin_full_path.split("/"):
        i = i.replace("\n", "")
        if i != "" and i != app:
            bin_directory_path += f"/{i}"

    # /home/username/packages/curl/usr/bin
    new_directory_path = f"{path}{bin_directory_path}/"

    mkdir_and_copy(bin_full_path, new_directory_path)

    print("Checking dependencies...")

    # list of dependencies for the package
    deps = linux(f'ldd {bin_full_path}')
    #print(deps)
    dep_paths = []
    each_dep_fullpath = ""
    # cycle 'for' for each line in dependencies
    # to create array "dep_paths" with each lib path
    # print("DEPS", deps)
    for dep in str(deps).split("\n"):
        if "/" in dep:
            for i in dep.split("/")[1:]:
                if "(" not in i:
                    each_dep_fullpath += f"/{i}"
                else:
                    i = i.split(" ")[0]
                    each_dep_fullpath += f"/{i}"
            dep_paths.append(each_dep_fullpath)
            each_dep_fullpath = ""

    new_dep_path = ""

    # Markup of folders and files for each dependency
    # Creating folders and files and finish module
    # print(dep_paths)
    for dep_path in dep_paths:
        for i in dep_path.split("/")[1:]:
            new_dep_path += f"/{i}"

        # print(f"to {path}{new_dep_path}")
        new_dep_path_arr = f"{path}{new_dep_path}".split("/")[1:-1]
        new_dep_path_wo_file = ""
        for folder in new_dep_path_arr:
            new_dep_path_wo_file += f"/{folder}"
        new_dep_path_wo_file = f"{new_dep_path_wo_file}/"
        # print(dep_path, new_dep_path_wo_file)
        mkdir_and_copy(dep_path, new_dep_path_wo_file)
        new_dep_path = ""
        new_dep_path_wo_file

# cleaning forbidden libraries
for app in apps:
    for forbidden_lib in forbidden_array:
        os.system(f"rm -rf {packages_dir}{app}{forbidden_lib}")


# copy extractor.sh inside further archive
os.system(f"cp extractor.sh {packages_dir}")

# Taring part with recheck old packages file
delete_old_copy_new_tar()

# delete extractor.sh outside the archive
os.system(f"rm {packages_dir}extractor.sh")

#
# res = linux(f"ls {packages_dir}")
# print(res.split("\n"))
# #
# for string in res.split("\n"):
#     if "extractor.sh" not in string and string != "" and "packages" not in string:
#         print(packages_dir, string)
#         linux(f"rm -rf {packages_dir}{string}")
#
# os.system(f"tar --append --file={packages_dir}packages.tar.gz extractor.sh && \
# rm {packages_dir}extractor.sh")
#
# print(f"Finished!\n These modules and extractor are inside an archive {packages_dir}packages.tar.gz")
# # print(packages_dir)
# # delete_old_copy_new_tar()
# # os.system(f"rm -rf {packages_dir}* && mv /tmp/packages.tar.gz {packages_dir}")
# #
# #
# #
# #
# #
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#

#
