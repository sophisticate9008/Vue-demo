import { reactive, provide, inject } from 'vue';
import { UserBody } from '../type';
import { WebSocketService } from '../utils/WebSocket';

const userStateSymbol = Symbol();

export const createUserState = () => {
    const state = reactive({
        userInfo: {} as UserBody, // 初始化为空对象
        uuid: '',
        webSocketInstance: null as WebSocketService | null,
        setUserInfo(info: UserBody) {
            state.userInfo = info;
        },
        setWebsocketInstance(webSocketInstance: WebSocketService) {
            state.webSocketInstance = webSocketInstance;
        }
    });

    provide(userStateSymbol, state);

    return state;
};

export const useUserState = () => {
    const state = inject<{
        userInfo: UserBody;
        uuid: string;
        webSocketInstance: WebSocketService;
        setUserInfo: (info: UserBody) => void;
        setWebsocketInstance: (webSocketInstance: WebSocketService) => void;
    }>(userStateSymbol);
    if (!state) {
        throw new Error('useUserState must be used within a provider');
    }
    return state;
};
