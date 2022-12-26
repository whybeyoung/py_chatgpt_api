# ts-grpc-helper

[![NPM version](https://img.shields.io/npm/v/@zcong/ts-grpc-helper.svg?style=flat)](https://npmjs.com/package/@zcong/ts-grpc-helper) [![NPM downloads](https://img.shields.io/npm/dm/@zcong/ts-grpc-helper.svg?style=flat)](https://npmjs.com/package/@zcong/ts-grpc-helper) [![JS Test](https://github.com/zcong1993/ts-grpc-helper/actions/workflows/js-test.yml/badge.svg)](https://github.com/zcong1993/ts-grpc-helper/actions/workflows/js-test.yml)

> ts grpc helper

## Install

```bash
$ yarn add @zcong/ts-grpc-helper
# or npm
$ npm i @zcong/ts-grpc-helper --save
```

## Why

<table>
<tr>
<td> Type </td> <td> Before </td> <td> After </td> 
</tr>
<tr>
<td> UnaryCall server side </td>
<td>

```ts
{
  echo: (call, callback) => {
    console.log(call.request.toObject())
    callback(null, call.request)
  }
}
```

</td>
<td>

```ts
{
  echo: toHandleUnaryCall(async (req, md, call) => {
    console.log(req.toObject())
    return req
  }),
}
```

</td>
</tr>
<tr>
<td> UnaryCall client side </td>
<td>

```ts
const testEcho = async (c: HelloClient) => {
  const req = new pb.EchoRequest()
  req.setMessage('test')

  c.echo(req, (err, data) => {
    if (err) {
      console.log('err: ', err)
    } else {
      console.log(data.toObject())
    }
  })
}
```

</td>
<td>

```ts
const testEcho = async (c: HelloClient) => {
  const req = new pb.EchoRequest()
  req.setMessage('test')

  const resp = await promisifyUnaryCall(c.echo, c)(req)
  console.log(resp.res.toObject())
}
```

</td>
</tr>
<tr>
<td> ServerStream server side </td>
<td>

```ts
{
  serverStream: (call) => {
    console.log(call.request.toObject())
    Array(3)
      .fill(call.request)
      .map((r) => call.write(r))
    call.end()
  },
}
```

</td>
<td>

```ts
{
  serverStream: toHandleServerStreamingCall(async (req, md, call) => {
    console.log(req.toObject())
    return from(Array(3).fill(req))
  }),
}
```

</td>
</tr>
<tr>
<td> ServerStream client side </td>
<td>

```ts
const testStream = async (c: HelloClient) => {
  const req = new pb.EchoRequest()
  req.setMessage('test2')
  const st = c.serverStream(req)
  st.on('data', (d) => {
    console.log(d.toObject())
  })

  st.on('end', () => {
    console.log('done')
  })

  st.on('error', (err) => {
    console.log('error', err)
  })
}
```

</td>
<td>

```ts
const testStream = async (c: HelloClient) => {
  const req = new pb.EchoRequest()
  req.setMessage('test2')
  const st = c.serverStream(req)
  const result$ = readStreamToObserver(st)
  await result$.forEach((data) => {
    console.log(data.toObject())
  })
}
```

</td>
</tr>
<tr>
<td> ClientStream server side </td>
<td>

```ts
{
  clientStream: (call, callback) => {
    let d: any
    call.on('data', (dd) => {
      console.log(dd.toObject())
      d = dd
    })

    call.on('error', (err) => {
      callback(err)
    })

    call.on('end', () => {
      callback(null, d)
    })
  },
}
```

</td>
<td>

```ts
{
  clientStream: toHandleClientStreamingCall(async (req, md, call) => {
    let res: hello_pb.EchoRequest
    await req.forEach((data) => {
      res = data
      console.log(data.toObject())
    })

    return res
  }),
}
```

</td>
</tr>
<tr>
<td> ClientStream client side </td>
<td>

```ts
const testClientStream = async (c: HelloClient) => {
  const m = new grpc.Metadata()
  m.set('hello', 'xxx')

  const [call, p] = promisifyClientStream(c.clientStream, c, m)

  observerToWriteStream(
    from(
      Array(5)
        .fill(null)
        .map((_, i) => {
          const req = new pb.EchoRequest()
          req.setMessage(`test ${i}`)
          return req
        })
    ),
    call
  )

  const resp = await p
  console.log(resp.toObject())
}
```

</td>
<td>

```ts
const testClientStream = async (c: HelloClient) => {
  const call = c.clientStream((err, resp) => {
    if (err) {
      console.log(err)
    } else {
      console.log(resp.toObject())
    }
  })

  observerToWriteStream(
    range(0, 5).pipe(
      map((val) => {
        const req = new pb.EchoRequest()
        req.setMessage(`test ${val}`)
        return req
      })
    ),
    call
  )
}
```

</td>
</tr>
<tr>
<td> DuplexStream server side </td>
<td>

```ts
{
  duplexStream: (call) => {
    call.on('error', (err) => {
      call.emit('error', err)
    })

    call.on('end', () => {
      call.end()
    })

    call.on('data', (d) => {
      console.log(d.toObject())
      call.write(d)
    })
  },
}
```

</td>
<td>

```ts
{
  duplexStream: toHandleBidiStreamingCall(async (req, md, call) => {
    return req.pipe(tap((data) => console.log(data.toObject())))
  }),
}
```

</td>
</tr>
<tr>
<td> DuplexStream client side </td>
<td>

```ts
const testDuplexStream = async (c: HelloClient) => {
  const call = c.duplexStream()
  call.on('data', (data) => {
    console.log(data.toObject())
  })

  call.on('end', () => {
    console.log('end')
  })

  for (let i = 0; i < 5; i++) {
    const req = new pb.EchoRequest()
    req.setMessage(`test ${i}`)
    call.write(req)
    if (i < 4) {
      await sleep(1000)
    }
  }

  call.end()
}
```

</td>
<td>

```ts
const testDuplexStream = async (c: HelloClient) => {
  const call = c.duplexStream()

  const result$ = readStreamToObserver(call)
  result$
    .forEach((data) => {
      console.log(data.toObject())
    })
    .then(() => console.log('end'))

  const source$ = interval(1000).pipe(
    take(5),
    map((v) => {
      const req = new pb.EchoRequest()
      req.setMessage(`test ${v}`)
      return of(req)
    }),
    concatAll()
  )

  observerToWriteStream(source$, call)
}
```

</td>
</tr>
</table>

## License

MIT &copy; zcong1993
