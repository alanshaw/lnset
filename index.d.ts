import type { Link, Version } from 'multiformats/interface'

/** Typed Set of IPLD links (CIDs) */
declare class LinkSet<Key extends Link<unknown, number, number, Version>> extends Set<Key> {
  /**
   * Create a link for the set of links. This is the hash of the binary sorted
   * links in the set.
   */
  link (): Promise<Link>|Link
}

/** Codec for CID set CID. */
export const codec = 0xC1D5

export { LinkSet as Set }
