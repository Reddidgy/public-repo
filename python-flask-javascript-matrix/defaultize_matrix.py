import os

TEMPLATES_FOLDER = f"/home/rodion_ugarov/git/private-repo/python/python2022/flask/pashkinas/templates/"
to_default_cp = f"cp {TEMPLATES_FOLDER}matrix_backup.html {TEMPLATES_FOLDER}matrix.html"
os.system(to_default_cp)
