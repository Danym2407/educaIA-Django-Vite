from rest_framework import serializers
from .models import Course, LessonProgress

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'category', 'tags', 'duration', 'rating', 'cover_image_url')

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'user', 'lesson', 'watched_time', 'completed']