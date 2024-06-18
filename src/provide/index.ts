import { reactive, provide, inject } from 'vue';
import { UserBody } from '../type';

const userStateSymbol = Symbol();

export const createUserState = () => {
    
    const state = reactive({
        userInfo: Object as unknown as UserBody,
        setUserInfo(info: any) {
            state.userInfo = info;
        }
    });

    provide(userStateSymbol, state);

    return state;
};

export const useUserState = () => {
    const state = inject<{ userInfo: UserBody, setUserInfo: (info: any) => void }>(userStateSymbol);
    if (!state) {
      throw new Error('useUserState must be used within a provider');
    }
    return state;
  };
  
