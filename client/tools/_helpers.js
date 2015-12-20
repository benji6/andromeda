import {
  head,
  identity,
  ifElse,
  isEmpty
} from 'ramda'

export const safeHead = ifElse(isEmpty, identity, head)
