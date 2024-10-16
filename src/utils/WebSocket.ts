import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { MessageBody, UserBody } from '../type';
import { reactive, ref, toRef } from 'vue';

export class WebSocketService {
    private _user: UserBody = null as unknown as UserBody;
    private client: Client;
    private messagesSubject$ = new Subject<any>();
    private _messageLoaded = reactive<Record<number, MessageBody[]>>({});
    private _keys = ref<Set<number>>(new Set<number>());
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
        let key: number;
        if (this.user.id === newMessage.senderId) {
            key = newMessage.receiverId;
        } else {
            key = newMessage.senderId;
        }

        if (!this._messageLoaded[key]) {
            this._messageLoaded[key] = [];
            this._keys.value.add(key);
        }

        this._messageLoaded[key].push(newMessage);

        // 这里可以确保对字典的更新能够触发 Vue 的响应式更新
        this._messageLoaded = { ...this._messageLoaded };

    }
    get keys(): Set<number> {
        return toRef(this._keys).value;
    }
    addEmpty(key: number) {
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

    set messageLoaded(value: Record<number, MessageBody[]>) {
        Object.assign(this._messageLoaded, value);
        // 假设 value 是对象且其键可以转换为数字
        this._keys.value = new Set(Object.keys(value).map(key => Number(key)));
    }

    get messageLoaded(): Record<number, MessageBody[]> {
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
