import os

TEMPLATES_FOLDER = f"/home/rodion_ugarov/git/private-repo/python/python2022/flask/pashkinas/templates/"
to_default_cp = f"cp {TEMPLATES_FOLDER}strong_base_backup.html {TEMPLATES_FOLDER}base.html"
os.system(to_default_cp)
