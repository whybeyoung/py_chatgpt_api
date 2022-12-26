#!/usr/bin/env python
# coding:utf-8
""" 
@author: nivic ybyang7
@license: Apache Licence 
@file: client
@time: 2022/12/24
@contact: ybyang7@iflytek.com
@site:  
@software: PyCharm 

# code is far away from bugs with the god animal protecting
    I love animals. They taste delicious.
              ┏┓      ┏┓
            ┏┛┻━━━┛┻┓
            ┃      ☃      ┃
            ┃  ┳┛  ┗┳  ┃
            ┃      ┻      ┃
            ┗━┓      ┏━┛
                ┃      ┗━━━┓
                ┃  神兽保佑    ┣┓
                ┃　永无BUG！   ┏┛
                ┗┓┓┏━┳┓┏┛
                  ┃┫┫  ┃┫┫
                  ┗┻┛  ┗┻┛ 
"""

#  Copyright (c) 2022. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
#  Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
#  Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
#  Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
#  Vestibulum commodo. Ut rhoncus gravida arcu.


from hack_chatgpt.generated.proto import chatgpt_pb2
from hack_chatgpt.generated.proto.chatgpt_pb2_grpc import *

import grpc

import sys
import signal


def quit(signum, frame):
    sys.exit()


class ChatGptClient():
    def __init__(self, email, password, proxyServer, isGoogleLogin=True, grpc_addr="localhost:8080"):
        self.server = grpc_addr
        self.channel = grpc.insecure_channel(self.server)
        self.stub = ChatGptProxyServerStub(self.channel)
        resp = self.stub.InitSession(
            chatgpt_pb2.InitSessionRequest(isGoogleLogin=isGoogleLogin, email=email, password=password,
                                           proxyServer=proxyServer))
        self.conversationId = ""
        self.messageId = ""

    def send(self, message):
        resp = self.stub.SendMessage(
            chatgpt_pb2.Message(content=message, conversationId=self.conversationId, messageId=self.messageId))
        print(resp.content)
        self.conversationId = resp.conversationId
        self.messageId = resp.messageId

    def exec(self):
        # Set an initial condition.
        game_active = True
        signal.signal(signal.SIGHUP, quit)
        signal.signal(signal.SIGTERM, quit)
        # Set up the while loop.
        while game_active:
            message = input("Please write your questions... \n")
            resp = self.stub.SendMessage(
                chatgpt_pb2.Message(content=message, conversationId=self.conversationId, messageId=self.messageId))
            print("Answer: " + resp.content)
            self.conversationId = resp.conversationId
            self.messageId = resp.messageId


if __name__ == '__main__':
    c = ChatGptClient(email="xxx@gmail.com", password="xxxx", isGoogleLogin=True,
                      proxyServer="localhost:7890")
    c.exec()
