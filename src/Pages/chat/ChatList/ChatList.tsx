import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { FaEdit } from "react-icons/fa";
// import { IoCall } from "react-icons/io5";
// import { IoVideocam } from "react-icons/io5";
import { IoAdd } from "react-icons/io5"
import Input from "../../../Components/Input"
import { IoIosSearch } from "react-icons/io";
import { RiSubtractLine } from "react-icons/ri";
import M from '../../../assets/img/Image_not_available.png'
import AddUser from "./AddUser";
import { useUserStore } from "../../../Context/useStore";
import { useChatStore } from "../../../Context/chatStore";
import { db } from '../../../Firebase/Firebase'
import NoImage from '../../../assets/img/Image_not_available.png'
// import { useNavigate } from "react-router-dom";
import {  doc, getDoc, onSnapshot } from "firebase/firestore";
import { useFirebase } from "../../../Context/Context";
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

interface Chat {
  chatid: string;
  lastMessage: string;
  updatedAt: number;
  user: {
    avatar: string;
    username: string;
  };
}


function ChatList() {
  const [userinfopopup, setUserinfodetail] = useState(false)
  const [addmode, setAddMode] = useState(false)
  const [userchatlist, setUserChatList] = useState<Chat[]>([])
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();
  const { logout } = useFirebase()

  // user chatlist
  useEffect(() => {
    const Sub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res: any) => {
      const items = res.data()?.chats || [];

      const promises = items.map(async (item: any) => {
        const userDocRef = doc(db, 'users', item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        // debugger;
        const user = userDocSnap.data();
        return { ...item, user };
      })
      const ChatData = await Promise.all(promises);
      setUserChatList(ChatData.sort((a, b) => b.updatedAt - a.updatedAt));
    })


    return () => {
      Sub()
    }
  }, [currentUser.id])




  const handleselect = async (chat: any) => {
    changeChat(chat.chatid, chat.user);
    console.log(chat.chatid, chat.user)
  }




  return (
    <div className="gap-4 flex flex-col relative top-0 left-0 right-0 bottom-0 ">
      <div className=" flex items-center justify-between gap-1">
        <div className="flex items-center gap-3">
          <div onClick={() => setUserinfodetail(pre => !pre)} className="flex relative cursor-pointer">
            <img src={currentUser?.avatar || M} className='w-14 h-14 rounded-full' alt="" />
            <div className={`w-4 h-4 rounded-full absolute left-10 top-10 ${currentUser?.status == 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          {/* <div onClick={() => setUserinfodetail(pre => !pre)}><img src={currentUser.avatar || NoImage} className="w-10 h-10 cursor-pointer" alt="" /></div> */}
          <h1 className="text2xl font-semibold">{currentUser.username}</h1>
        </div>
        {/* <IoCall className="text-lg" />
        <IoVideocam className="text-lg" /> */}
        {/* <FaEdit className="text-lg" /> */}
        <HiOutlineDotsHorizontal className="text-lg" />

        {/* popup logout */}
        {userinfopopup && <div className=" flex flex-col items-start gap-4 absolute left-5 top-10 right-0 bottom-0 h-[40%] w-[90%] z-50 bg-gray-300 rounded-xl p-3">
          <div className="flex items-center  gap-3">
            <img src={currentUser.avatar || NoImage} className="w-14 h-14" alt="" />
            <h1 className="text2xl font-semibold text-white">{currentUser.username}</h1>
          </div>
          <p className="text-lg font-medium text-gray-500">{currentUser.email}</p>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={() => logout()} >Logout</button>
        </div>}
      </div>




      {/* user search  add user*/}
      <div className="flex flex-col w-72">
        <div className="flex items-center gap-3">
          <Input name={"search"} type="search" leftIcon={<IoIosSearch className="text-xl" />} className="placeholder:text-gray-300" placeholder="Search User Name" />
          {/* <div className="bg-gray-100 rounded" onClick={() => setAddMode((pre) => !pre)}>
            {addmode ? <RiSubtractLine className="text-4xl font-bold " /> : <IoAdd className="text-4xl font-bold " />}
          </div> */}
          <div className="my-1">
            <Dropdown >
              <MenuButton>{addmode ? <RiSubtractLine className="text-2xl font-bold " /> : <IoAdd className="text-2xl font-bold " />}</MenuButton>
              <Menu>
                <MenuItem onClick={() => setAddMode((pre) => !pre)}>New Chat</MenuItem>
              </Menu>
            </Dropdown>
          </div>
        </div>


        {/* user list */}
        <div className="overflow-scroll h-[70vh]">
          {userchatlist?.map((chat: any) => (
            <div className='flex items-center gap-5 cursor-pointer border-b-2 py-3' key={chat.chatid} onClick={() => handleselect(chat)}>
              <div className="flex relative">
                <img src={chat?.user?.avatar || M} className='w-14 h-14 rounded-full' alt="" />
                <div className={`w-4 h-4 rounded-full absolute left-10 top-10 ${chat?.user?.status == 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div className="">
                <span className="text-lg font-semibold">{chat?.user?.username}</span>
                <p>{chat?.lastMessage}</p>
              </div>
            </div>))}
         
        </div>




      </div>
      {addmode && <AddUser />}
      
    </div>
  )
}

export default ChatList
