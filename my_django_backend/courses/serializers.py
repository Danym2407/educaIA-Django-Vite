from rest_framework import serializers
from .models import Course

# Serializador de Curso
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'category', 'tags', 'duration', 'rating', 'cover_image_url')
