import * as grpc from '@grpc/grpc-js';
import { HandleCall } from '@grpc/grpc-js/build/src/server-call';

declare class BaseService implements grpc.UntypedServiceImplementation {
    [name: string]: HandleCall<any, any>;
}

export { BaseService };
