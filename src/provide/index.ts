import { reactive, provide, inject } from 'vue';
import { UserBody } from '../type';
import { WebSocketService } from '../utils/WebSocket';

const userStateSymbol = Symbol();

export const createUserState = () => {

    const state = reactive({
        userInfo: Object as unknown as UserBody,
        uuid: '',
        webSocketInstance: null as WebSocketService | null,
        setUserInfo(info: any) {
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
    const state = inject<{ userInfo: UserBody, setUserInfo: (info: any) => void, setWebsocketInstance: (websocketInstance: WebSocketService) => void }>(userStateSymbol);
    if (!state) {
        throw new Error('useUserState must be used within a provider');
    }
    return state;
};

