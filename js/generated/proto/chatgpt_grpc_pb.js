// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_chatgpt_pb = require('../proto/chatgpt_pb.js');

function serialize_pb_InitSessionRequest(arg) {
  if (!(arg instanceof proto_chatgpt_pb.InitSessionRequest)) {
    throw new Error('Expected argument of type pb.InitSessionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_InitSessionRequest(buffer_arg) {
  return proto_chatgpt_pb.InitSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_Message(arg) {
  if (!(arg instanceof proto_chatgpt_pb.Message)) {
    throw new Error('Expected argument of type pb.Message');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_Message(buffer_arg) {
  return proto_chatgpt_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChatGptProxyServerService = exports.ChatGptProxyServerService = {
  initSession: {
    path: '/pb.ChatGptProxyServer/InitSession',
    requestStream: false,
    responseStream: false,
    requestType: proto_chatgpt_pb.InitSessionRequest,
    responseType: proto_chatgpt_pb.Message,
    requestSerialize: serialize_pb_InitSessionRequest,
    requestDeserialize: deserialize_pb_InitSessionRequest,
    responseSerialize: serialize_pb_Message,
    responseDeserialize: deserialize_pb_Message,
  },
  createConversation: {
    path: '/pb.ChatGptProxyServer/CreateConversation',
    requestStream: false,
    responseStream: false,
    requestType: proto_chatgpt_pb.Message,
    responseType: proto_chatgpt_pb.Message,
    requestSerialize: serialize_pb_Message,
    requestDeserialize: deserialize_pb_Message,
    responseSerialize: serialize_pb_Message,
    responseDeserialize: deserialize_pb_Message,
  },
  serverStream: {
    path: '/pb.ChatGptProxyServer/ServerStream',
    requestStream: true,
    responseStream: true,
    requestType: proto_chatgpt_pb.Message,
    responseType: proto_chatgpt_pb.Message,
    requestSerialize: serialize_pb_Message,
    requestDeserialize: deserialize_pb_Message,
    responseSerialize: serialize_pb_Message,
    responseDeserialize: deserialize_pb_Message,
  },
  sendMessage: {
    path: '/pb.ChatGptProxyServer/SendMessage',
    requestStream: false,
    responseStream: false,
    requestType: proto_chatgpt_pb.Message,
    responseType: proto_chatgpt_pb.Message,
    requestSerialize: serialize_pb_Message,
    requestDeserialize: deserialize_pb_Message,
    responseSerialize: serialize_pb_Message,
    responseDeserialize: deserialize_pb_Message,
  },
};

exports.ChatGptProxyServerClient = grpc.makeGenericClientConstructor(ChatGptProxyServerService);
