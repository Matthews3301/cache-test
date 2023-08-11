import { Order } from "./types";

export class PnLCache {
  private cache: Map<number, Order> = new Map();

  constructor() {}

  /*
  * Create or update order
  * Return true if order was updated or false if created
  */
  setPnL(
    tokenId: number,
    value: number,
    duration: number
  ): boolean {
    const currentTime = Date.now();
    const expirationTime = currentTime + duration;

    const existingEntry = this.cache.get(tokenId);
    if (existingEntry) {
      if (existingEntry.expirationTime > currentTime) {
        existingEntry.value = value;
        existingEntry.expirationTime += duration;
        return true;
      }
    }

    this.cache.set(tokenId, { value, expirationTime });
    return false;
  }

  /*
  * Return order value or -1 if not found
  */
  getPnL(tokenId: number): number {
    const currentTime = Date.now();
    if (this.cache.has(tokenId)) {
      const entry = this.cache.get(tokenId);
      if (!entry) return -1;

      if (entry.expirationTime > currentTime) {
        return entry.value;
      } else {
        this.cache.delete(tokenId);
      }
    }
    return -1;
  }

  /*
  * Return number of active orders
  */
  count(): number {
    const currentTime = Date.now();
    const count = Array.from(this.cache.values()).filter(
      (entry) => entry.expirationTime > currentTime
    ).length;
    return count;
  }
}