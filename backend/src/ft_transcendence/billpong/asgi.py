import os
import sys
try:
    import legacy_cgi as cgi
    sys.modules['cgi'] = cgi
except ImportError:
    pass
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from api.consumers import UserStatusConsumer
from channels.security.websocket import AllowedHostsOriginValidator
from api.middleware import JWTAuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billpong.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(
            URLRouter([
                path("ws/status/", UserStatusConsumer.as_asgi()),
            ])
        )
    ),
})