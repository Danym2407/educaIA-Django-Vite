from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Course, Enrollment, Lesson, LessonProgress
from .serializers import CourseSerializer, LessonProgressSerializer

# Lista de cursos (puedes ajustar el queryset para mostrar todos o solo algunos)
class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.all().order_by('-rating')[:6]
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Lista todos los cursos (para catálogo completo)
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Estructura completa de un curso (niveles, módulos, lecciones)
class CourseStructureAPIView(APIView):
    def get(self, request, course_id):
        try:
            course = Course.objects.prefetch_related(
                'levels__modules__lessons'
            ).get(id=course_id)
        except Course.DoesNotExist:
            return Response({"detail": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "cover_image_url": course.cover_image_url,
            "levels": [
                {
                    "id": level.id,
                    "name": level.name,
                    "order": level.order,
                    "modules": [
                        {
                            "id": module.id,
                            "name": module.name,
                            "order": module.order,
                            "lessons": [
                                {
                                    "id": lesson.id,
                                    "title": lesson.title,
                                    "duration": lesson.duration,
                                    "video_id": lesson.video_id,
                                    "order": lesson.order,
                                }
                                for lesson in module.lessons.all().order_by('order')
                            ]
                        }
                        for module in level.modules.all().order_by('order')
                    ]
                }
                for level in course.levels.all().order_by('order')
            ]
        }
        return Response(data)

# Inscripción a un curso
class EnrollCourseAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        if created:
            return Response({'detail': 'Inscripción exitosa'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Ya estás inscrito en este curso'}, status=status.HTTP_200_OK)

# Progreso de un curso para el usuario autenticado
class CourseProgressAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        if not Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response({'progress': 0, 'completed': False, 'enrolled': False})
        lessons = Lesson.objects.filter(module__level__course=course)
        total_lessons = lessons.count()
        if total_lessons == 0:
            return Response({'progress': 0, 'completed': False, 'enrolled': True})
        completed_lessons = LessonProgress.objects.filter(
            user=request.user, lesson__in=lessons, completed=True
        ).count()
        progress_percent = int((completed_lessons / total_lessons) * 100)
        return Response({
            'progress': progress_percent,
            'completed': progress_percent == 100,
            'enrolled': True
        })

# Progreso de todas las lecciones de un curso para el usuario autenticado
class LessonProgressCourseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        course_id = request.GET.get('course_id')
        lessons = Lesson.objects.filter(module__level__course__id=course_id)
        progresses = LessonProgress.objects.filter(user=request.user, lesson__in=lessons)
        data = [
            {
                "lesson": p.lesson_id,
                "watched_time": p.watched_time,
                "completed": p.completed,
            }
            for p in progresses
        ]
        return Response(data)

# Guarda y recupera progreso de UNA lección
class LessonProgressAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            progress = LessonProgress.objects.get(user=request.user, lesson_id=lesson_id)
        except LessonProgress.DoesNotExist:
            return Response({'watched_time': 0, 'completed': False})
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)

    def put(self, request, lesson_id):
        progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson_id=lesson_id)
        progress.watched_time = request.data.get('watched_time', progress.watched_time)
        progress.completed = request.data.get('completed', progress.completed)
        progress.save()
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)

class LessonProgressDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            progress = LessonProgress.objects.get(user=request.user, lesson_id=lesson_id)
        except LessonProgress.DoesNotExist:
            return Response({'watched_time': 0, 'completed': False})
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)

    def put(self, request, lesson_id):
        progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson_id=lesson_id)
        watched_time = request.data.get('watched_time', 0)
        completed = request.data.get('completed', False)
        # Guarda el mayor watched_time (no retrocede si el usuario rebobina)
        progress.watched_time = max(progress.watched_time, int(watched_time))
        progress.completed = completed or progress.completed
        progress.save()
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)