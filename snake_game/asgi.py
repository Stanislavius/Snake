import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
import os
import django
from channels.routing import get_default_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from snake_game.consumers import GameConsumer
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Snake.settings")

django.setup()

application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path(r'ws/snake_game/', GameConsumer.as_asgi()),
    ])
})