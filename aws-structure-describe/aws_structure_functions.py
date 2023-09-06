from config import *


def Cidr_Reformat(cidr):
    # todo: describe cidr and annotate below
    """
    :param cidr: dict
    :return:
    """
    chars_to_delete = "[{':}]"
    formatted_cidr = str(cidr).replace("CidrIp", "")
    for char in chars_to_delete:
        formatted_cidr = formatted_cidr.replace(char, "")
    if formatted_cidr[0] == " ":
        formatted_cidr = formatted_cidr[1:]
    return formatted_cidr


def Sg_Rule_Reformat(rule):
    """
    To reformat security group rule to proper format for gsheet update/print

    :param rule: type dict, e.g. {80: '0.0.0.0/0'}
    :return: str, eg. "80: 0.0.0.0/0"
    """
    chars_to_delete = "{}'"
    reformatted_rule = str(rule)
    for char in chars_to_delete:
        reformatted_rule = reformatted_rule.replace(char, "")
    return reformatted_rule


def Output_Data(row, data):
    """
    Depends on global variable gsheet_engine.
    Will print/write to gsheet row depending on the variable

    :param row: type: str, e.g. "A1"
    :param data: type: str, any data to be printed/updated to gsheet
    :return: True if gsheet use, False if print is using
    """
    # TODO: add this function everywhere instead of wks.update
    if gsheet_engine:
        wks.update(row, data)
        return True
    else:
        print(row, data)
        return False
