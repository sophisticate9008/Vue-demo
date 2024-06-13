import {Ref, reactive, provide, inject } from 'vue';

const userStateSymbol = Symbol();

export const createUserState = () => {
    
    const state = reactive({
        userInfo: null,
        setUserInfo(info: any) {
            state.userInfo = info;
        }
    });

    provide(userStateSymbol, state);

    return state;
};

export const useUserState = () => {
    const state = inject<{ userInfo: Ref<any | null>, setUserInfo: (info: any) => void }>(userStateSymbol);
    if (!state) {
      throw new Error('useUserState must be used within a provider');
    }
    return state;
  };
  
