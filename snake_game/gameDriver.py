import json
import random
from importlib import import_module
from django.conf import settings

from authorization.models import Score
import time
import json_fix

class Point():
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __json__(self):
        return json.dumps({"x": self.x, "y":self.y})

    def __str__(self):
        return "x:"+str(self.x)+", y:" + str(self.y)

class Game:
    def __init__(self, x_max, y_max):
        self.head = Point(1+random.randint(0, x_max - 2),
                          1+random.randint(0, y_max - 2))
        x = self.head.x
        y = self.head.y
        while x == self.head.x and y == self.head.y:
            x = 1 + random.randint(0, x_max - 3)
            y = 1 + random.randint(0, y_max - 3)
        self.food = Point(x, y)
        self.direction = "Right"
        self.body = []
        self.timeOut = 1000/5
        self.game_end = False
        self.x_max = x_max
        self.y_max = y_max

    def main_loop(self):
        while not self.game_end:
            self.send_state()
            time.sleep(self.timeOut/1000)
            self.one_step()

    def one_step(self):
        if len(self.body) == 0:
            tail_x = self.head.x
            tail_y = self.head.y
        else:
            tail_x = self.body[0].x
            tail_y = self.body[0].y
        last_x = self.head.x
        last_y = self.head.y
        if self.direction == "Up":
            self.head.y = self.head.y - 1
        if self.direction == "Down":
            self.head.y = self.head.y + 1
        if self.direction == "Left":
            self.head.x = self.head.x - 1
        if self.direction == "Right":
            self.head.x = self.head.x + 1
        if self.head.x < 0 or self.head.x >= self.x_max or self.head.y < 0 or self.head.y >= self.y_max:
            self.change_label("Game over, your score is " + str(len(self.body) + 1))
            self.save_score(len(self.body) + 1)
            self.game_end = True
            return None
        if len(self.body) != 0:
            self.body = self.body[1:]
            self.body.append(Point(last_x, last_y))
        print(self.head, self.food)
        if self.head.x == self.food.x and self.head.y == self.food.y:
            new_food_x = 1 + random.randint(0, self.x_max - 3)
            new_food_y = 1 + random.randint(0, self.y_max - 3)
            flag = True
            while flag:
                if self.head.x == new_food_x and self.head.y == new_food_y:
                    new_food_x = 1 + random.randint(0, self.x_max - 3)
                    new_food_y = 1 + random.randint(0, self.y_max - 3)
                    flag = True
                else:
                    flag = False
                    for element in self.body:
                        if element.x == new_food_x and element.y == new_food_y:
                            flag = True
                    if flag:
                        new_food_x = 1 + random.randint(0, self.x_max - 3)
                        new_food_y = 1 + random.randint(0, self.y_max - 3)
            self.food = Point(new_food_x, new_food_y)
            self.body.insert(0, Point(tail_x, tail_y))
            self.timeOut = self.timeOut * 0.95
            self.change_label("Your score is " + str(len(self.body) + 1))
        for element in self.body:
            if element.x == self.head.x and element.y == self.head.y:
                self.change_label("Game over, our score is " + str(len(self.body) + 1))
                self.save_score(len(self.body) + 1)
                self.game_end = True
                return None

    def change_label(self, new_label):
        self.consumer.send_label(new_label)

    def setGameConsumer(self, consumer):
        self.consumer = consumer

    def save_score(self, score):
        session_key = self.consumer.scope['headers'][10][1].decode("utf-8")
        session_key = session_key[session_key.find("sessionid=") + len("sessionid="):]
        engine = import_module(settings.SESSION_ENGINE)
        sessionstore = engine.SessionStore
        session = sessionstore(session_key)
        user = session['user']
        record = Score(user=user, score=score)
        record.save()
        print("Add score to database")

    def changeDirection(self, new_direction):
        self.direction = new_direction

    def send_state(self):
        state = json.dumps({"head": self.head, "body": self.body, "food": self.food})
        self.consumer.send(state)

    def end(self):
        self.game_end = True
