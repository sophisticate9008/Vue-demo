import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { MessageBody, UserBody } from '../type';
import { reactive, ref, toRef } from 'vue';

export class WebSocketService {
    private _user: UserBody = null as unknown as UserBody;
    private client: Client;
    private messagesSubject$ = new Subject<any>();
    private _messageLoaded = reactive<Record<string, MessageBody[]>>({});
    private _keys = ref<Set<string>>(new Set<string>());
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
        var key: string;
        if (this.user.account === newMessage.sender) {
            key = newMessage.receiver;
        } else {
            key = newMessage.sender;
        }
        
        if (!this._messageLoaded[key]) {
            this._messageLoaded[key] = [];
            this._keys.value.add(key);
        }
        
        this._messageLoaded[key].push(newMessage);

        // 这里可以确保对字典的更新能够触发 Vue 的响应式更新
        this._messageLoaded = { ...this._messageLoaded };
        
    }
    get keys(): Set<string> {
        return toRef(this._keys).value;
    }
    addEmpty(key: string) {
        if (!this._messageLoaded[key]) {
            this._messageLoaded[key] = [];
            this._messageLoaded = { ...this._messageLoaded };  // 触发响应式更新
        }
        this.keys.add(key);
    }

    set user(value: UserBody) {
        this._user = value;
    }

    get user(): UserBody {
        return this._user;
    }

    set messageLoaded(value: Record<string, MessageBody[]>) {
        Object.assign(this._messageLoaded, value);
        this._keys.value = new Set(Object.keys(value));
    }

    get messageLoaded(): Record<string, MessageBody[]> {
        const a = this.keys
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
