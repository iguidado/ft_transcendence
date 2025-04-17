from .models import User, Match
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q

class LoginSerializer(serializers.Serializer):
	username = serializers.CharField(max_length=150, required=True)
	password = serializers.CharField(write_only=True, required=True)
	
	class Meta:
		model = get_user_model()
		fields = ['username', 'password']

class VerifyLoginOtpSerializer(serializers.Serializer):
	otp = serializers.CharField(max_length=6, required=True)
	temp_token = serializers.CharField(required=True)
	class Meta:
		model = get_user_model()
		fields = ['otp']

class VerifyEmailOtpSerializer(serializers.Serializer):
	otp = serializers.CharField(max_length=6, required=True)
	class Meta:
		model = get_user_model()
		fields = ['otp']

class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = ['player_one', 'player_two', 'score_p1', 'score_p2', 'winner','date']

class FriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['username', 'is_online', 'avatar']

class UserProfileSerializer(serializers.ModelSerializer):
	match_history = serializers.SerializerMethodField()
	friends = serializers.SerializerMethodField()
	avatar_url = serializers.SerializerMethodField()

	class Meta:
		model = get_user_model()
		fields = ['id', 'username', 'email','displayName', 'avatar_url', 'date_joined', 'wins', 'game_played', 'match_history', 'otp_2fa', 'otp_2fa_expiry_time', 'otp_email', 'otp_email_expiry_time' ,'is_2fa_enabled', 'jwt_token', 'friends', 'win_ratio', 'temp_auth_token']

	def get_match_history(seld, obj):
		matchs = Match.objects.filter(Q(player_one=obj) | Q(player_two=obj)).order_by('-date')
		return MatchSerializer(matchs, many=True).data
	
	def get_friends(self, obj):
		friends = obj.friends.all()
		return FriendSerializer(friends, many=True).data
	
	def get_avatar_url(self, obj):
		return obj.get_avatar_url()



class UserRegistrationSerializer(serializers.ModelSerializer):
	confirm_password = serializers.CharField(write_only=True)

	class Meta:
		model = get_user_model()
		fields = ['id', 'username', 'password', 'confirm_password']
		extra_kwargs = {
			'password' : {'write_only': True},
			'confirm_password' : {'write_only': True}
		}

	def	validate(self, data):
		if data['password'] != data['confirm_password']:
			raise serializers.ValidationError({"Password does not match"})
		return data

	def create(self, validated_data):
		validated_data.pop('confirm_password')
		user = get_user_model().objects.create_user(**validated_data)
		return user

class UpdateDisplayNameSerializer(serializers.ModelSerializer):

	class Meta:
		model = get_user_model()
		fields = ['displayName']

	def validate_diplayName(self, value):
		if len(value) < 3:
			raise serializers.ValidationError("Displayname must at least have 3 characters")
		return value
	
class TwoFAUpdateSerializer(serializers.ModelSerializer):
	email = serializers.EmailField(required=False, write_only=True)
	action = serializers.ChoiceField(choices=['enable', 'disable'], required=True)
	
	class Meta:
		model = get_user_model()
		fields = ['action', 'email']

	def validate(self, data):
		action = data['action']

		if action == 'enable':
			email = data['email']
			if not email :
				raise serializers.ValidationError("Email is required")
		return data

class UpdateAvatarSerializer(serializers.ModelSerializer):

	class Meta:
		model = get_user_model()
		fields = ['avatar']

	def validate_avatar(self,value):
		valid_choices = [choice[0] for choice in User.DEFAULT_AVATAR_CHOICES]
		if value not in valid_choices:
			raise serializers.ValidationError(f"Invalid avatar choice. Valid choices are: {', '.join(valid_choices)}")
		return value

class UpdateUserHistoricSerializer(serializers.ModelSerializer):

	class Meta:
		model = Match
		fields = ['player_one', 'player_two', 'score_p1', 'score_p2','date']


	def create(self, validated_data):
		match = Match.objects.create(**validated_data)

		match.set_winner()

		if match.winner == match.player_one:
			match.player_one.UpdateUserStats(True)
			match.player_two.UpdateUserStats(False)
		elif match.winner == match.player_two:
			match.player_one.UpdateUserStats(False)
			match.player_two.UpdateUserStats(True)
		else:
			match.player_one.UpdateUserStats(False)
			match.player_two.UpdateUserStats(False)
		return match
		
class AddFriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['username']

class LeaderboardSerializer(serializers.ModelSerializer):
	class Meta:
		model = get_user_model()
		fields = ['username', 'win_ratio', 'avatar', 'wins', 'looses']


