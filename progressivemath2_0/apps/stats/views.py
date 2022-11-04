from django.http import HttpResponse
from .models import Theme, Student, Work, Grade, Log, Admin
from django.db.models import Sum
from django.views.decorators.http import require_http_methods
import json

from .customfunctions import get_variable, login_password_creator


@require_http_methods(["GET"])
def index(request):
    return HttpResponse('Hello world!')


# region [theme region]
@require_http_methods(["GET"])
def get_theme(request):
    id_ = get_variable("id", request)
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if not id_:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано id работы.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    theme = Theme.objects.get(id=id_)
    if not theme:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Тема не найдена.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    if theme.type == 0:
        text = 'домашняя работа'
    elif theme.type == 1:
        text = 'классная работа'
    elif theme.type == 2:
        text = 'блиц'
    elif theme.type == 3:
        text = 'экзамен письменный'
    elif theme.type == 4:
        text = 'экзамен устный'
    else:
        text = 'вне статистики'
    theme_info = {"id": theme.id, "name": theme.name, "type": theme.type, "type_text": text}
    return HttpResponse(
        json.dumps({'state': 'success', 'message': '', 'details': {'theme': theme_info}}, ensure_ascii=False),
        status=200)


@require_http_methods(["GET"])
def get_themes(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    themes_ = Theme.objects.all()
    themes_list = []
    for theme in themes_:
        if theme.type == 0:
            text = 'домашняя работа'
        elif theme.type == 1:
            text = 'классная работа'
        elif theme.type == 2:
            text = 'блиц'
        elif theme.type == 3:
            text = 'экзамен письменный'
        elif theme.type == 4:
            text = 'экзамен устный'
        else:
            text = 'вне статистики'
        theme_info = {"id": theme.id, "name": theme.name, "type": theme.type, "type_text": text}
        themes_list.append(theme_info)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': '', 'details': {'themes': themes_list}}, ensure_ascii=False),
        status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def create_theme(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=400)
    try:
        theme = Theme(name=request_body["name"], type=request_body["type"])
        theme.save()
        log = Log(operation='INSERT', from_table='themes', details='Добавлена новая тема в таблицу themes.')
        log.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        print(e)
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Тема успешно добавлена.', 'details': {}}, ensure_ascii=False),
        status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def delete_theme(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=400)
    try:
        theme = Theme.objects.get(id=request_body["id"])
        log_details = f'Удалена тема из таблицы themes. ["id": {theme.id} | "name": "{theme.name}" | "type": {theme.type}]'
        theme.delete()
        log = Log(operation='DELETE', from_table='themes', details=log_details)
        log.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        print(e)
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Тема успешно удалена.', 'details': {}}, ensure_ascii=False),
        status=205)


# todo: обработка ошибок
@require_http_methods(["DELETE"])
def delete_themes(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    try:
        themes = Theme.objects.all()
        for theme in themes:
            Log(operation='DELETE', from_table='themes',
                details=f'Удалена тема из таблицы themes. ["id": {theme.id} | "name": "{theme.name}" | "type": {theme.type}]').save()
        themes.delete()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        print(e)
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Все темы успешно удалены.', 'details': {}}, ensure_ascii=False),
        status=205)
# endregion


# region [work region]
@require_http_methods(["GET"])
def get_works(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    works = Work.objects.all()
    works_list = []
    for work in works:
        theme = Theme.objects.get(id=work.theme_id)
        if theme.type == 0:
            text = 'домашняя работа'
        elif theme.type == 1:
            text = 'классная работа'
        elif theme.type == 2:
            text = 'блиц'
        elif theme.type == 3:
            text = 'экзамен письменный'
        elif theme.type == 4:
            text = 'экзамен устный'
        else:
            text = 'вне статистики'
        work_info = {"id": work.id, "name": work.name, "theme_id": work.theme_id, "grades": work.grades.split('_._'),
                     "max_score": work.max_score, "exercises": work.exercises, "theme_name": theme.name, "type_text": text}
        works_list.append(work_info)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': '', 'details': {'works': works_list}}, ensure_ascii=False),
        status=200)


