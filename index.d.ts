import type { Await, Link, Version } from 'multiformats/interface'

declare class LinkSet<Key extends Link<unknown, number, number, Version>> extends Set<Key> {
  link (): Promise<Link>|Link
}

export const codec = 0xC1D5

export { LinkSet as Set }
