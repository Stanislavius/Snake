import json
import threading

from channels.generic.websocket import WebsocketConsumer
from authorization.models import Score
from django.contrib.sessions.models import Session
from django.conf import settings
from importlib import import_module

from snake_game.gameDriver import Game

class Connector:
    def __init__(self):
        self.consumers = []
        self.consumer_waiting = None

    def find_game(self, consumer):
        print("Request_to_compete")
        print(self.consumers)
        print(self.consumer_waiting)
        if self.consumer_waiting is None:
            self.consumer_waiting = consumer
        else:
            self.consumers.append([self.consumer_waiting, consumer])
            self.consumer_waiting.start_competetive()
            consumer.start_competetive()
            self.consumer_waiting = None
            print("GAME STARTED!")

    def abort_find_game(self, consumer):
        if consumer == self.consumer_waiting:
            self.consumer_waiting = None

    def send_label_to_pair(self, consumer, status):
        for c in self.consumers:
            if consumer in c:
                if c[0] == consumer:
                    c[0].status = status
                if c[1] == consumer:
                    c[1].status = status

    def game_ended(self, consumer):
        for i in range(len(self.consumers)):
            if consumer in self.consumers[i]:
                del self.consumers[i]

connector = Connector()

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
        if 'compete' in text_data_json:
            if "waiting_to_compete" in self.__dict__:
                del self.__dict__["waiting_to_compete"]
                connector.abort_find_game(self)
            else:
                self.waiting_to_compete = True
                connector.find_game(self)

    def send_label(self, label, status = None):
        if status == None:
            what_to_send = json.dumps({"label":label})
            self.send(what_to_send)
        else:
            what_to_send = json.dumps({"label": label, "status":status})
            self.send(what_to_send)

    def start_competetive(self):
        self.game = Game(self.x_max, self.y_max)
        self.game.setGameConsumer(self)
        self.send_label("Score is 1")
        self.thread = threading.Thread(target=self.game.main_loop)
        self.thread.start()

