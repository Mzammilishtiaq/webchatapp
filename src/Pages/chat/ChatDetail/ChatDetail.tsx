import { useEffect, useRef, useState } from 'react';
import M from '../../../assets/img/Image_not_available.png'
import { IoCall } from "react-icons/io5";
import { IoVideocam } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react'
import Input from '../../../Components/Input';
import { FaImage } from "react-icons/fa";
// import { FaCamera } from "react-icons/fa";
// import { FaMicrophone } from "react-icons/fa";
// import { FaLink } from "react-icons/fa";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/Firebase';
import { useChatStore } from '../../../Context/chatStore'
import { useUserStore } from '../../../Context/useStore';
import moment from 'moment'

function ChatDetail() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  // const [img, setImg] = useState({
  //   file: '',
  //   url: ''
  // });
  const [chatdb, setChatdb] = useState() as any;
  const { chatId, user } = useChatStore()
  const { currentUser } = useUserStore()

  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, 'chats', chatId), (res: any) => {
        setChatdb(res.data());
        console.log(chatId)
      }, (error) => {
        console.error("Error fetching chat data: ", error);
      })

      return () => {
        unSub();
      }
    }



  }, [chatId])
  console.log('chatdb', chatdb)
  const handleEmojiClick = (event: any) => {
    setMessage(prevMessage => prevMessage + event.emoji);
    setShowEmojiPicker(false)
  };


  const handlesend = async () => {
    if (message === '') return;
    setMessage('');
    try {
      // Update the document with a new message in the 'chats' collection
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          message,
          createdAt: new Date(),
        }),
      });
      const userIDs = [currentUser.id, user.id]
      userIDs.forEach(async (id: any) => {

        const userChatsRef = doc(db, 'userchats', id);
        const userChatSnapShot = await getDoc(userChatsRef);

        if (userChatSnapShot.exists()) {
          const userChatsData = userChatSnapShot.data();
          userChatsData.chats[0].lastMessage = message;
          // userChatsData.chats[0].isSeen = id === user.id ? true : false;
          userChatsData.chats[0].MessageReadSeen = id === currentUser.id ? true : false;
          userChatsData.chats[0].updatedAt = Date.now();


          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          })
          // console.log(chats)
        }
      })

    } catch (err: any) {
      console.log(err);
    }
  };




  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handlesend(); // Call the send function on pressing Enter
    }
  };

  return (
    <div className="container border-l-2 border-r-2 relative top-0 left-0 right-0 bottom-0">
      {/* top icon */}
      <div className='flex items-center justify-between p-3'>
        <div className="user flex items-center gap-5">
          <div className="flex relative">
            <img src={user.avatar || M} className='w-14 h-14 rounded-full' alt="" />
            <div className={`w-5 h-5 rounded-full absolute left-10 top-10 ${user?.status == 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div className="user-text flex flex-col">
            <span>{user?.username}</span>
            {/* <span className='text-gray-400 font-semibold text-sm' >{user?.isSeen === true ? "Active" : 'last seen ' + user?.updatedAt}</span> */}
          </div>
        </div>
        <div className="user-icon flex items-center gap-3">
          <IoCall className='text-lg font-bold' />
          <IoVideocam className='text-lg font-bold' />
          <FaInfoCircle className='text-lg font-bold' />
        </div>
      </div>

      {/* chat */}
      <div className='w-full flex flex-col gap-3 p-3'>
        {chatdb?.messages?.map((message: any) => (
          <div
            key={message?.createdAt}
            className={`flex gap-2 ${message?.senderId === currentUser.id ? 'self-end' : 'self-start'
              }`}>
            <img src={message?.img} alt="" className="" />
            <div>
              <div className={` p-3 rounded-xl text-white  ${message?.senderId === currentUser.id ? 'bg-gray-400 text-right' : 'bg-blue-400 text-left '}`}>
                {/* <p>{message?.username}</p></div> */}
                <p>{message?.message}</p></div>
              <p className='text-sm text-left'>{moment(message?.createdAt?.seconds * 1000).format('MMM D,  h:mm a')}</p>
            </div>
          </div>
        ))}

        {/* <div className='own self-end flex gap-2'>
          <h1 className='text-white bg-blue-400 rounded-full py-2 px-2 text-2xl w-14 h-14 text-center'>M</h1>
          <div>
            <div className='bg-blue-400  text-right p-3 rounded-xl text-white'>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <p className='text-sm text-left'>1 min ago</p>
          </div>
        </div> */}
        <div ref={endRef}></div>
      </div>

      {/* chat input */}
      <div className='w-full flex items-center justify-between gap-5 p-2 absolute bottom-0 '>
        <div className='flex items-center gap-3'>
          {/* <FaLink className='text-xl' />
          <FaMicrophone className='text-xl' /> */}
          {/* <FaCamera className='text-xl' /> */}
          <label htmlFor="filemessage" className='cursor-pointer'>
            <FaImage className='text-xl' />
          </label>
          <input type="file" className='hidden' id='filemessage' name='filemessage' />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='text-xl'>
            😀
          </button>
        </div>
        {showEmojiPicker && (
          <div className='absolute left-14 -top-96'> <EmojiPicker onEmojiClick={handleEmojiClick} height={350} /></div>
        )}
        <Input name={''} placeholder='Enter Your Message' className='w-full' value={message} handldChange={(e: any) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
        <button className='text-white bg-blue-500 p-2 text-center rounded' onClick={handlesend}>Send</button>
      </div>
    </div>
  )
}

export default ChatDetail
