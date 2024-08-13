import { reactive, provide, inject } from 'vue';
import { UserBody } from '../type';

const userStateSymbol = Symbol();

export const createUserState = () => {
    
    const state = reactive({
        userInfo: Object as unknown as UserBody,
        uuid: '',
        setUserInfo(info: any) {
            state.userInfo = info;
        },
        setWebsocketUuid(string: string) {
            state.uuid = string;
        }
    });

    provide(userStateSymbol, state);

    return state;
};

export const useUserState = () => {
    const state = inject<{ userInfo: UserBody, setUserInfo: (info: any) => void , setWebsocketUuid: (uuid: string) => void}>(userStateSymbol);
    if (!state) {
      throw new Error('useUserState must be used within a provider');
    }
    return state;
  };
  
