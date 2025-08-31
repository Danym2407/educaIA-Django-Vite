from django.urls import path
from .views import CourseListAPIView, CourseStructureAPIView

urlpatterns = [
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('courses/<int:course_id>/structure/', CourseStructureAPIView.as_view(), name='course-structure'),
]