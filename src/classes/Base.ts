import { Client } from "../lib";

/**
 * Represents the base class which other classes extend from.
 */
export class BaseClass {
  public client: Client;
  public constructor(client: Client) {
    this.client = client;
  }
}
