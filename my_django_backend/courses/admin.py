from django.contrib import admin
from .models import Course, Level, Module, Lesson

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'rating']

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ['name', 'course', 'order']

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['name', 'level', 'order']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order']