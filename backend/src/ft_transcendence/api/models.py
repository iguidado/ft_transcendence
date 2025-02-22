from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone

class CustomeUserManager(UserManager):
	def _create_user(self, username, password, **extra_fields):
		if not username:
			raise ValueError("You have not provided a valid username")
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
	displayName = models.CharField(max_length=150, unique=False)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)

	avatar = models.ImageField(upload_to='avatars/', default='avatars/defaults.jpg', null=True, blank=True)

	date_joined = models.DateTimeField(default=timezone.now)

	friends = models.ManyToManyField('self', blank=True, related_name='friends_list', symmetrical=False)

	wins = models.IntegerField(default=0)
	looses = models.IntegerField(default=0)

	objects = CustomeUserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []

	def	UpdateUserStats(self, boolean : bool):
		if (isinstance(boolean, bool)==False):
			print("c'est pas bon et j'ai pas encore gerer les logs erreurs")
		else:
			if(boolean==True):
				self.wins += 1
			else:
				self.looses += 1
			self.save()


	class Meta:
		verbose_name = 'User'
		verbose_name_plural = 'Users'