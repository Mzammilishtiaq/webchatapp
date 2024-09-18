import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from '../Firebase/Firebase'

type Store = {
    currentUser: any,
    loading: boolean,
    fetchuserinfo:any
  }

export const useUserStore = create<Store>((set) => ({
    currentUser:null,
    loading: true,
    fetchuserinfo: async (uid: any) => {
        if (!uid) return set({ currentUser: null, loading: false });
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), loading: false })
                console.log("Document data:", docSnap.data());
            } else {
                set({ currentUser: null, loading: false })
                console.log("No such document!");
            }
        } catch (err: any) {
            console.log(err)
            if (!uid) return set({ currentUser: null, loading: false });
        }

    }
}))
