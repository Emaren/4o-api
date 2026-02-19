export interface Connector {
  name: string;
  healthcheck(): Promise<boolean>;
}

export class StubConnector implements Connector {
  constructor(public readonly name: string) {}

  async healthcheck(): Promise<boolean> {
    return true;
  }
}
