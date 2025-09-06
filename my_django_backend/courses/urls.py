from django.urls import path
from .views import CourseListView, CourseStructureAPIView, EnrollCourseAPIView, CourseProgressAPIView, LessonProgressAPIView, LessonProgressCourseAPIView
from .views import LessonProgressDetail, CourseListView  # importa tu vista

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<int:course_id>/structure/', CourseStructureAPIView.as_view(), name='course-structure'),
    path('courses/<int:course_id>/enroll/', EnrollCourseAPIView.as_view(), name='enroll-course'),
    path('courses/<int:course_id>/progress/', CourseProgressAPIView.as_view(), name='course-progress'),
    path('lesson-progress/<int:lesson_id>/', LessonProgressDetail.as_view()),
    path('lesson-progress/', LessonProgressAPIView.as_view(), name='lesson-progress-list'),
    path('lesson-progress/', LessonProgressCourseAPIView.as_view(), name='lesson-progress-list'),
    path('courses/', CourseListView.as_view()),  # ejemplo

]