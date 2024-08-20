import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { MessageBody } from '../type';

export class WebSocketService {
    private client: Client;
    private messagesSubject$ = new Subject<any>();
    private _messageLoaded: Record<string, MessageBody[]> = {};
    constructor(private url: string, private uuid: string) {

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
        this.client.subscribe('/topic/messages/' + this.uuid, (message: IMessage) => {
            const messageJson: MessageBody = JSON.parse(message.body);
            this.messagesSubject$.next(messageJson);
            this.addMessage(messageJson);
        });
    }
    addMessage(newMessage: MessageBody) {
        const key = newMessage.sender;
        if (!this._messageLoaded[key]) {
            this._messageLoaded[key] = [];
        }
        this._messageLoaded[key].push(newMessage);
        // this.sortDictionaryByLastMessageTime();
    }
    addEmpty(key: string) {
        if(!this._messageLoaded[key]) {
            this._messageLoaded[key] = [];
        }
    }
    // sortDictionaryByLastMessageTime() {
    //     const sortedEntries = Object.entries(this._messageLoaded)
    //         .sort(([, messagesA], [, messagesB]) => {
    //             const lastMessageA = messagesA[messagesA.length - 1];
    //             const lastMessageB = messagesB[messagesB.length - 1];
    //             return new Date(lastMessageB.sendTime).getTime() - new Date(lastMessageA.sendTime).getTime();
    //         });

    //     // 重新构建排序后的字典
    //     this._messageLoaded = Object.fromEntries(sortedEntries);
    // }
    set messageLoaded(value: Record<string, MessageBody[]>) {
        this._messageLoaded = value;
    }
    get messageLoaded(): Record<string, MessageBody[]> {
        return this._messageLoaded;
    }
    get messages$(): Observable<any> {
        return this.messagesSubject$.asObservable();
    }

    sendMessage(message: any) {
        this.client.publish({ destination: '/app/send/' + this.uuid, body: JSON.stringify(message) });
    }

    closeConnection() {
        this.client.deactivate();
    }
}
