from django.urls import path
from .views import RegisterView, ActivateView, UserCoursesCountView, UserNotificationsView
from .views import ProfileView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('activate/<uidb64>/<token>/', ActivateView.as_view(), name='activate'),
    path('courses/count/', UserCoursesCountView.as_view(), name='user-courses-count'),
    path('notifications/', UserNotificationsView.as_view(), name='user-notifications'),
        path('profile/', ProfileView.as_view(), name='user-profile'),

]