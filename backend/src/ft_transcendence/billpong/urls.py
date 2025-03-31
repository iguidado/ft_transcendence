"""
URL configuration for billpong project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api.views import RegisterView, UserDisplayNameUpdateView, UserAvatarUpdateView, CreateMatchHistoricView, UserProfileView, UserListView, UserProfileByUserNameView, AddFriendView, FriendListView, LoginView, LeaderBoardView, TwoFAUpdateView, VerifyLoginOtpView, VerifyEmailOtpView



schema_view = get_schema_view(
	openapi.Info(
	    title="Snippets API",
	    default_version='v1',
	    description="API doc",
	    terms_of_service="https://www.google.com/policies/terms/",
	    contact=openapi.Contact(email="contact@snippets.local"),
	    license=openapi.License(name="BSD Liscense"),
    ),
	public=True,
	permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
	# API doc with Swagger and ReDoc
	# path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
	path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
	path('swagger-redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

	# Administration Django
    path('admin/', admin.site.urls),

	# API roads
    
	#REGISTER
	path('api/register/', RegisterView.as_view(), name="register"),
    
	#LOGIN
	path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
	
	#GET
    path('api/leaderboard/', LeaderBoardView.as_view(), name='leaderboard'),
    path('api/user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/users/', UserListView.as_view(), name='users_list'),
    path('api/user/<str:username>/profile/', UserProfileByUserNameView.as_view(), name='user_profile_by_id'),
    path('api/user/friends/', FriendListView.as_view(), name='friend-list'),
	
	#PATCH
    path('api/user/2fa/update/', TwoFAUpdateView.as_view(), name='2fa-update'),
    path('api/user/verify-login-otp/', VerifyLoginOtpView.as_view(), name='verify-login-otp'),
    path('api/user/verify-email-otp/', VerifyEmailOtpView.as_view(), name='verify-email-otp'),
    
	path('api/user/profile/update_displayname/', UserDisplayNameUpdateView.as_view(), name='user-displayname-update'),
	path('api/user/profile/update_avatar/', UserAvatarUpdateView.as_view(), name='user-avatar-update'),	
    
	#POST
    path('api/user/friends/add/', AddFriendView.as_view(), name='add-friend'),
    path('api/users/create-match-history', CreateMatchHistoricView.as_view(), name='user-stats-update'),

    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
