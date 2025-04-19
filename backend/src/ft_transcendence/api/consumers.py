from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json

class UserStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')

        await self.channel_layer.group_add("status_updates", self.channel_name)

        if self.user.is_authenticated:
            await self.set_user_status(True)
            
            await self.channel_layer.group_send(
                "status_updates",
                {
                    "type": "status_update",
                    "username": self.user.username,
                    "is_online": True
                }
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
       if hasattr(self, 'user') and self.user.is_authenticated:
           await self.set_user_status(False)
            
           await self.channel_layer.group_send(
               "status_updates",
               {
                   "type": "status_update",
                   "username": self.user.username,
                   "is_online": False
               }
           )
        
       await self.channel_layer.group_discard("status_updates", self.channel_name)

    @sync_to_async
    def set_user_status(self, status):
        self.user.is_online = status
        self.user.save(update_fields=["is_online"])
    
    async def status_update(self, event):
        # Envoyer le message au client WebSocket
        await self.send(text_data=json.dumps({
            "type": "status_update",
            "username": event["username"],
            "is_online": event["is_online"]
        }))
