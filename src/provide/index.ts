import { reactive, provide, inject } from 'vue';
import { UserBody } from '../type';
import { MessageWebSocketService } from '../utils/WebSocket';

const userStateSymbol = Symbol();

export const createUserState = () => {
    const state = reactive({
        userInfo: {} as UserBody, // 初始化为空对象
        uuid: '',
        messageWebSocketInstance: null as MessageWebSocketService | null,
        setUserInfo(info: UserBody) {
            state.userInfo = info;
        },
        setWebsocketInstance(messageWebSocketInstance: MessageWebSocketService) {
            state.messageWebSocketInstance = messageWebSocketInstance;
        }
    });

    provide(userStateSymbol, state);

    return state;
};

export const useUserState = () => {
    const state = inject<{
        userInfo: UserBody;
        uuid: string;
        messageWebSocketInstance: MessageWebSocketService;
        setUserInfo: (info: UserBody) => void;
        setWebsocketInstance: (messageWebSocketInstance: MessageWebSocketService) => void;
    }>(userStateSymbol);
    if (!state) {
        throw new Error('useUserState must be used within a provider');
    }
    return state;
};
