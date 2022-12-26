import * as grpc from '@grpc/grpc-js'
import {HandleCall} from '@grpc/grpc-js/build/src/server-call'
import * as chatgpt_pb from '../generated/proto/chatgpt_pb'
import {IChatGptProxyServerServer, ChatGptProxyServerService} from '../generated/proto/chatgpt_grpc_pb'
import {ServerDuplexStream} from "@grpc/grpc-js";
import {Message} from "../generated/proto/chatgpt_pb";
import {ChatGPTAPIBrowser} from 'chatgpt'

export class BaseService implements grpc.UntypedServiceImplementation {
    [name: string]: HandleCall<any, any>
}

class ChatGptAPIServer extends BaseService implements IChatGptProxyServerServer {
    browsers
    count
    api
    initialized

    constructor() {
        super();
        this.browsers = new Map();
        this.count = 0;
        this.initialized = false;

    }

    initSession(
        call: grpc.ServerUnaryCall<chatgpt_pb.InitSessionRequest, chatgpt_pb.Message>,
        callback: grpc.sendUnaryData<chatgpt_pb.Message>
    ) {
        console.log(call.request.toObject())
        if (this.initialized) {
            console.log("already inited")
            let res = new chatgpt_pb.Message()
            console.log(this.api)
            callback(null, res)

            return
        }
        const api = new ChatGPTAPIBrowser({
            email: call.request.getEmail(),
            password: call.request.getPassword(),
            isGoogleLogin: call.request.getIsgooglelogin(),
            proxyServer: call.request.getProxyserver()
        })
        const res = new chatgpt_pb.Message()

        let sess = api.initSession()
        sess.then((result) => {
            console.log(result)
            this.initialized = true
            this.api = api
            console.log(api["_accessToken"])
            callback(null, res)
        })
    }

    sendMessage(
        call: grpc.ServerUnaryCall<chatgpt_pb.Message, chatgpt_pb.Message>,
        callback: grpc.sendUnaryData<chatgpt_pb.Message>
    ) {
        console.log(call.request.toObject())
        if (!this.initialized) {
            console.log("not inited")
            callback(Error("not initialized"), null)
            return
        }
        this.api.sendMessage(call.request.getContent(), {
            conversationId: call.request.getConversationid(),
            parentMessageId: call.request.getMessageid(),
        }).then(res => {
            let m = new chatgpt_pb.Message();
            console.log(res)
            m.setContent(res.response)
            m.setConversationid(res.conversationId)
            m.setMessageid(res.messageId)
            callback(null, m)
        })
    }

    serverStream(call: ServerDuplexStream<Message, Message>): void {

    }

    createConversation: grpc.handleUnaryCall<Message, Message>;
}

const main = async () => {
    const server = new grpc.Server()
    // @ts-ignore
    server.addService(ChatGptProxyServerService, new ChatGptAPIServer())

    server.bindAsync(
        '0.0.0.0:8080',
        grpc.ServerCredentials.createInsecure(),
        () => {
            server.start()
        }
    )
}

main()