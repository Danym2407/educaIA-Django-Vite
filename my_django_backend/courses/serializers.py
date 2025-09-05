from rest_framework import serializers
from .models import Course, LessonProgress, Enrollment

class CourseSerializer(serializers.ModelSerializer):
    enrolled = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'description', 'category', 'tags', 'duration', 'rating', 'cover_image_url',
            'enrolled', 'completed'
        )

    def get_enrolled(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return Enrollment.objects.filter(user=user, course=obj).exists()
        return False

    def get_completed(self, obj):
        user = self.context.get('request').user
        if not user.is_authenticated:
            return False
        # Un curso está completado si TODAS las lecciones están completadas por el usuario
        lessons = obj.levels.prefetch_related('modules__lessons').values_list('modules__lessons__id', flat=True)
        total_lessons = len(lessons)
        if total_lessons == 0:
            return False
        completed_count = LessonProgress.objects.filter(
            user=user, lesson_id__in=lessons, completed=True
        ).count()
        return completed_count == total_lessons

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'user', 'lesson', 'watched_time', 'completed']
        read_only_fields = ['user', 'lesson']
        
class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'enrolled_at']