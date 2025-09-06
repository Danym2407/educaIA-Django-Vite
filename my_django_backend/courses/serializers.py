from rest_framework import serializers, generics
from .models import Course, LessonProgress, Enrollment, Lesson
from rest_framework.permissions import AllowAny

class CourseSerializer(serializers.ModelSerializer):
    is_enrolled = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()  # <-- Nuevo campo

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'description', 'category', 'tags', 'duration', 'rating', 'cover_image_url',
            'is_enrolled', 'completed',  # <-- Agrega aquí
        )

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.enrollments.filter(user=user).exists()
        return False

    def get_completed(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        # Obtén todas las lecciones del curso
        lesson_ids = Lesson.objects.filter(module__level__course=obj).values_list('id', flat=True)
        total = len(lesson_ids)
        if total == 0:
            return False
        completed = LessonProgress.objects.filter(user=user, lesson_id__in=lesson_ids, completed=True).count()
        return completed == total

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'user', 'lesson', 'watched_time', 'completed']
        read_only_fields = ['user', 'lesson']
        
class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'enrolled_at']

# Si quieres dejar la vista aquí, está bien, pero normalmente va en views.py
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]  # Permite acceso público

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context