from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Course

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.all().order_by('-rating')[:6]
    serializer_class = None  # Usa el serializer que ya tienes, ajústalo si cambiaste el nombre

from .serializers import CourseSerializer

CourseListAPIView.serializer_class = CourseSerializer

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