export default class Controller {
  readonly #baseUrl: string = 'http://enter.local/';
  #token: string = '';
  #messagesCount: number = 0;
  #heartbeatCounter: number = 0;
  #messageCallbacks: Function[] = [];
  #heartbeatInterval!: ReturnType<typeof setInterval>;
  #instance!: WebSocket;
  readonly socketUrl: string;
  username: string = '';

  constructor(socketUrl: string = 'ws://test.enter-systems.ru/') {
    this.socketUrl = socketUrl;
    return this.connect();
  }
  onMessage(callback: Function) {
    this.#messageCallbacks.push(callback);
  }
  async connect() {
    return new Promise((resolve) => {
      this.#instance = new WebSocket(this.socketUrl);
      this.#instance.onopen = () => {
        console.log('on open');
        this.#instance.onmessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          switch (data[0]) {
            case 0:
              this.#token ? this.loginByToken() : this.login();
              break;
            case 3:
              this.#token = data[2].Token;
              this.subscribe();
              this.#registerHeartbeat();
              break;
            case 4:
              break;
            case 8:
              if (data[2].SubscribeError)
                this.notify({ type: 'error', data: `SubscribeError: ${data[2].SubscribeError}` });
              else
                this.notify({
                  type: 'data',
                  data: data[2].Items.map((message: Object) => ({ ...message, id: this.#messagesCount++ }))
                });

              break;
          }
        };
        this.send([20, this.#heartbeatCounter++]);

        resolve(this);
      };

      this.#instance.onclose = () => {
        console.log('closed, reconnecting...');
        clearTimeout(this.#heartbeatInterval);
        this.connect();
      };
    });
  }
  notify(payload: Object) {
    this.#messageCallbacks.forEach((callback) => {
      callback(payload);
    });
  }
  getRandomString(): string {
    return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 16);
  }
  #buildUrl(path: string) {
    return `${this.#baseUrl}${path}`;
  }
  #registerHeartbeat(): void {
    this.#heartbeatInterval = setInterval(() => {
      this.send([20, this.#heartbeatCounter++]);
    }, 20000);
  }
  send(message: Array<string | number>): void {
    this.#instance.send(JSON.stringify(message));
  }
  login(creds = ['enter', 'A505a']): void {
    console.log('login');
    this.send([2, this.getRandomString(), this.#buildUrl('login'), ...creds]);
  }
  logout(): void {
    console.log('logout');
    this.send([2, this.getRandomString(), this.#buildUrl('logout')]);
  }
  loginByToken(): void {
    console.log('loginByToken');
    this.send([2, this.getRandomString(), this.#buildUrl('loginByToken'), this.#token]);
  }
  subscribe(event: string = 'subscription/logs/list'): void {
    this.send([5, this.#buildUrl(event)]);
  }
  unsubscribe(event: string = 'subscription/logs/list'): void {
    this.send([6, this.#buildUrl(event)]);
  }
}
