# lnset

[![Build](https://github.com/alanshaw/lnset/actions/workflows/build.yml/badge.svg)](https://github.com/alanshaw/lnset/actions/workflows/build.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Typed Set of IPLD links (CIDs).

## Install

```sh
npm i lnset
```

## Usage

```js
import { Set } from 'lnset'
import { sha256 } from 'multiformats/hashes/sha2'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'

const key0 = CID.create(1, raw.code, sha256.digest(new Uint8Array()))
const key1 = CID.create(1, raw.code, sha256.digest(new Uint8Array()))

const set = new Set()
set.add(key0)

console.log(set.has(key1)) // true

// Create a CID for this CID set:
console.log(set.link()) // CID(bahkygaysecoonrhfkgujdciwaluh2k42cxjka4rltqrxn6wdvrnnn4s54imj2)
```

Okay, I know that's how sets work normally. How about this instead:

```sh
$ node
Welcome to Node.js v20.0.0.
Type ".help" for more information.
> const sha2 = await import('multiformats/hashes/sha2')
undefined
> const raw = await import('multiformats/codecs/raw')
undefined
> const { CID } = await import('multiformats/cid')
undefined
> const key1 = CID.create(1, raw.code, sha2.sha256.digest(new Uint8Array()))
undefined
> const key2 = CID.create(1, raw.code, sha2.sha256.digest(new Uint8Array()))
undefined
> key1 === key2
false
> const { Set: LinkSet } = await import('./index.js')
undefined
> const set = new LinkSet()
undefined
> set.add(key1)
LinkSet(0) [Set] {}
> set.size
1
> set.has(key2)
true
```

## Contributing

Feel free to join in. All welcome. Please [open an issue](https://github.com/alanshaw/lnset/issues)!

## License

Dual-licensed under [MIT + Apache 2.0](https://github.com/alanshaw/lnset/blob/main/LICENSE.md)
