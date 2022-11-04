from django.db import connection
from django.utils.datastructures import MultiValueDictKeyError
from transliterate import translit
import random


def get_variable(variable_name, source_request):
    """
    Function for parse variable from url.
    variable_name: name of variable in url.
    source_request: django request object.
    RETURN: variable value or None.
    """
    try:
        variable = source_request.GET[variable_name]
        return variable
    except MultiValueDictKeyError:
        return None
    except Exception as e:
        return None


def execute_sql(query: str, params: list):
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            result = cursor.fetchall()

        return result
    except Exception as e:
        print(e)


def login_password_creator(name, id_):
    """
    Фамилия Имя, строка, в которой ученик находится на вход
    Логин и пароль на выход
    """
    trans = translit(name, 'ru', reversed=True).split()
    if id_ < 10:
        login = trans[0][0] + trans[1][0] + '0' + str(id_)
    else:
        login = trans[0][0] + trans[1][0] + str(id_)
    password = str(random.randint(10000, 99999))
    return id_, login, password


if __name__ == '__main__':
    pass
