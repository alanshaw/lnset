import { sha256 } from 'multiformats/hashes/sha2'
import * as raw from 'multiformats/codecs/raw'
import * as Link from 'multiformats/link'
import { fromString } from 'multiformats/bytes'
import { Set } from './index.js'

/** @param {Uint8Array} bytes */
const createRawLink = bytes => {
  const digest = sha256.digest(bytes)
  // @ts-expect-error
  return Link.create(raw.code, digest)
}

/** @type {Record<string, import('entail').Test>} */
export const test = {
  'should add a value': assert => {
    const value = createRawLink(fromString('add'))
    const set = new Set()
    assert.ok(!set.has(value))
    set.add(value)
    // access with new CID to ensure different instances are equivalent
    assert.ok(set.has(createRawLink(fromString('add'))))
  },

  'should instance from entries': assert => {
    const value = createRawLink(fromString('from ents'))
    const set = new Set([value])
    assert.ok(set.has(value))
  },

  'should delete a value': assert => {
    const value = createRawLink(fromString('delete a value'))
    const set = new Set([value])
    assert.ok(set.has(value))
    assert.ok(set.delete(value))
    assert.ok(!set.has(value))
  },

  'should clear all': assert => {
    /** @type {Array<import('multiformats').Link>} */
    const values = [
      fromString('clear all teh things!'),
      fromString('everything'),
      fromString('all gone')
    ].map(v => createRawLink(v))
    const set = new Set(values)
    assert.equal(set.size, values.length)
    set.clear()
    assert.equal(set.size, 0)
    for (const v of values) {
      assert.equal(set.has(v), false)
    }
  },

  'should iterate with forEach()': assert => {
    /** @type {Array<import('multiformats').Link>} */
    const values = [
      fromString('for each'),
      fromString('thing'),
      fromString('here')
    ].map(v => createRawLink(v))
    const set = new Set(values)
    const thisArg = {}
    let count = 0
    set.forEach(function (v, v2, s) {
      count++
      assert.strictEqual(this, thisArg)
      assert.strictEqual(s, set)
      const entry = values.find(e => e.toString() === v.toString())
      assert.ok(entry)
    }, thisArg)
    assert.equal(count, values.length)
  },

  'should iterate with Symbol.iterator()': assert => {
    /** @type {Array<import('multiformats').Link>} */
    const values = [
      fromString('Symbol.iterator'),
      fromString('iterable'),
      fromString('thingers')
    ].map(v => createRawLink(v))
    const set = new Set(values)
    for (const v of set) {
      const entry = values.find(e => e.toString() === v.toString())
      assert.ok(entry)
    }
    assert.equal([...set].length, values.length)
  },

  'should iterate with entries()': assert => {
    /** @type {Array<import('multiformats').Link>} */
    const values = [
      fromString('dot entries'),
      fromString('does iterate'),
      fromString('the entries')
    ].map(v => createRawLink(v))
    const set = new Set(values)
    for (const [k, v] of set.entries()) {
      const entry = values.find(e => e.toString() === k.toString())
      assert.ok(entry)
    }
    assert.equal([...set.entries()].length, values.length)
  },

  'should iterate keys': assert => {
    /** @type {Array<import('multiformats').Link>} */
    const values = [
      fromString('key'),
      fromString('iteration'),
      fromString('is the best')
    ].map(v => createRawLink(v))
    const set = new Set(values)
    for (const v of set.keys()) {
      assert.ok(values.some(e => e.toString() === v.toString()))
    }
    assert.equal([...set.keys()].length, values.length)
  },

  'should iterate values': assert => {
    /** @type {Array<import('multiformats').Link>} */
    const values = [
      fromString('value'),
      fromString('iterations'),
      fromString('are the best')
    ].map(v => createRawLink(v))
    const set = new Set(values)
    for (const v of set.values()) {
      assert.ok(values.some(e => e.toString() === v.toString()))
    }
    assert.equal([...set.values()].length, values.length)
  }
}
