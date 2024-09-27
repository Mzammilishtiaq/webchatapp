import { create } from 'zustand';
import { useUserStore } from './useStore';

type Group = {
    groupName: string;
    groupImage: string;
    createdBy: string;
    createdAt: string;
    groupChatId: string | null;
    id: string;
    members: string[]; // Array of user IDs
    blockedMembers: string[]; // Array of user IDs of blocked members
};

type Store = {
    groupId: string | null;
    groupChatId: string | null;
    group: Group | null;
    isMember: boolean;
    isBlocked: boolean;
    changeGroup: (groupId: string,groupChatId:string, group: Group) => void;
    toggleBlock: (userId: string) => void;
};

export const useGroupChatStore = create<Store>((set) => ({
    groupId: null,
    group: null,
    groupChatId:null,
    isMember: false,
    isBlocked: false,
    changeGroup: (groupId: string,groupChatId:string, group: Group) => {
        const currentUserId = useUserStore.getState().currentUser?.id;

        // Check if the current user ID is available and group is not null
        if (!currentUserId || !group) {
            set({
                groupId,
                group,
                groupChatId,
                isMember: false,
                isBlocked: false,
            });
            return;
        }

        // Check if the current user is a member of the group
        // const isMember = group.members.includes(currentUserId);
        // const isBlocked = group.blockedMembers.includes(currentUserId);

        else {
            set({
                groupId,
                group,
                groupChatId,
                isMember: false,
                isBlocked: false,
            });
        }
    },
    toggleBlock: (userId: string) => {
        set((state) => {
            const newBlockedMembers = state.group?.blockedMembers.includes(userId)
                ? state.group.blockedMembers.filter(id => id !== userId)
                : [...(state.group?.blockedMembers || []), userId];

            return {
                group: { ...state.group!, blockedMembers: newBlockedMembers },
            };
        });
    },
}));
