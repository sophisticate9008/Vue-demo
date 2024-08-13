import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

export class WebSocketService {
  private client: Client;
  private messagesSubject$ = new Subject<any>();

  constructor(private url: string) {
    this.client = new Client({
      brokerURL: this.url, // WebSocket 端点 URL
      reconnectDelay: 5000,
      onConnect: () => this.onConnect(),
      onStompError: (error) => console.error('STOMP error:', error),
      onWebSocketClose: () => console.log('WebSocket closed'),
      onWebSocketError: (error) => console.error('WebSocket error:', error),
    });

    this.client.activate();
  }

  private onConnect() {
    this.client.subscribe('/topic/response', (message: IMessage) => {
      this.messagesSubject$.next(JSON.parse(message.body));
    });
  }

  get messages$(): Observable<any> {
    return this.messagesSubject$.asObservable();
  }

  sendMessage(message: any) {
    this.client.publish({ destination: '/app/init/114514', body: JSON.stringify(message) });
  }

  closeConnection() {
    this.client.deactivate();
  }
}
