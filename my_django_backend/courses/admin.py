from django.contrib import admin
from .models import Course, Level, Module, Lesson, LessonProgress, Enrollment

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
    list_display = ('title', 'duration')
    search_fields = ('title',)

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'watched_time', 'completed']
    list_filter = ['completed', 'lesson']
    search_fields = ['user__username', 'lesson__title']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at']
    list_filter = ['course', 'user']
    search_fields = ['user__username', 'course__title']