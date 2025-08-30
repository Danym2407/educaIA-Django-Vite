from rest_framework import generics
from .models import Course
from .serializers import CourseSerializer

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.all().order_by('-rating')[:6]
    serializer_class = CourseSerializer