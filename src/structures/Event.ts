import type Masashi from './Masashi.js';

export default abstract class Event {
  abstract name: string;
  abstract run(...args: unknown[]): void;

  constructor(public client: Masashi) {}
}

export type ExtendedEvent = new (client: Masashi) => Event;
