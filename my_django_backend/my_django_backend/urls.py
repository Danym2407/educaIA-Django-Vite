from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('api/user/', include('users.urls')),  # <-- AGREGADO AQUÍ
    path('api/auth/', include('users.urls')),  # Si tienes endpoints de auth, déjalo, pero puedes separar las rutas de auth y user en distintos archivos si lo prefieres
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]