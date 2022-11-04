from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('theme/get', views.get_theme, name='get theme'),
    path('theme/get-all', views.get_themes, name='get all themes'),
    path('theme/create', views.create_theme, name='create theme'),
    path('theme/delete', views.delete_theme, name='delete theme'),
    path('theme/delete-all', views.delete_themes, name='delete all themes'),
    path('work/get-all', views.get_works, name='get all works'),
    path('work/get', views.get_some_works, name='get some works'),
    path('work/create', views.create_work, name='create work'),
    path('work/update', views.update_work, name='update work'),
    path('work/delete', views.delete_work, name='delete work'),
    path('work/delete-all', views.delete_works, name='delete all works'),
    path('work/get-ids', views.get_works_id, name='get works id'),
    path('student/get-all', views.get_students, name='get works'),
    path('student/get', views.get_student, name='get work'),
    path('student/create', views.create_student, name='create student'),
    path('student/delete', views.delete_student, name='delete work'),
    path('student/delete-all', views.delete_students, name='delete all works'),
    path('grade/insert', views.insert_grades, name='insert grades'),
    path('grade/get-all', views.get_grades, name='get all grades'),
    path('mana/get-all', views.get_mana_waiters, name='get all mana waiters'),
    path('mana/get', views.get_some_mana_waiters, name='get some mana waiters'),
    path('mana/give', views.give_mana, name='give mana'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('@me', views.me, name='@me'),

]
