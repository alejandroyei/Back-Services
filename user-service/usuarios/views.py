from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Usuario
from .serializers import UsuarioSerializer, LoginSerializer


class UsuarioViewSet(viewsets.ModelViewSet):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        # El registro es el único endpoint público; el resto conserva JWT.
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data)
