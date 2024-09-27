import { Link, Navigate, Route, Routes } from "react-router-dom"
import Register from "./Pages/Auth/Register"
import Login from "./Pages/Auth/Login"
import Chat from "./Pages/chat"
import Group from "./Pages/GroupChat/index"
import Notification from "./Components/nofitacation"
import { onAuthStateChanged } from "firebase/auth"
import { db, getauth } from './Firebase/Firebase'
import { useEffect } from "react"
import { useUserStore } from './Context/useStore'
import Loading from "./Components/Loading/Loading"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"

function App() {
  const { currentUser, loading, fetchuserinfo } = useUserStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(getauth, async (user) => {
      fetchuserinfo(user?.uid)
      if (user) {
        // User is logged in, set status to online
        await updateDoc(doc(db, "users", user.uid), {
          status: "online",
        });
      } else {
        // User is logged out, set status to offline
        if (getauth.currentUser) {
          await updateDoc(doc(db, "users", getauth.currentUser.uid), {
            status: "offline",
            lastOnline: serverTimestamp(),
          });
        }
      }
    })

    return () => {
      unSub()
    }
  }, [fetchuserinfo])

  if (loading) return <div className="h-full w-full flex flex-col items-center justify-center">
    <Loading />
  </div>
  return (
    <div>
        <div className="flex gap-5">
          <Link to={'/chat'}>Chat</Link>
          <Link to={'/group'}>Group</Link>
        </div>
      <Routes>
        {currentUser ? (
          <>
            <Route path="/chat" element={<Chat />} />
            <Route path="/group" element={<Group />} />
            <Route path="/" element={<Navigate to="/chat" />} />

          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </>
        )}
        <Route path="/signup" element={<Register />} />
      </Routes>
      <Notification />
    </div>

  )
}

export default App

