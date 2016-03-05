import {curry} from 'ramda'
const createIterable = generator => Object.freeze({[Symbol.iterator]: generator})
const iteratorToGeneratorFactory = iterator => {
  const cache = []
  return function * () {
    let i = 0
    while (true) {
      if (i >= cache.length) {
        const next = iterator.next()
        if (next.done) return; else cache.push(next.value)
      }
      yield cache[i++]
    }
  }
}

export const concat = curry((xs, ys) => createIterable(function * () {
  yield* xs
  yield* ys
}))

export const cycle = xs => createIterable(function * () {
  while (true) yield* xs
})

export const dropWhile = curry((f, xs) => {
  const iteratorA = xs[Symbol.iterator]()
  const iteratorB = xs[Symbol.iterator]()
  let i = 0
  while (true) {
    const next = iteratorA.next()
    if (next.done || !f(next.value)) break
    i++
  }
  while (i--) iteratorB.next()
  const generatorFactory = iteratorToGeneratorFactory(iteratorB)
  return createIterable(function * () { yield * generatorFactory() })
})

export const filter = curry((f, xs) => createIterable(function * () {
  for (const x of xs) if (f(x)) yield x
}))

export const head = xs => xs[Symbol.iterator]().next().value

export const isEmpty = xs => xs[Symbol.iterator]().next().done

export const lazyMap = curry((f, xs) => createIterable(function * () {
  for (const x of xs) yield f(x)
}))

export const range = curry((a, b) => createIterable(function * () {
  let n = a
  if (n < b) while (n <= b) yield n++; else while (n >= b) yield n--
}))

export const reject = curry((f, xs) => createIterable(function * () {
  for (const x of xs) if (!f(x)) yield x
}))

export const take = curry((a, xs) => createIterable(function * () {
  let i = a
  for (const x of xs) if (!i--) return; else yield x
}))

export const takeWhile = curry((f, xs) => createIterable(function * () {
  for (const x of xs) if (f(x)) yield x; else return
}))

export const zipWith = curry((f, xs, ys) => createIterable(function * () {
  const iteratorB = ys[Symbol.iterator]()
  for (const x of xs) {
    const next = iteratorB.next()
    const done = next.done
    const value = next.value
    if (done) return; else yield f(x, value)
  }
}))
