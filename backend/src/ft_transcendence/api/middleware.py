from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.db import database_sync_to_async
from django.db import close_old_connections
from api.models import User
import logging

logger = logging.getLogger('api.middleware')

@database_sync_to_async
def get_user(token_key):
    try:
        # Vérifiez si le token est valide:
        access_token = AccessToken(token_key)
        user_id = access_token['user_id']
        
        # Récupérez l'utilisateur:
        user = User.objects.get(id=user_id)
        return user
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()
    finally:
        close_old_connections()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Fermez les anciennes connexions pour éviter tout problème
        close_old_connections()
        
        # Extraction du token
        query_string = scope.get("query_string", b"").decode()
        query_params = dict(qp.split("=") for qp in query_string.split("&") if "=" in qp)
        
        token = query_params.get("token", None)
        logger.info(f"WebSocket connection attempt with token: {'present' if token else 'missing'}")

        if not token:
            logger.warning("WebSocket connection rejected: No token provided")
            await send({
                "type": "websocket.close",
                "code": 4001,
                "reason": "No authentication token provided",
            })
            return

        if token:
            # Utilisez le token pour authentifier l'utilisateur
            scope['user'] = await get_user(token)
        else:
            scope['user'] = AnonymousUser()
            
        # Continuez avec la chaîne de middleware
        return await self.inner(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))