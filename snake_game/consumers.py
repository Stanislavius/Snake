import json
import threading

from channels.generic.websocket import WebsocketConsumer
from authorization.models import Score
from django.contrib.sessions.models import Session
from django.conf import settings
from importlib import import_module

from snake_game.gameDriver import Game


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
    def disconnect(self, close_code):
        pass
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("Received")
        print(text_data_json)
        if 'start_game' in text_data_json:
            self.x_max = int(text_data_json["x"])
            self.y_max = int(text_data_json["y"])
        if 'direction' in text_data_json:
            self.game.changeDirection(text_data_json['direction'])
        if 'new_game' in text_data_json:
            if "game" in self.__dict__:
                self.game.end()
            self.game = Game(self.x_max, self.y_max)
            self.game.setGameConsumer(self)
            self.send_label("Score is 1")
            self.thread = threading.Thread(target=self.game.main_loop)
            self.thread.start()

    def send_label(self, label):
        what_to_send = json.dumps({"label":label})
        self.send(what_to_send)

