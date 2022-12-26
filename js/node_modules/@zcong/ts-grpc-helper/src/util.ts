import { Metadata } from '@grpc/grpc-js'

const GRPC_TIMEOUT_HEADER = 'grpc-timeout'
const maxTimeoutValue = 100000000 - 1

// https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md#requests
const units: Array<[string, number]> = [
  ['m', 1],
  ['S', 1000],
  ['M', 60 * 1000],
  ['H', 60 * 60 * 1000],
]

// https://github.com/grpc/grpc-node/blob/6eb63e1aa2bf6fbde88034df8290c7efa8d4c86d/packages/grpc-js/src/deadline-filter.ts#L24
const getDeadline = (deadline: number | Date) => {
  const deadlineTime = deadline instanceof Date ? deadline.getTime() : deadline
  const now = new Date().getTime()
  const timeoutMs = Math.max(deadlineTime - now, 0)
  for (const [unit, factor] of units) {
    const amount = timeoutMs / factor
    if (amount <= maxTimeoutValue) {
      return String(Math.ceil(amount)) + unit
    }
  }
  throw new Error('Deadline is too far in the future')
}

export const setDeadlineHeader = (md: Metadata, deadline: number | Date) => {
  md.set(GRPC_TIMEOUT_HEADER, getDeadline(deadline))
}

export const setTimeoutHeader = (md: Metadata, timeoutMs: number) => {
  const deadline = new Date().getTime() + timeoutMs
  md.set(GRPC_TIMEOUT_HEADER, getDeadline(deadline))
}
