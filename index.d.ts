import type { Link, Version } from 'multiformats/interface'

declare class LinkSet<Key extends Link<unknown, number, number, Version>> extends Set<Key> {}

export { LinkSet as Set }
