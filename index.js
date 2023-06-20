import { base58btc } from 'multiformats/bases/base58'

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
 * @template {import('multiformats').Link} Value
 * @implements {Set<Value>}
 */
class LinkSet extends Set {
  /** @type {Map<string, Value>} */
  #values

  /**
   * @param {Value[]} [values]
   */
  constructor (values) {
    super()
    this.#values = new Map()
    for (const v of values ?? []) {
      this.add(v)
    }
  }

  clear () {
    this.#values.clear()
  }

  /**
   * @param {Value} value
   * @returns {boolean} true if an element in the set existed and has been
   * removed, or false if the element does not exist.
   */
  delete (value) {
    const mhstr = toBase58String(value.multihash)
    return this.#values.delete(mhstr)
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
}

export { LinkSet as Set }
