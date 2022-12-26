# A python client and wrapper for nodejs chatgpt_api


## demo 
```bash
Please write your questions... 
什么是爱？
Answer: 爱是一种情感，它是人类之间最强烈的情感之一。它可以是指对另一个人的感情，也可以是指对某种事物的喜爱。爱可以是非常强烈和深深的，也可以是轻微的。爱通常是由一系列的情感、思想和行为组成的，包括热爱、喜爱、尊敬、关心、信任和自我牺牲。爱也可以被看作是对他人的慈爱和照顾，并表现出对他人的关怀和付出。
Please write your questions... 
可以详细一点吗？
Answer: 当人们说他们爱某人时，通常是指他们对对方有强烈的情感，并希望与对方保持联系。这种爱可能是指爱情，也可能是指友谊、亲情或父母对子女的爱。爱情是一种强烈的情感，它源自人类的生理需求和心理需求，常常伴随着强烈的情感和情绪。爱情通常是由彼此间的信任、尊重、理解和支持所构成的。

友谊是一种积极的情感关系，其基础是友好和尊重。友谊可以是两个人之间的关系，也可以是一群人之间的关系。友谊是人与人之间最重要的情感关系之一，因为它能够给人带来支持、理解、安慰和慰藉。

亲情是指家庭成员之间的情感关系，包括父母对子女的爱和子女对父母的爱。亲情是一种深厚而牢固的情感关系，它源自于共同的血缘关系和共同的文化背景。亲情是人类最基本的情感关系之一，它给人带来温暖、安全感和保护感。
Please write your questions... 
我还是不是特别理解,可以举个例子吗？
Answer: 当一个人对另一个人有爱意时，他们可能会表现出许多不同的情感、思想和行为。例如，他们可能会：

- 对对方充满热爱和喜爱，希望与对方保持密切的联系。
- 尊敬对方，尊重对方的感受和想法。
- 关心对方的健康和幸福，希望对方能够感到安全和舒适。
- 信任对方，相信对方会对自己做出正确的决定。
- 牺牲自己的利益，为了让对方感到幸福而付出努力。

这些情感、思想和行为可以通过许多不同的方式表现出来，例如通过言语、行动、身体语言或表情。

例如，一个人可能会告诉他所爱的人，“我爱你”，或者通过触摸、拥抱、亲吻或牵手来表达他的爱意。他也可能会为对方做一些小心意，例如帮对方买早餐或者替对方做一些家务。这些举动都表明了他对对方有爱意，并希望能够与对方保持亲密的关系。
Please write your questions... 
```
## usage
* first run a chatgpt-api grpc server

```bash
npm install
npx tsx server/index.ts  
```

* then using python

```python
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

```

## architecture

thanks for the [project](https://github.com/transitive-bullshit/chatgpt-api)

i wrote a grpc server according to the [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)

## roadmap

✅ support google account autologin

✅ support at least one account online

✅ support simple client using python

✅ support exec using python


❌ support microsoft account autologin

❌ support docker deploy nodejs

❌ support distribute deploy