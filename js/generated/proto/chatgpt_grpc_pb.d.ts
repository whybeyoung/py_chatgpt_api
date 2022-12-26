// package: pb
// file: proto/chatgpt.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as proto_chatgpt_pb from "../proto/chatgpt_pb";

interface IChatGptProxyServerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    initSession: IChatGptProxyServerService_IInitSession;
    createConversation: IChatGptProxyServerService_ICreateConversation;
    serverStream: IChatGptProxyServerService_IServerStream;
    sendMessage: IChatGptProxyServerService_ISendMessage;
}

interface IChatGptProxyServerService_IInitSession extends grpc.MethodDefinition<proto_chatgpt_pb.InitSessionRequest, proto_chatgpt_pb.Message> {
    path: "/pb.ChatGptProxyServer/InitSession";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_chatgpt_pb.InitSessionRequest>;
    requestDeserialize: grpc.deserialize<proto_chatgpt_pb.InitSessionRequest>;
    responseSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    responseDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
}
interface IChatGptProxyServerService_ICreateConversation extends grpc.MethodDefinition<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message> {
    path: "/pb.ChatGptProxyServer/CreateConversation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    requestDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
    responseSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    responseDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
}
interface IChatGptProxyServerService_IServerStream extends grpc.MethodDefinition<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message> {
    path: "/pb.ChatGptProxyServer/ServerStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    requestDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
    responseSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    responseDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
}
interface IChatGptProxyServerService_ISendMessage extends grpc.MethodDefinition<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message> {
    path: "/pb.ChatGptProxyServer/SendMessage";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    requestDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
    responseSerialize: grpc.serialize<proto_chatgpt_pb.Message>;
    responseDeserialize: grpc.deserialize<proto_chatgpt_pb.Message>;
}

export const ChatGptProxyServerService: IChatGptProxyServerService;

export interface IChatGptProxyServerServer {
    initSession: grpc.handleUnaryCall<proto_chatgpt_pb.InitSessionRequest, proto_chatgpt_pb.Message>;
    createConversation: grpc.handleUnaryCall<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    serverStream: grpc.handleBidiStreamingCall<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    sendMessage: grpc.handleUnaryCall<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
}

export interface IChatGptProxyServerClient {
    initSession(request: proto_chatgpt_pb.InitSessionRequest, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    initSession(request: proto_chatgpt_pb.InitSessionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    initSession(request: proto_chatgpt_pb.InitSessionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    createConversation(request: proto_chatgpt_pb.Message, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    createConversation(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    createConversation(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    serverStream(): grpc.ClientDuplexStream<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    serverStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    serverStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    sendMessage(request: proto_chatgpt_pb.Message, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    sendMessage(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    sendMessage(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
}

export class ChatGptProxyServerClient extends grpc.Client implements IChatGptProxyServerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public initSession(request: proto_chatgpt_pb.InitSessionRequest, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public initSession(request: proto_chatgpt_pb.InitSessionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public initSession(request: proto_chatgpt_pb.InitSessionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public createConversation(request: proto_chatgpt_pb.Message, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public createConversation(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public createConversation(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public serverStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    public serverStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<proto_chatgpt_pb.Message, proto_chatgpt_pb.Message>;
    public sendMessage(request: proto_chatgpt_pb.Message, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public sendMessage(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
    public sendMessage(request: proto_chatgpt_pb.Message, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_chatgpt_pb.Message) => void): grpc.ClientUnaryCall;
}