@require_http_methods(["POST"])
def get_some_works(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=400)
    try:
        works_list = []
        if "works" not in request_body:
            return HttpResponse(
                json.dumps(
                    {'state': 'error', 'message': f'Работы не найдены.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=404)
        works_order = list(map(int, request_body["works"]))
        works = Work.objects.filter(id__in=works_order)
        if not works:
            return HttpResponse(
                json.dumps({'state': 'error', 'message': f'Работы не найдены.', 'details': {}, 'instance': request.path},
                           ensure_ascii=False), status=404)
        for work in works:
            theme = Theme.objects.get(id=work.theme_id)
            if theme.type == 0:
                text = 'домашняя работа'
            elif theme.type == 1:
                text = 'классная работа'
            elif theme.type == 2:
                text = 'блиц'
            elif theme.type == 3:
                text = 'экзамен письменный'
            elif theme.type == 4:
                text = 'экзамен устный'
            else:
                text = 'вне статистики'
            work_info = {"id": work.id, "name": work.name, "theme_id": work.theme_id, "grades": work.grades.split('_._'),
                         "max_score": work.max_score, "exercises": work.exercises, "theme_name": theme.name, "type_text": text}
            works_list.append(work_info)
        print(works_list)
        return HttpResponse(
            json.dumps({'state': 'success', 'message': 'Работы возвращены.', 'details': {'works': works_list}}, ensure_ascii=False),
            status=200)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)


@require_http_methods(["GET"])
def get_works_id(request):
    filter_ = get_variable("filter", request)
    param = get_variable("param", request)
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if not filter_:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указан фильтр.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    else:
        if not param:
            return HttpResponse(
                json.dumps(
                    {'state': 'error', 'message': f'Не указаны параметры фильтра.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=404)
    if filter_ == 'theme_id':
        works = Work.objects.filter(theme_id=param)
        works_id_list = list(works.values_list('id', flat=True))
        if not works:
            return HttpResponse(
                json.dumps({'state': 'error', 'message': f'Работы не найдены.', 'details': {}, 'instance': request.path},
                           ensure_ascii=False), status=200)
    elif filter_ == 'theme_type':
        themes = Theme.objects.filter(type=param)
        if not themes:
            return HttpResponse(
                json.dumps({'state': 'error', 'message': f'Темы не найдены.', 'details': {}, 'instance': request.path},
                           ensure_ascii=False), status=404)
        works = Work.objects.filter(theme_id__in=themes)
        works_id_list = list(works.values_list('id', flat=True))
        if not works:
            return HttpResponse(
                json.dumps({'state': 'error', 'message': f'Работы не найдены.', 'details': {}, 'instance': request.path},
                           ensure_ascii=False), status=404)
    else:
        works_id_list = []
    return HttpResponse(
        json.dumps({'state': 'success', 'message': f'', 'details': {'works': works_id_list}},
                   ensure_ascii=False), status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def create_work(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    try:
        grades_list = request_body["grades"].replace(',', '.').split()
        max_score = 0
        for grade in grades_list:
            cast = float(grade)
            max_score += cast
        grades = '_._'.join(grades_list)
        work = Work(name=request_body["name"], grades=grades, theme_id=request_body["theme_id"], max_score=max_score, exercises=len(grades_list))
        work.save()
        log = Log(operation='INSERT', from_table='works', details='Добавлена новая работа в таблицу works.')
        log.save()
        students = Student.objects.all()[1:]
        for student in students:
            empty_grades = '_._'.join(list('#' * len(grades_list)))
            grade = Grade(student_id=student.id, work_id=work.id, grades=empty_grades, max_score=0, score=0, exercises=0)
            grade.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Работа успешно добавлена.', 'details': {}}, ensure_ascii=False), status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def update_work(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    try:
        grades_list = request_body["grades"].replace(',', '.').split()
        max_score = 0
        for grade in grades_list:
            cast = float(grade)
            max_score += cast
        grades = '_._'.join(grades_list)
        work = Work.objects.get(id=request_body["id"])
        old_grades = work.grades
        old_maximum = work.max_score
        work.grades = grades
        work.max_score = max_score
        work.save()
        log = Log(operation='UPDATE', from_table='works', details=f'Изменена работа {request_body["id"]} в таблице works. ["grades": "{old_grades}", "max_score": "{old_maximum}"]')
        log.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Работа успешно обновлена.', 'details': {}}, ensure_ascii=False), status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def delete_work(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=400)
    try:
        work = Work.objects.get(id=request_body["id"])
        log_details = f'Удалена работа из таблицы works. ["id": {work.id} | "name": "{work.name}" | "grades": {", ".join(map(str, work.grades.split("_._")))} | "max_score": "{work.max_score}" | "exercises": "{work.exercises}" | "theme_id": {work.theme_id}]'
        work.delete()
        log = Log(operation='DELETE', from_table='works', details=log_details)
        log.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Работа успешно удалена.', 'details': {}}, ensure_ascii=False),
        status=205)


@require_http_methods(["DELETE"])
def delete_works(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    try:
        works = Theme.objects.all()
        for work in works:
            Log(operation='DELETE', from_table='works',
                details=f'Работа удалена из таблицы works. ["id": {work.id} | "name": "{work.name}" | "grades": {", ".join(map(str, work.grades.split("_._")))} | "max_score": "{work.max_score}" | "exercises": "{work.exercises}" | "theme_id": {work.theme_id}]').save()
        works.delete()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Все работы успешно удалены.', 'details': {}}, ensure_ascii=False),
        status=205)
# endregion


# region [student region]
# todo: обработка ошибок
@require_http_methods(["GET"])
def get_student(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    id_ = get_variable("id", request)
    if not id_:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано id ученика.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    logged_user = Student.objects.get(id=request.session["id"])
    if not (logged_user.is_admin == 1 or logged_user.id == id_):
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    student = Student.objects.get(id=id_)
    student_info = {"id": student.id, "name": student.name, "login": student.login, "password": student.password,
                    "level": student.level, "mana_earned": student.mana_earned,
                    "last_homework_id": student.last_homework_id, "last_classwork_id": student.last_classwork_id}
    return HttpResponse(
        json.dumps({'state': 'success', 'message': '', 'details': {'student': student_info}}, ensure_ascii=False),
        status=200)


@require_http_methods(["GET"])
def get_students(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    students = Student.objects.all()[1:]
    students_list = []
    for student in students:
        student_info = {"id": student.id, "name": student.name, "login": student.login, "password": student.password,
                        "level": student.level, "mana_earned": student.mana_earned,
                        "last_homework_id": student.last_homework_id, "last_classwork_id": student.last_classwork_id}
        students_list.append(student_info)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': '', 'details': {'students': students_list}}, ensure_ascii=False),
        status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def create_student(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    try:
        students = Student.objects.all()
        if students:
            last_student = students.latest("id")
            last_id = last_student.id
        else:
            last_id = 0
        id_, login_, password_ = login_password_creator(request_body["name"], last_id + 1)
        student = Student(id=last_id + 1, name=request_body["name"], login=login_, password=password_)
        student.save()
        log = Log(operation='INSERT', from_table='students', details='Добавлен новый ученик в таблицу students.')
        log.save()
        works = Work.objects.all()
        for work in works:
            grades = work.grades.split('_._')
            empty_grades = '_._'.join(list('#'*len(grades)))
            grade = Grade(student_id=student.id, work_id=work.id, grades=empty_grades, max_score=0, score=0, exercises=0)
            grade.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Ученик успешно добавлен.', 'details': {}}, ensure_ascii=False),
        status=200)


# todo: обработка ошибок
@require_http_methods(["POST"])
def delete_student(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=400)
    try:
        student = Student.objects.get(id=request_body["id"])
        log_details = f'Удален ученик из таблицы students. ["id": {student.id} | "name": "{student.name}" | "login": {student.login} | "password": {student.password} | "level": {student.level} | "mana_earned": {student.mana_earned} | "last_homework_id": {student.last_homework_id} | "last_classwork_id": {student.last_classwork_id}]'
        student.delete()
        log = Log(operation='DELETE', from_table='students', details=log_details)
        log.save()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Ученик успешно удален.', 'details': {}}, ensure_ascii=False),
        status=205)


# todo: обработка ошибок
@require_http_methods(["DELETE"])
def delete_students(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    try:
        students = Student.objects.all()
        for student in students:
            Log(operation='DELETE', from_table='students',
                details=f'Удален ученик из таблицы students. ["id": {student.id} | "name": "{student.name}" | "login": {student.login} | "password": {student.password} | "level": {student.level} | "mana_earned": {student.mana_earned} | "last_homework_id": {student.last_homework_id} | "last_classwork_id": {student.last_classwork_id}]').save()
        students.delete()
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    return HttpResponse(
        json.dumps({'state': 'success', 'message': 'Все ученики успешно удалены.', 'details': {}}, ensure_ascii=False),
        status=205)


# endregion


# region [grade region]
@require_http_methods(["POST"])
def insert_grades(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    try:
        for change in request_body["changes"]:
            work = Work.objects.get(id=int(change["work_id"]))
            student = Student.objects.get(id=int(change["student_id"]))
            grade = Grade.objects.get(student_id=student, work_id=work)
            works_grades = list(map(float, work.grades.split("_._")))
            new_grades = grade.grades.split("_._")
            if change["value"] == '':
                change["value"] = '#'
            new_grades[int(change["cell_number"])] = change["value"]
            new_exercises = work.exercises
            if work.exercises < len(new_grades):
                return HttpResponse(
                    json.dumps({'state': 'error', 'message': f'Неверное количество оценок.', 'details': {}, 'instance': request.path},
                               ensure_ascii=False), status=400)
            new_score = 0
            for i in range(len(new_grades)):
                if ',' in new_grades[i]:
                    new_grades[i] = new_grades[i].replace(',', '.')
                if new_grades[i] == '-':
                    works_grades[i] = 0
                    new_exercises -= 1
                    continue
                elif new_grades[i] == '#':
                    cast = 0
                else:
                    cast = float(new_grades[i])
                    if cast < 0:
                        return HttpResponse(
                            json.dumps({'state': 'error', 'message': f'Указано недопустимое значение.', 'details': {"student_id": change["student_id"], "work_id": change["work_id"], "cell_number": change["cell_number"], "cell_name": f'{change["student_id"]}_{change["work_id"]}_{change["cell_number"]}'},
                                        'instance': request.path},
                                       ensure_ascii=False), status=400)
                    if cast > float(works_grades[i]):
                        return HttpResponse(
                            json.dumps({'state': 'error', 'message': f'Указанная оценка больше максимальной.', 'details': {"student_id": change["student_id"], "work_id": change["work_id"], "cell_number": change["cell_number"], "cell_name": f'{change["student_id"]}_{change["work_id"]}_{change["cell_number"]}'},
                                        'instance': request.path},
                                       ensure_ascii=False), status=400)
                new_score += cast
            log_grades_string = grade.grades
            new_max_score = sum(works_grades)
            new_grades_string = '_._'.join(new_grades)
            theme = Theme.objects.get(id=work.theme_id)
            if theme.type == 0:
                percentage = float(new_score) / float(new_max_score) * 100
                print(percentage, float(new_score), float(new_max_score))
                if 0 < percentage <= 25:
                    mana = 1
                elif 25 < percentage <= 50:
                    mana = 2
                elif 50 < percentage <= 75:
                    mana = 3
                elif 75 < percentage <= 100:
                    mana = 4
                else:
                    mana = 0
            elif theme.type == 2:
                score = float(new_score)
                if 0 <= score < 0.9:
                    mana = 0
                elif 0.9 <= score < 2.4:
                    mana = 1
                elif 2.4 <= score <= 3:
                    mana = 2
                else:
                    mana = 0
            elif theme.type == 3:
                score = float(new_score)
                if score == 1:
                    mana = 1
                elif score == 2:
                    mana = 2
                elif score == 3:
                    mana = 3
                elif score >= 4:
                    mana = 4
                else:
                    mana = 0
            else:
                mana = 0
            grade.grades = new_grades_string
            grade.max_score = new_max_score
            grade.score = new_score
            grade.exercises = new_exercises
            grade.mana = mana
            log_details = f'Обновлены оценки для ученика {student.id} в работе {work.id}. ["old_grades": {log_grades_string}, "new_grades": {new_grades_string}]'
            grade.save()
            log = Log(operation='UPDATE', from_table='grades', details=log_details)
            log.save()
        return HttpResponse(json.dumps({'state': 'success', 'message': 'Оценки успешно обновлены.', 'details': {}}, ensure_ascii=False), status=200)
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except ValueError:
        change = change
        return HttpResponse(json.dumps({'state': 'error', 'message': f'Указаны недопустимые символы.', 'details': {"student_id": change["student_id"], "work_id": change["work_id"], "cell_number": change["cell_number"], "cell_name": f'{change["student_id"]}_{change["work_id"]}_{change["cell_number"]}'}, 'instance': request.path},
                                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)


# todo: обработка херовых значений в request_body["works"]
@require_http_methods(["POST"])
def get_grades(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    try:
        works_order = list(map(int, request_body["works"]))
        grades = Grade.objects.filter(work_id__in=works_order)
        students = Student.objects.all()[1:]
        students_grades = {}
        students_list = {}
        for student in students:
            students_list[student.id] = student.name
            student_grades = {}
            for work in works_order:
                current_student_grades = grades.get(work_id=work, student_id=student.id)
                current_student_grades_list = current_student_grades.grades.split("_._")
                for i in range(len(current_student_grades_list)):
                    if current_student_grades_list[i] == '#':
                        current_student_grades_list[i] = ''
                student_grades[str(work)] = current_student_grades_list
            students_grades[str(student.id)] = student_grades
        return HttpResponse(json.dumps({'state': 'success', 'message': 'Оценки успешно возвращены.', 'details': {"grades": students_grades, "students": students_list}}, ensure_ascii=False), status=200)
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)


@require_http_methods(["GET"])
def get_mana_waiters(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    try:
        waiters = []
        students = Student.objects.filter(is_admin=0)
        for student in students:
            mana_earned = int(student.mana_earned)
            grades = Grade.objects.filter(student_id=student)
            mana = int(grades.aggregate(Sum('mana'))['mana__sum'])
            waiting_mana = mana - mana_earned
            #waiter = {f'{student.id}': {'mana': waiting_mana, 'name': student.name}}
            waiter = {"id": student.id, "mana": waiting_mana, "name": student.name}
            if waiting_mana > 0:
                waiters.append(waiter)
        return HttpResponse(json.dumps({'state': 'success', 'message': 'Ожидающие ману успешно получены.', 'details': {'waiters': waiters}}, ensure_ascii=False), status=200)
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)


@require_http_methods(["POST"])
def get_some_mana_waiters(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path}, ensure_ascii=False), status=400)
    try:
        waiters = []
        for student in request_body["students"]:
            student = Student.objects.get(id=int(student))
            mana_earned = int(student.mana_earned)
            grades = Grade.objects.filter(student_id=student)
            mana = int(grades.aggregate(Sum('mana'))['mana__sum'])
            waiting_mana = mana - mana_earned
            waiter = {f'{student.id}': {'mana': waiting_mana, 'name': student.name}}
            if waiting_mana > 0:
                waiters.append(waiter)
        return HttpResponse(json.dumps({'state': 'success', 'message': 'Ожидающие ману успешно получены.', 'details': {'waiters': waiters}}, ensure_ascii=False), status=200)
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)


# todo: обработка ошибок(выдача маны > чем возможно)
@require_http_methods(["POST"])
def give_mana(request):
    if request.session:
        if "id" in request.session.keys():
            student = Student.objects.get(id=request.session["id"])
            if not student.is_admin:
                return HttpResponse(json.dumps(
                    {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                    ensure_ascii=False), status=403)
        else:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=403)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Отказано в доступе.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    id_ = get_variable("id", request)
    mana = get_variable("mana", request)
    if not id_:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указан id ученика.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    if not mana:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано количество маны.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    try:
        student = Student.objects.get(id=int(id_))
        old_mana = int(student.mana_earned)
        new_mana = old_mana + int(mana)
        student.mana_earned = new_mana
        log_details = f'Обновлена мана для ученика {student.id}. ["old_mana": {old_mana}, "new_mana": {new_mana}]'
        student.save()
        log = Log(operation='UPDATE', from_table='student', details=log_details)
        log.save()
        return HttpResponse(json.dumps({'state': 'success', 'message': 'Мана успешно выдана.', 'details': {}}, ensure_ascii=False), status=200)
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)
    except Exception as e:
        return HttpResponse(json.dumps({'state': 'error', 'message': f'{e}', 'details': {}, 'instance': request.path},
                                       ensure_ascii=False), status=404)


# endregion


# region [sessions region]
@require_http_methods(["POST"])
def login(request):
    if "id" in request.session.keys():
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Вы уже авторизованы.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=403)
    if request.body:
        request_body = json.loads(request.body)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Body запроса пустое.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=400)
    try:
        login_ = request_body["login"]
        password_ = request_body["password"]
        user = Student.objects.get(login=login_)
        if not user:
            return HttpResponse(json.dumps(
                {'state': 'error', 'message': 'Пользователь не существует.', 'details': {}, 'instance': request.path},
                ensure_ascii=False), status=404)
        if user.password == password_:
            request.session['login'] = login_
            request.session['id'] = user.id
        else:
            return HttpResponse(
                json.dumps({'state': 'error', 'message': 'Неверный пароль.', 'details': {}, 'instance': request.path},
                           ensure_ascii=False), status=400)
        return HttpResponse(
            json.dumps({'state': 'success', 'message': 'Вход успешно выполнен.', 'details': {}}, ensure_ascii=False),
            status=200)
    except KeyError as e:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': f'Не указано поле {e}.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=404)


@require_http_methods(["GET"])
def logout(request):
    if "id" in request.session.keys():
        request.session.delete()
        return HttpResponse(
            json.dumps({'state': 'success', 'message': 'Не авторизован.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=200)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Не авторизован.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=401)


@require_http_methods(["GET"])
def me(request):
    if "id" in request.session.keys():
        id_ = request.session['id']
        student = Student.objects.get(id=id_)
        if student.is_admin:
            admin = Admin.objects.get(student_id=student)
            return HttpResponse(
                json.dumps({'state': 'success', 'message': 'Авторизирован.',
                            'details': {"id": id_, "is_admin": student.is_admin, "permissions": admin.permissions, "name": student.name}}, ensure_ascii=False),
                status=200)
        else:
            return HttpResponse(
                json.dumps({'state': 'success', 'message': 'Авторизирован.', 'details': {"id": id_, "is_admin": student.is_admin}}, ensure_ascii=False),
                status=200)
    else:
        return HttpResponse(
            json.dumps({'state': 'error', 'message': 'Не авторизован.', 'details': {}, 'instance': request.path},
                       ensure_ascii=False), status=401)
# endregion
