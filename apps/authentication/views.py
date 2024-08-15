from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import LoginSerializer

class LoginAPIView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return Response({"detail": "Successfully logged in"}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)