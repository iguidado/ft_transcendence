from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import database_sync_to_async
import json
from api.models import User

class UserStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')

        if self.user.is_authenticated:
            await self.set_user_status(True)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'user'): #and self.user.is_authenticated:
            await self.set_user_status(False)


    @database_sync_to_async
    def set_user_status(self, status):
        self.user.is_active = status
        self.user.save()