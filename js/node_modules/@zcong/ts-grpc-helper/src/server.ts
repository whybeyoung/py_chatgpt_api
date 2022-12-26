import * as grpc from '@grpc/grpc-js'
import { Observable, from, EMPTY, fromEvent, Subject } from 'rxjs'
import { catchError, takeUntil } from 'rxjs/operators'

export const CANCEL_EVENT = 'cancelled'

export type UnaryCallRequest<T extends grpc.handleUnaryCall<any, any>> =
  T extends grpc.handleUnaryCall<infer Req, any> ? Req : never
export type UnaryCallResponse<T extends grpc.handleUnaryCall<any, any>> =
  T extends grpc.handleUnaryCall<any, infer Res> ? Res : never
export type ServerStreamingCallRequest<
  T extends grpc.handleServerStreamingCall<any, any>
> = T extends grpc.handleServerStreamingCall<infer Req, any> ? Req : never
export type ServerStreamingCallResponse<
  T extends grpc.handleServerStreamingCall<any, any>
> = T extends grpc.handleServerStreamingCall<any, infer Res> ? Res : never
export type ClientStreamingCallRequest<
  T extends grpc.handleClientStreamingCall<any, any>
> = T extends grpc.handleClientStreamingCall<infer Req, any> ? Req : never
export type ClientStreamingCallResponse<
  T extends grpc.handleClientStreamingCall<any, any>
> = T extends grpc.handleClientStreamingCall<any, infer Res> ? Res : never
export type BidiStreamingCallRequest<
  T extends grpc.handleBidiStreamingCall<any, any>
> = T extends grpc.handleBidiStreamingCall<infer Req, any> ? Req : never
export type BidiStreamingCallResponse<
  T extends grpc.handleBidiStreamingCall<any, any>
> = T extends grpc.handleBidiStreamingCall<any, infer Res> ? Res : never

export const toHandleUnaryCall = <T extends grpc.handleUnaryCall<any, any>>(
  fn: (
    req: UnaryCallRequest<T>,
    metadata: grpc.Metadata,
    call: grpc.ServerUnaryCall<UnaryCallRequest<T>, UnaryCallResponse<T>>
  ) => Promise<UnaryCallResponse<T>>
): T => {
  const f = async (call: any, callback: any) => {
    from(fn(call.request, call.metadata, call)).subscribe(
      (data) => callback(null, data),
      (err) => callback(err)
    )
  }
  return f as any as T
}

export const toHandleServerStreamingCall = <
  T extends grpc.handleServerStreamingCall<any, any>
>(
  fn: (
    req: ServerStreamingCallRequest<T>,
    metadata: grpc.Metadata,
    call: grpc.ServerWritableStream<
      ServerStreamingCallRequest<T>,
      ServerStreamingCallResponse<T>
    >
  ) => Promise<Observable<ServerStreamingCallResponse<T>>>
): T => {
  const f = async (call: any) => {
    const result$ = await fn(call.request, call.metadata, call)
    await result$
      .pipe(
        takeUntil(fromEvent(call, CANCEL_EVENT)),
        catchError((err) => {
          call.emit('error', err)
          return EMPTY
        })
      )
      .forEach((data) => call.write(data))

    call.end()
  }

  return f as any as T
}

export const toHandleClientStreamingCall = <
  T extends grpc.handleClientStreamingCall<any, any>
>(
  fn: (
    req: Observable<ClientStreamingCallRequest<T>>,
    metadata: grpc.Metadata,
    call: grpc.ServerReadableStream<
      ClientStreamingCallRequest<T>,
      ClientStreamingCallResponse<T>
    >
  ) => Promise<ClientStreamingCallResponse<T>>
): T => {
  const f = async (call: any, callback: any) => {
    const req = new Subject<any>()
    call.on('data', (m: any) => req.next(m))
    call.on('error', (e: any) => {
      // Check if error means that stream ended on other end
      const isCancelledError = String(e).toLowerCase().indexOf('cancelled')

      if (isCancelledError) {
        call.end()
        return
      }
      // If another error then just pass it along
      req.error(e)
    })
    call.on('end', () => req.complete())

    from(fn(req.asObservable(), call.metadata, call)).subscribe(
      (data) => callback(null, data),
      (err) => callback(err)
    )
  }

  return f as any as T
}

export const toHandleBidiStreamingCall = <
  T extends grpc.handleBidiStreamingCall<any, any>
>(
  fn: (
    req: Observable<BidiStreamingCallRequest<T>>,
    metadata: grpc.Metadata,
    call: grpc.ServerDuplexStream<
      BidiStreamingCallRequest<T>,
      BidiStreamingCallResponse<T>
    >
  ) => Promise<Observable<BidiStreamingCallResponse<T>>>
): T => {
  const f = async (call: any) => {
    const req = new Subject<any>()
    call.on('data', (m: any) => req.next(m))
    call.on('error', (e: any) => {
      // Check if error means that stream ended on other end
      const isCancelledError = String(e).toLowerCase().indexOf('cancelled')

      if (isCancelledError) {
        call.end()
        return
      }
      // If another error then just pass it along
      req.error(e)
    })
    call.on('end', () => req.complete())

    const result$ = await fn(req.asObservable(), call.metadata, call)
    await result$
      .pipe(
        takeUntil(fromEvent(call, CANCEL_EVENT)),
        catchError((err) => {
          call.emit('error', err)
          return EMPTY
        })
      )
      .forEach((data) => call.write(data))

    call.end()
  }

  return f as any as T
}
