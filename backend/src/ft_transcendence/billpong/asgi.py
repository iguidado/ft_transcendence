import os
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('asgi')

try:
    import legacy_cgi as cgi
    sys.modules['cgi'] = cgi
except ImportError:
    pass

from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billpong.settings')
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator
logger.info("Initializing Django ASGI application")
django_asgi_app = get_asgi_application()

from api.consumers import UserStatusConsumer
from api.middleware import JWTAuthMiddlewareStack

logger.info("Setting up WebSocket routes with path: /ws/status/")

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(
            URLRouter([
                path("ws/status/", UserStatusConsumer.as_asgi()),
            ])
        )
    ),
})

logger.info("ASGI application fully configured")