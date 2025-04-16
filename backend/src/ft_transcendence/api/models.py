from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone
from django.templatetags.static import static

class CustomeUserManager(UserManager):
	def _create_user(self, username, password, **extra_fields):
		if not username:
			raise ValueError("You have not provided a valid username")
		if not password:
			raise ValueError("You must provide a password")
		user = self.model(username=username, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, username=None, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		return self._create_user(username, password, **extra_fields)
	
	def create_superuser(self, username, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		return self._create_user(username, password, **extra_fields)
	
class User(AbstractBaseUser, PermissionsMixin):
	username = models.CharField(max_length=150, unique=True)
	email = models.EmailField(unique=True, blank=True, null=True)
	displayName = models.CharField(max_length=150, unique=False, blank=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	win_ratio = models.FloatField(default=0.0)

	jwt_token = models.CharField(max_length=512, blank=True, null=True)
	otp_2fa = models.CharField(max_length=6, blank=True)
	otp_email = models.CharField(max_length=6, blank=True)
	otp_2fa_expiry_time = models.DateTimeField(blank=True, null=True)
	otp_email_expiry_time = models.DateTimeField(blank=True, null=True)
	is_2fa_enabled = models.BooleanField(default=False)
	temp_auth_token = models.CharField(max_length=64, blank=True, null=True)

	DEFAULT_AVATAR_CHOICES = [
        ('default1', 'Avatar 1'),
        ('default2', 'Avatar 2'),
        # ('default3', 'Avatar 3'),
    ]
	avatar = models.CharField(max_length=50, choices=DEFAULT_AVATAR_CHOICES, default='default2')

	date_joined = models.DateTimeField(default=timezone.now)

	friends = models.ManyToManyField('self', blank=True, related_name='friends_list', symmetrical=False)

	wins = models.IntegerField(default=0)
	looses = models.IntegerField(default=0)
	game_played = models.IntegerField(default=0)

	objects = CustomeUserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

		

	def	UpdateUserStats(self, boolean : bool):
		if (isinstance(boolean, bool)==False):
			print("Error: boolean must be a boolean")
		else:
			if(boolean==True):
				self.wins += 1
			# else:
			# 	self.looses += 1
			self.game_played += 1
			self.win_ratio = round((self.wins / (self.game_played)) * 100, 2)
			self.save()

	def get_avatar_url(self):
		return static(f'api/images/{self.avatar}.png')

	class Meta:
		verbose_name = 'User'
		verbose_name_plural = 'Users'

class Match(models.Model):
	player_one = models.ForeignKey('User', on_delete=models.CASCADE, related_name='p1_match_history')
	player_two = models.ForeignKey('User', on_delete=models.CASCADE, related_name='p2_match_history')
	winner = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='winner')
	date = models.DateTimeField(default=timezone.now)
	
	score_p1 = models.IntegerField(default=0)
	score_p2 = models.IntegerField(default=0)

	def set_winner(self):
		if self.score_p1 > self.score_p2:
			self.winner = self.player_one
		elif self.score_p2 > self.score_p1:
			self.winner = self.player_two
		else:
			self.winner = None  # Match nul
		self.save()

	class Meta:
		verbose_name = 'Match'
		verbose_name_plural = 'Matchs'
