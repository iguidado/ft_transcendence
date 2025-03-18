import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from api.consumers import UserStatusConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billpong.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/status/", UserStatusConsumer.as_asgi()),
        ])
    ),
})