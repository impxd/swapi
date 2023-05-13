import { describe, it, expect } from 'vitest'
import { diffKeys } from './utils'

describe('diffKeys', () => {
  it('should return an empty set if the are not different keys', () => {
    const diff = diffKeys(
      { a: 1, b: 2, c: 'hello world', d: true },
      { a: 1, b: 2, c: 'hello world', d: true }
    )

    expect(diff.size).toBe(0)
  })

  it('should return only the set of keys that are different', () => {
    const diff = diffKeys({ a: 1, b: 2 }, { a: 1, b: 3 })

    expect(diff).toStrictEqual(new Set(['b']))

    expect(diff.size).toBe(1)
  })

  it('should work with arrays', () => {
    const diff = diffKeys(
      { a: [1, 2, 3], b: [1, 2], c: [1] },
      { a: [1, 2, 3], b: [1], c: [1, 2] }
    )

    expect(diff).toStrictEqual(new Set(['b', 'c']))

    expect(diff.size).toBe(2)
  })

  it('should work with objects', () => {
    const diff = diffKeys(
      { a: { a: 1, b: 2 }, b: { a: 1 } },
      { a: { a: 1, b: 2 }, b: { a: 1, b: 2 } }
    )

    expect(diff).toStrictEqual(new Set(['b']))

    expect(diff.size).toBe(1)
  })
})
