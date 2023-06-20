import type { Link } from 'multiformats/interface'

declare class LinkSet<Key extends Link> extends Set<Key> {}

export { LinkSet as Set }
