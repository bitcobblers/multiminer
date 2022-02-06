type SignalHandler<T> = (value: T) => void;

export class Signal<T> {
  private readonly handlers = [] as SignalHandler<T>[];

  public on(handler: SignalHandler<T>) {
    const index = this.handlers.findIndex((h) => h === handler);

    if (index === -1) {
      this.handlers.push(handler);
    }
  }

  public off(handler: SignalHandler<T>) {
    const index = this.handlers.findIndex((h) => h === handler);

    if (index !== -1) {
      this.handlers.splice(index, 1);
    }
  }

  public trigger(value: T) {
    this.handlers.forEach((h) => h(value));
  }
}
