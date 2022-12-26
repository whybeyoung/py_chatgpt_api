// package: pb
// file: proto/chatgpt.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class InitSessionRequest extends jspb.Message { 
    getEmail(): string;
    setEmail(value: string): InitSessionRequest;
    getPassword(): string;
    setPassword(value: string): InitSessionRequest;
    getIsgooglelogin(): boolean;
    setIsgooglelogin(value: boolean): InitSessionRequest;
    getProxyserver(): string;
    setProxyserver(value: string): InitSessionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitSessionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InitSessionRequest): InitSessionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitSessionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitSessionRequest;
    static deserializeBinaryFromReader(message: InitSessionRequest, reader: jspb.BinaryReader): InitSessionRequest;
}

export namespace InitSessionRequest {
    export type AsObject = {
        email: string,
        password: string,
        isgooglelogin: boolean,
        proxyserver: string,
    }
}

export class Message extends jspb.Message { 
    getConversationid(): string;
    setConversationid(value: string): Message;
    getMessageid(): string;
    setMessageid(value: string): Message;
    getContent(): string;
    setContent(value: string): Message;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Message.AsObject;
    static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Message;
    static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
    export type AsObject = {
        conversationid: string,
        messageid: string,
        content: string,
    }
}
