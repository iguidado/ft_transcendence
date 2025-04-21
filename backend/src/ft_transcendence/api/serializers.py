from .models import User, Match
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
from PIL import Image
from django.core.exceptions import ValidationError

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
		fields = ['username', 'displayName', 'is_online', 'avatar']

class UserProfileSerializer(serializers.ModelSerializer):
    match_history = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'displayName', 'avatar', 'wins', 'game_played', 'match_history', 'is_2fa_enabled', 'friends', 'win_ratio']

    def to_representation(self, instance):
        # Obtenir la représentation standard
        representation = super().to_representation(instance)
        
        # Forcer l'avatar à être un chemin relatif
        if representation['avatar'] and 'http' in representation['avatar']:
            # Extraire uniquement le chemin relatif
            representation['avatar'] = f"/media/avatars/{representation['avatar'].split('avatars/')[-1]}"
        
        return representation

    def get_match_history(self, obj):
        matchs = Match.objects.filter(Q(player_one=obj) | Q(player_two=obj)).order_by('-date')
        return MatchSerializer(matchs, many=True).data
    
    def get_friends(self, obj):
        friends = obj.friends.all()
        return FriendSerializer(friends, many=True).data


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
		if len(value) > 15:
			raise serializers.ValidationError("Displayname must at most have 15 characters")
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
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = get_user_model()
        fields = ['avatar']
        
    def validate_avatar(self, value):
        if value is None:
            raise serializers.ValidationError("Avatar is required")
        try:
            img = Image.open(value)
            if img.format not in ['JPEG', 'PNG']:
                raise serializers.ValidationError("Only JPEG and PNG formats are supported.")
        except Exception:
            raise serializers.ValidationError("Invalid image file.")
        
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
		fields = ['username', 'displayName', 'win_ratio', 'avatar', 'wins', 'looses']


