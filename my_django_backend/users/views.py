from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "full_name": f"{user.first_name} {user.last_name}".strip(),
            "avatar_url": "",
            "created_at": user.date_joined
        })

    def put(self, request):
        user = request.user
        full_name = request.data.get("full_name", "")
        avatar_url = request.data.get("avatar_url", "")
        # Divide el nombre en first_name y last_name
        names = full_name.strip().split()
        user.first_name = names[0] if names else ""
        user.last_name = " ".join(names[1:]) if len(names) > 1 else ""
        # Si tienes un campo avatar_url personalizado, guárdalo aquí (no estándar en User)
        user.save()
        return Response({"detail": "Perfil actualizado correctamente."})

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        if not email or not password:
            return Response({"detail": "Email y password requeridos"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "El usuario ya existe con este email."}, status=400)
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=False
        )
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_link = f'http://localhost:5173/activate/{uid}/{token}/'
        send_mail(
            'Activa tu cuenta',
            f'Activa tu cuenta haciendo clic aquí: {activation_link}',
            'no-reply@educaia.com',
            [email]
        )
        return Response({"detail": "Usuario creado. Revisa tu correo para activar la cuenta."}, status=201)

class ActivateView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"detail": "Cuenta activada correctamente."})
        return Response({"detail": "Enlace inválido o expirado."}, status=400)

class UserCoursesCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # Simulación: Devuelve 0, adapta a tu modelo real si lo tienes
        return Response({"count": 0})

class UserNotificationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # Simulación: Devuelve notificaciones de ejemplo
        notifications = [
            {
                "id": 1,
                "message": "Bienvenido a educaIA",
                "created_at": "2025-08-31T00:00:00Z",
                "is_read": False,
                "link": None
            },
            {
                "id": 2,
                "message": "Tu perfil está casi listo. Completa tu información para una mejor experiencia.",
                "created_at": "2025-08-30T12:00:00Z",
                "is_read": True,
                "link": "/profile/settings"
            }
        ]
        return Response(notifications)