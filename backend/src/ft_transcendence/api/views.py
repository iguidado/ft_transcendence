from .models import User
from .serializers import UserRegistrationSerializer, UpdateDisplayNameSerializer, UpdateAvatarSerializer, UpdateUserHistoricSerializer, UserProfileSerializer, FriendSerializer, AddFriendSerializer, LoginSerializer, VerifyOtpSerializer
from datetime import timedelta
from django.utils import timezone
from rest_framework import permissions, viewsets, status
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import authenticate, login as django_login
from rest_framework.views import APIView
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
import random

class OTPService:
	@staticmethod
	def generate_otp(n=6):
		return "".join(map(str, random.sample(range(0,10), n)))
	
	@staticmethod
	def send_otp_email(email, otp):
		send_mail('Verification Code',
            f'Your verification code is: {otp}',
            'from@example.com',  #! Remplacer par email admin
            [email],
            fail_silently=False,
        )

class LoginView(APIView):
	permissions_classes = [AllowAny]
	serializer_class = LoginSerializer

	@swagger_auto_schema(
			request_body=LoginSerializer
	)
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		email = serializer.validated_data['email']
		password = serializer.validated_data['password']

		user = authenticate(request, email=email, password=password)

		if user is not None:
			user_profile = User.objects.get(user=user)

			verification_code = OTPService.generate_otp() 
			user_profile.otp = verification_code
			user_profile.otp_expiry_time = timezone.now() + timedelta(minutes=15)
			user_profile.save()

			OTPService.send_otp_email(email, verification_code)

			return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
	
		return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyOtpView(APIView):
	permissions_classes = [AllowAny]
	serializer_class = VerifyOtpSerializer

	@swagger_auto_schema(
			request_body=VerifyOtpSerializer
	)
	def post(self, request,):
		serializer = VerifyOtpSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		email = serializer.validated_data['email']
		otp = serializer.validated_data['otp']

		try:
			user_profile = User.objects.get(user__email=email)
			
			if user_profile.otp == otp and user_profile.otp_expiry_time > timezone.now():
				user = user_profile.user
				django_login(request, user)

				refresh = RefreshToken.for_user(user)
				access_token = str(refresh.access_token)

				user_profile.otp = ''
				user_profile.otp_expiry_time = None
				user_profile.save()

				return Response({
                    'access_token': access_token,
                    'refresh_token': str(refresh),
                    'detail': 'OTP verified successfully.'
                }, status=status.HTTP_200_OK)

			return Response({'detail': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

		except User.DoesNotExist:
			return Response({'detail': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
	permission_classes = [IsAuthenticated]

	@swagger_auto_schema(responses={200: UserProfileSerializer()})
	def get(self, request, *args, **kwargs):
		user = request.user
		serializer = UserProfileSerializer(user)
		return Response(serializer.data, status=status.HTTP_200_OK)

class UserListView(ListAPIView):
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserProfileSerializer
	permission_classes = [IsAuthenticated]
	

	@swagger_auto_schema(
        operation_description="Retrieve the list of all users",
        responses={200: UserProfileSerializer(many=True)}
    )

	def get(self, request, *args, **kwargs):
		return super().get(request, *args, **kwargs)

class UserProfileByUserNameView(RetrieveAPIView):
	queryset = User.objects.all()
	serializer_class = UserProfileSerializer
	permission_classes = [IsAuthenticated]
	lookup_field = "username"

class RegisterView(APIView):
	permission_classes = [AllowAny]
	serializer_class = UserRegistrationSerializer

	@swagger_auto_schema(request_body=UserRegistrationSerializer)

	def post(self, request):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDisplayNameUpdateView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = UpdateDisplayNameSerializer


	@swagger_auto_schema(request_body=UpdateDisplayNameSerializer)

	
	def patch(self, request, *args, **kwargs):
		user = request.user
		serializer = self.serializer_class(user, data=request.data, partial=True)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAvatarUpdateView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = UpdateDisplayNameSerializer


	# @swagger_auto_schema(request_body=UpdateDisplayNameSerializer)

	@swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'avatar': openapi.Schema(type=openapi.TYPE_FILE, description="Upload the avatar image"),
            },
            required=['avatar'],
        )
    )
	
	def patch(self, request, *args, **kwargs):
		user = request.user
		serializer = self.serializer_class(user, data=request.data, partial=True)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateMatchHistoricView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateUserHistoricSerializer

    @swagger_auto_schema(
        request_body=UpdateUserHistoricSerializer,
        responses={201: "Match créé et statistique mise à jour", 400: "Requête invalide"}
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            match = serializer.save()
            return Response({
                "message": "Match créé et statistique mise à jour",
                "match": UpdateUserHistoricSerializer(match).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FriendListView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		user = request.user
		friends = user.friends.all()
		serializer = FriendSerializer(friends, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
class AddFriendView(APIView):
	permission_classes = [IsAuthenticated]

	@swagger_auto_schema(request_body=AddFriendSerializer)
	def post(self, request, *args, **kwargs):
		user = request.user
		username_to_add = request.data.get('username')
		if not username_to_add:
			return Response({"detail": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)
		
		friend = get_object_or_404(User, username=username_to_add)

		if friend == user:
			return Response({"detail": "You cannot add yourself as a friend."}, status=status.HTTP_400_BAD_REQUEST)

		user.friends.add(friend)
		return Response({"detail": "Friend added successfully."}, status=status.HTTP_200_OK)