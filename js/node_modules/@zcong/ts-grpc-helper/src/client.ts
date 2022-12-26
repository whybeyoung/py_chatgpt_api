import * as grpc from '@grpc/grpc-js'
import { Observable } from 'rxjs'

export const GRPC_CANCELLED = 'Cancelled'

export type ClientReadableStreamRes<
  T extends grpc.ClientReadableStream<any> | grpc.ClientDuplexStream<any, any>
> = T extends grpc.ClientDuplexStream<any, infer Res>
  ? Res
  : T extends grpc.ClientReadableStream<infer Res>
  ? Res
  : never

export const readStreamToObserver = <
  T extends grpc.ClientReadableStream<any> | grpc.ClientDuplexStream<any, any>
>(
  call: T
): Observable<ClientReadableStreamRes<T>> => {
  const stream = new Observable<ClientReadableStreamRes<T>>((observer) => {
    let isClientCanceled = false
    call.on('data', (data: any) => observer.next(data))
    call.on('error', (error: any) => {
      if (error.details === GRPC_CANCELLED) {
        call.destroy()
        if (isClientCanceled) {
          return
        }
      }
      observer.error(error)
    })

    call.on('end', () => {
      call.removeAllListeners()
      observer.complete()
    })

    return () => {
      if ((call as any).finished) {
        return
      }
      isClientCanceled = true
      call.cancel()
    }
  })

  return stream
}

export const observerToWriteStream = <T = any>(
  o: Observable<T>,
  call: grpc.ClientWritableStream<T>
) => {
  const sub = o.subscribe(
    (val) => call.write(val),
    (err: any) => call.emit('error', err),
    () => call.end()
  )

  call.on('end', () => {
    sub.unsubscribe()
    call.removeAllListeners()
  })
}

export function promisifyClientStream<
  T extends (...args: any[]) => grpc.ClientWritableStream<any>
>(
  clientStream: T,
  c: grpc.Client,
  ...args: GetOverloadArgs<PromisifyUnary<GetOverloadArgs<T>>>
) {
  let call: any
  const p = new Promise((resolve, reject) => {
    call = clientStream.call(c, ...args, (err: any, resp: any) => {
      if (err) {
        return reject(err)
      }
      return resolve(resp)
    })
  })

  return [call, p] as any as [
    ReturnType<T>,
    GetOverloadReturnType<PromisifyClientStream<T>>
  ]
}

export interface Response<Res> {
  res: Res
  status: grpc.StatusObject
  metadata: grpc.Metadata
}

export function promisifyUnaryCall<
  T extends (...args: any[]) => grpc.ClientUnaryCall
>(unaryCall: T, c: grpc.Client): PromisifyUnaryCall<T> {
  return ((...args: any) =>
    new Promise((resolve, reject) => {
      const res: any = {}
      const call: grpc.ClientUnaryCall = unaryCall.call(
        c,
        ...args,
        (err: Error, resp: any) => {
          if (err) {
            return reject(err)
          }
          res.res = resp
          resolve(res)
        }
      )

      call.on('metadata', (md) => {
        res.metadata = md
      })

      call.on('status', (status) => {
        res.status = status
      })
    })) as PromisifyUnaryCall<T>
}

// https://stackoverflow.com/questions/51650979/type-inference-with-overloaded-functions
export type Callback<T> = (err: Error | null, reply: T) => void

export type PromisifyUnary<T extends any[]> = T extends [Callback<infer U>?]
  ? () => Promise<Response<U>>
  : T extends [infer T1, Callback<infer P>?]
  ? (arg1: T1) => Promise<Response<P>>
  : T extends [infer T1, infer T2, Callback<infer U>?]
  ? (arg1: T1, arg2: T2) => Promise<Response<U>>
  : T extends [infer T1, infer T2, infer T3, Callback<infer U>?]
  ? (arg1: T1, arg2: T2, arg3: T3) => Promise<Response<U>>
  : T extends [infer T1, infer T2, infer T3, infer T4, Callback<infer U>?]
  ? (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<Response<U>>
  : T

export type GetOverloadArgs<T> = T extends {
  (...o: infer U): void
  (...o: infer U2): void
  (...o: infer U3): void
}
  ? U | U2 | U3
  : T extends { (...o: infer U): void; (...o: infer U2): void }
  ? U | U2
  : T extends { (...o: infer U): void }
  ? U
  : never

export type GetOverloadReturnType<T> = T extends {
  (...o: any[]): infer U
  (...o: any[]): infer U2
  (...o: any[]): infer U3
}
  ? U | U2 | U3
  : T extends { (...o: infer U): void; (...o: infer U2): void }
  ? U | U2
  : T extends { (...o: infer U): void }
  ? U
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type PromisifyUnaryCall<T> = UnionToIntersection<
  PromisifyUnary<GetOverloadArgs<T>>
>

export type PromisifyWithoutResponseWrapper<T extends any[]> = T extends [
  Callback<infer U>?
]
  ? () => Promise<U>
  : T extends [infer T1, Callback<infer P>?]
  ? (arg1: T1) => Promise<P>
  : T extends [infer T1, infer T2, Callback<infer U>?]
  ? (arg1: T1, arg2: T2) => Promise<U>
  : T extends [infer T1, infer T2, infer T3, Callback<infer U>?]
  ? (arg1: T1, arg2: T2, arg3: T3) => Promise<U>
  : T extends [infer T1, infer T2, infer T3, infer T4, Callback<infer U>?]
  ? (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<U>
  : T

export type PromisifyClientStream<T> = UnionToIntersection<
  PromisifyWithoutResponseWrapper<GetOverloadArgs<T>>
>
