import { base58btc } from 'multiformats/bases/base58'
import { sha256 } from 'multiformats/hashes/sha2'
import { create as createLink } from 'multiformats/link'

export const codec = 0xC1D5

/** @type {WeakMap<import('multiformats').MultihashDigest, string>} */
const cache = new WeakMap()

/** @param {import('multiformats').MultihashDigest} digest */
const toBase58String = digest => {
  let str = cache.get(digest)
  if (!str) {
    str = base58btc.encode(digest.bytes)
    cache.set(digest, str)
  }
  return str
}

/**
 * @template {import('multiformats').Link<unknown, number, number, import('multiformats').Version>} Value
 * @implements {Set<Value>}
 */
class LinkSet extends Set {
  /** @type {Map<string, Value>} */
  #values
  /** @type {import('multiformats').Link?} */
  #link

  /**
   * @param {Value[]} [values]
   */
  constructor (values) {
    super()
    this.#values = new Map()
    this.#link = null
    for (const v of values ?? []) {
      this.add(v)
    }
  }

  clear () {
    this.#values.clear()
    this.#link = null
  }

  /**
   * @param {Value} value
   * @returns {boolean} true if an element in the set existed and has been
   * removed, or false if the element does not exist.
   */
  delete (value) {
    const mhstr = toBase58String(value.multihash)
    const deleted = this.#values.delete(mhstr)
    if (deleted) this.#link = null
    return deleted
  }

  /**
   * Executes a provided function once per each value in the Set, in
   * insertion order.
   * @param {(value: Value, value2: Value, set: Set<Value>) => void} callbackfn
   * @param {any} [thisArg]
   */
  forEach (callbackfn, thisArg) {
    this.#values.forEach(v => callbackfn.call(thisArg, v, v, this))
  }

  /**
   * @param {Value} value
   * @returns {boolean} Whether an element exists or not.
   */
  has (value) {
    return this.#values.has(toBase58String(value.multihash))
  }

  /**
   * Adds a new element to the Set.
   *
   * @param {Value} value
   */
  add (value) {
    const mhstr = toBase58String(value.multihash)
    this.#values.set(mhstr, value)
    this.#link = null
    return this
  }

  /**
   * @returns {number} The number of elements in the Set.
   */
  get size () {
    return this.#values.size
  }

  /** @returns An iterable of elements in the Set. */
  [Symbol.iterator] () {
    return this.#values.values()
  }

  /**
   * @returns {IterableIterator<[Value, Value]>} An iterable of value, value
   * pairs for every element in the Set.
   */
  * entries () {
    for (const v of this.#values.values()) {
      yield [v, v]
    }
  }

  /**
   * @returns {IterableIterator<Value>} An iterable of elements in the Set.
   */
  keys () {
    return this.values()
  }

  /**
   * @returns {IterableIterator<Value>} An iterable of elements in the Set.
   */
  values () {
    return this.#values.values()
  }

  /**
   * @returns {Promise<import('multiformats').Link>|import('multiformats').Link}
   */
  link () {
    if (this.#link) return this.#link

    const cids = []
    let size = 0
    for (const cid of this.values()) {
      const bytes = cid.bytes
      cids.push(bytes)
      size += bytes.length
    }

    const sorted = cids.sort((a, b) => {
      for (let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) return -1
        if (a[i] > b[i]) return 1
      }
      if (a.length > b.length) return 1
      if (a.length < b.length) return -1
      return 0
    })

    const input = new Uint8Array(size)
    let offset = 0
    for (const bytes of sorted) {
      input.set(bytes, offset)
      offset += bytes.length
    }

    const digest = sha256.digest(input)

    if (digest instanceof Promise) {
      return digest.then(d => {
        this.#link = createLink(codec, d)
        return this.#link
      })
    }

    this.#link = createLink(codec, digest)
    return this.#link
  }
}

export { LinkSet as Set }
