import { create } from 'zustand';
import { useUserStore } from './useStore'

type Store = {
    chatId: any,
    user: any,
    isCurrentUser: boolean,
    isreciverBlocked: boolean,
    changeChat:any,
    changeBlock:any
}

export const useChatStore = create<Store>((set: any) => ({
    chatId: null,
    user: null,
    isCurrentUser: false,
    isreciverBlocked: false,
    changeChat: (chatId: any, user: any) => {
        const currentUser = useUserStore.getState().currentUser;

        // check if current ser is blocked
        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUser: true,
                isreciverBlocked: false,
            })
        }

        // check if current ser is blocked
        else if (user.blocked.includes(user.id)) {
            return set({
                chatId,
                user: user,
                isCurrentUser: false,
                isreciverBlocked: true,
            })
        }

        else{
           return set({
                chatId,
                user: user,
                isCurrentUser: false,
                isreciverBlocked: true,
            })
        }
    },
    changeBlock:()=>{
        set((state: { isreciverBlocked: any; }) =>({...state,isreciverBlocked: !state.isreciverBlocked}))
    }
}))
