from django.urls import path
from .views import CourseListAPIView, CourseStructureAPIView
from .views import EnrollCourseAPIView
from .views import CourseProgressAPIView
from .views import LessonProgressAPIView, LessonProgressCourseAPIView



urlpatterns = [
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('courses/<int:course_id>/structure/', CourseStructureAPIView.as_view(), name='course-structure'),
    path('courses/<int:course_id>/enroll/', EnrollCourseAPIView.as_view(), name='enroll-course'),
    path('courses/<int:course_id>/progress/', CourseProgressAPIView.as_view(), name='course-progress'),
    path('lesson-progress/<int:lesson_id>/', LessonProgressAPIView.as_view(), name='lesson-progress'),
    path('lesson-progress/', LessonProgressCourseAPIView.as_view(), name='lesson-progress-list'),
     path('lesson-progress/<int:lesson_id>/', LessonProgressAPIView.as_view(), name='lesson-progress-detail'),
    path('lesson-progress/', LessonProgressCourseAPIView.as_view(), name='lesson-progress-list'),



]