import json
from channels.generic.websocket import WebsocketConsumer
from authorization.models import Score
from django.contrib.sessions.models import Session
from django.conf import settings
from importlib import import_module

class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
    def disconnect(self, close_code):
        pass
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        session_key = self.scope['headers'][10][1].decode("utf-8")
        session_key = session_key[session_key.find("sessionid=")+len("sessionid="):]
        engine = import_module(settings.SESSION_ENGINE)
        sessionstore = engine.SessionStore
        session = sessionstore(session_key)
        if 'score' in text_data_json:
            user = session['user']
            record = Score(user=user, score = int(text_data_json['score']))
            record.save()
            print("Add score to database")
        else:
            message = text_data_json['message']
            print(message)
            self.send(text_data=json.dumps({
                'message': message
            }))

