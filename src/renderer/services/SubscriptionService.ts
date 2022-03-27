import UnsubscribeMethod from '../../shared/UnsubscribeMethod';

export abstract class SubscriptionService {
  public name: string;

  private subscriptions = Array<UnsubscribeMethod>();

  constructor(name: string) {
    this.name = name;
  }

  abstract load(): Promise<void>;

  public addSubscription(subscription: UnsubscribeMethod) {
    this.subscriptions.push(subscription);
  }

  public unload() {
    this.subscriptions.forEach((s) => {
      s();
    });
  }
}
