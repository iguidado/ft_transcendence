from .models import User
from .serializers import UserRegistrationSerializer, UpdateDisplayNameSerializer, UpdateAvatarSerializer, UpdateUserHistoricSerializer, UserProfileSerializer, FriendSerializer, AddFriendSerializer, LoginSerializer, VerifyOtpSerializer, TwoFAUpdateSerializer, LeaderboardSerializer
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
import os

class OTPService:
	@staticmethod
	def generate_otp(n=6):
		return "".join(map(str, random.sample(range(0,10), n)))
	
	@staticmethod
	def send_otp_email(email, otp):
		admin_email = os.getenv('DB_USER_EMAIL')

		send_mail('Verification Code',
            f'Your verification code is: {otp}',
            admin_email,
            [email],
            fail_silently=False,
        )

class LoginView(APIView):
	permission_classes = [AllowAny]
	serializer_class = LoginSerializer

	@swagger_auto_schema(
			request_body=LoginSerializer,
			request_body_example={
            "username": "user",
            "password": "password123"
			}
		)
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		if serializer.is_valid():
			pass
		else:
			return Response({'detail': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)

		username = serializer.validated_data['username']
		password = serializer.validated_data['password']
		print(f"User {password} ({username})")

		user = authenticate(request, username=username, password=password)

		if user is not None:
			user_profile = user

			if user.is_2fa_enabled:
				verification_code = OTPService.generate_otp() 
				user_profile.otp_2fa = verification_code
				user_profile.otp_2fa_expiry_time = timezone.now() + timedelta(minutes=15)
				user_profile.save()

				# OTPService.send_otp_email(user.email, verification_code) #! Faire serveur mail

				return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)

			django_login(request, user)

			refresh = RefreshToken.for_user(user)
			user.jwt_token = str(refresh.access_token)
			user.save()

			return Response({
                    'access_token': user.jwt_token,
                    'refresh_token': str(refresh),
                    'detail': 'Login successful.'
                }, status=status.HTTP_200_OK)
	
		return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyLoginOtpView(APIView):
	permission_classes = [AllowAny]
	serializer_class = VerifyOtpSerializer

	@swagger_auto_schema(
			request_body=VerifyOtpSerializer
	)
	def patch(self, request):
		serializer = VerifyOtpSerializer(data=request.data)
		if not serializer.is_valid():
			return Response({'detail': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)
		otp = serializer.validated_data['otp']

		try:
			user = request.user
			
			if user.otp_2fa == otp and user.otp_2fa_expiry_time > timezone.now():
				django_login(request, user)

				refresh = RefreshToken.for_user(user)
				access_token = str(refresh.access_token)

				user.otp_2fa = ''
				user.otp_2fa_expiry_time = None
				user.save()

				return Response({
                    'access_token': access_token,
                    'refresh_token': str(refresh),
                    'detail': 'OTP verified successfully.'
                }, status=status.HTTP_200_OK)

			return Response({'detail': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

		except User.DoesNotExist:
			return Response({'detail': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
	permission_classes = [AllowAny]

	@swagger_auto_schema(responses={200: UserProfileSerializer()})
	def get(self, request, *args, **kwargs):
		user = request.user
		serializer = UserProfileSerializer(user)
		return Response(serializer.data, status=status.HTTP_200_OK)

class UserListView(ListAPIView):
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserProfileSerializer
	permission_classes = [AllowAny]
	

	@swagger_auto_schema(
        operation_description="Retrieve the list of all users",
        responses={200: UserProfileSerializer(many=True)}
    )

	def get(self, request, *args, **kwargs):
		return super().get(request, *args, **kwargs)

class UserProfileByUserNameView(RetrieveAPIView):
	queryset = User.objects.all()
	serializer_class = UserProfileSerializer
	permission_classes = [AllowAny]
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
	permission_classes = [AllowAny]
	serializer_class = UpdateDisplayNameSerializer


	@swagger_auto_schema(request_body=UpdateDisplayNameSerializer)

	
	def patch(self, request, *args, **kwargs):
		user = request.user
		serializer = self.serializer_class(user, data=request.data, partial=True)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TwoFAUpdateView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = TwoFAUpdateSerializer

	@swagger_auto_schema(request_body=TwoFAUpdateSerializer)

	def patch(self, request, *args, **kwargs):
		user = request.user
		serializer = self.serializer_class(user, data=request.data, partial=True)

		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		action = serializer.validated_data['action']

		if action == 'disable':
			user.is_2fa_enabled = False
			user.save()
			return Response({'detail': 'Two-factor authentication disabled.'}, status=status.HTTP_200_OK)

		elif action == 'enable':
			email = serializer.validated_data['email']
			if email:
				verification_code = OTPService.generate_otp()
				user.otp_email = verification_code
				user.email = email
				user.otp_email_expiry_time = timezone.now() + timedelta(minutes=15)
				user.save()

				# OTPService.send_otp_email(email, verification_code) #! Faire serveur mail
				return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)	
			# return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailOtpView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = VerifyOtpSerializer

	@swagger_auto_schema(
			request_body=VerifyOtpSerializer
	)
	def patch(self, request,):
		serializer = VerifyOtpSerializer(data=request.data)
		if not serializer.is_valid():
			return Response({'detail': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)
		otp = serializer.validated_data['otp']

		user = request.user
		if user.otp_email == otp and user.otp_email_expiry_time > timezone.now():
			user.is_2fa_enabled = True
			user.otp_email = ''
			user.otp_email_expiry_time = None
			user.save()
			return Response({'detail': 'Two-factor authentication enabled.'}, status=status.HTTP_200_OK)
		user.email = None
		user.save()
		return Response({'detail': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)


class UserAvatarUpdateView(APIView):
	permission_classes = [AllowAny]
	serializer_class = UpdateAvatarSerializer


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
    permission_classes = [AllowAny]
    serializer_class = UpdateUserHistoricSerializer

    @swagger_auto_schema(
			operation_description="Create a match and update the user statistics",
        request_body=UpdateUserHistoricSerializer,
        responses={201: "Match created and stats updated", 400: "Invalid request"}
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            match = serializer.save()
            return Response({
                "message": "Match created and stats updated",
                "match": UpdateUserHistoricSerializer(match).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FriendListView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, *args, **kwargs):
		user = request.user
		friends = user.friends.all()
		serializer = FriendSerializer(friends, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
class AddFriendView(APIView):
	permission_classes = [AllowAny]

	@swagger_auto_schema(
			operation_description="Add a friend by username",
			request_body=AddFriendSerializer)
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

class LeaderBoardView(APIView):
	permission_classes = [AllowAny]

	@swagger_auto_schema(
			operation_description="Retrieve the top 10 users based on win ratio",
			responses={200: LeaderboardSerializer(many=True)}
	)
	def get(self, request, *args, **kwargs):
		users = User.objects.all().order_by('-win_ratio')[:10]
		serializer = LeaderboardSerializer(users, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)