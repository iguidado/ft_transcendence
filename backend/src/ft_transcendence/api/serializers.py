from .models import User, Match
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q

class LoginSerializer(serializers.Serializer):
	email = serializers.EmailField(required=True, help_text="Email de l'utilisateur.")
	password = serializers.CharField(write_only=True, required=True, help_text="Mot de passe de l'utilisateur.")
	
	class Meta:
		model = get_user_model()
		fields = ['email', 'password']

class VerifyOtpSerializer(serializers.Serializer):
	class Meta:
		model = get_user_model()
		fields = ['email', 'otp']

class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = ['player_one', 'player_two', 'score_p1', 'score_p2', 'winner','date']

class UserProfileSerializer(serializers.ModelSerializer):
	match_history = serializers.SerializerMethodField()
	friends = serializers.SerializerMethodField()

	class Meta:
		model = get_user_model()
		fields = ['id', 'username', 'email','displayName', 'avatar', 'date_joined', 'wins', 'looses', 'match_history', 'otp', 'otp_expiry_time', 'is_2fa_enabled', 'jwt_token', 'friends', 'win_ratio']

	def get_match_history(seld, obj):
		matchs = Match.objects.filter(Q(player_one=obj) | Q(player_two=obj)).order_by('-date')
		return MatchSerializer(matchs, many=True).data
	
	def get_friends(self, obj):
		friends = obj.friends.all()
		return FriendSerializer(friends, many=True).data



class UserRegistrationSerializer(serializers.ModelSerializer):
	confirm_password = serializers.CharField(write_only=True)

	class Meta:
		model = get_user_model()
		fields = ['id', 'username', 'email','password', 'confirm_password']
		extra_kwargs = {
			'password' : {'write_only': True},
			'confirm_password' : {'write_only': True}
		}

	def	validate(self, data):
		if data['password'] != data['confirm_password']:
			raise serializers.ValidationError({"Password does not match"})
		if User.objects.filter(email=data['email']).exists():
			raise serializers.ValidationError({"email": "This email is already in use."})
		return data

	def create(self, validated_data):
		# username = validated_data["username"]
		# password = validated_data["password"]

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
	class Meta:
		model = get_user_model()
		fields = ['is_2fa_enabled']

class UpdateAvatarSerializer(serializers.ModelSerializer):

	class Meta:
		model = get_user_model()
		fields = ['avatar']

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

class FriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['username', 'is_active', 'avatar']
		
class AddFriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['username']

class LeaderboardSerializer(serializers.ModelSerializer):
	class Meta:
		model = get_user_model()
		fields = ['username', 'win_ratio', 'avatar', 'wins', 'looses']

		
