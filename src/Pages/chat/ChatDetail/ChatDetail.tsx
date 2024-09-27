import { useEffect, useRef, useState } from 'react';
import M from '../../../assets/img/Image_not_available.png';
import { IoCall } from "react-icons/io5";
import { IoVideocam } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';
import Input from '../../../Components/Input';
import { FaImage } from "react-icons/fa";
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/Firebase';
import { useChatStore } from '../../../Context/chatStore';
import { useUserStore } from '../../../Context/useStore';
import moment from 'moment';
import { UploadImage } from '../../../Context/UploadImage';
// import { MdDelete } from "react-icons/md";
// import { FaCheckDouble } from "react-icons/fa6";
// import { TiTick } from "react-icons/ti";


interface ImgProps {
  file: any,
  url: string
}
function ChatDetail() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [img, setImg] = useState<ImgProps>({ file: '', url: '' }) as any;
  const [chatdb, setChatdb] = useState() as any;
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, 'chats', chatId), (res: any) => {
        setChatdb(res.data());
      }, (error) => {
        console.error("Error fetching chat data: ", error);
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  // Scroll to the bottom when new messages are received
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatdb?.messages]);

  const handleEmojiClick = (event: any) => {
    setMessage((prevMessage) => prevMessage + event.emoji);
    setShowEmojiPicker(false);
  };

  const handleAvatar = (e: any) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handlesend = async () => {
    if (message === '' && !img.file) return; // Return if no message or image

    let imgurl: any = null;
    try {
      if (img.file) {
        imgurl = await UploadImage(img.file); // Upload the image to Firebase Storage
        console.log("Image URL: ", imgurl);
      }

      // Update the document with a new message in the 'chats' collection
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          message,
          createdAt: new Date(),
          ...(imgurl && { file: imgurl }), // Include image URL if available
        }),
      });

      // Reset message and image state after sending
      setMessage('');
      setImg({ file: '', url: '' });

    } catch (err: any) {
      console.log("Error sending message: ", err);
    }
  };


  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handlesend(); // Call the send function on pressing Enter
    }
  };
  // const handleDelete = async (senderId: any) => {
  //   try {
  //     const messageRef = doc(db, "chats", chatId, "messages", senderId);
  //     await deleteDoc(messageRef);
  //     console.log(`Message ${senderId} deleted successfully.`);
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //   }
  // }
  return (
    <div className="container border-l-2 border-r-2 relative top-0 left-0 right-0 bottom-0">
      {/* top icon */}
      <div className="flex items-center justify-between p-3">
        <div className="user flex items-center gap-5">
          <div className="flex relative">
            <img src={user.avatar || M} className="w-14 h-14 rounded-full" alt="" />
            <div className={`w-4 h-4 rounded-full absolute left-10 top-10 ${user?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div className="user-text flex flex-col">
            <span>{user?.username}</span>
          </div>
        </div>
        <div className="user-icon flex items-center gap-3">
          <IoCall className="text-lg font-bold" />
          <IoVideocam className="text-lg font-bold" />
          <FaInfoCircle className="text-lg font-bold" />
        </div>
      </div>

      {/* chat */}
      <div className={`w-full flex flex-col gap-3  ${chatdb?.messages?.length == 5 ? 'h-96 overflow-y-auto' : ''} `}>
        {chatdb?.messages?.map((message: any) => (
          <div
            key={message?.createdAt}
            className={`flex gap-2 ${message?.senderId === currentUser.id ? 'self-end' : 'self-start'}`}>
            <div className='flex items-start gap-1'>
              {/* <button onClick={() => handleDelete(message?.senderId)}><MdDelete className='text-black mt-4' /></button> */}
              <div className='p-5'>
                {message?.file &&
                  <div className={`p-3 rounded-xl text-white ${message?.senderId === currentUser.id ? ' text-right' : 'text-left'}`}>
                    <img src={message?.file} alt="" className="w-24 h-24 rounded-xl" />
                    {/* <FaCheckDouble />
                    <TiTick />
                    {user?.MessageReadSeen == true ? <FaCheckDouble className='text-blue-500'/> : <FaCheckDouble className='text-gray-400' />} */}
                  </div>
                }
                {message?.message &&
                  <div className={`p-3 rounded-xl text-white ${message?.senderId === currentUser.id ? 'bg-gray-400 text-right' : 'bg-blue-400 text-left'}`}>
                    <p>{message?.message}</p>
                  </div>
                }
                <p className="text-[9px] text-left">{moment(message?.createdAt?.seconds * 1000).format('MMM D, h:mm a')}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* chat input */}
      <div className="w-full flex items-center justify-between gap-5 p-2 absolute bottom-0">
        {img.file && <img src={img.url} alt="" className="w-24 h-24 rounded-xl -mt-10" />
        }        <div className="flex items-center gap-3">
          <label htmlFor="filemessage" className="cursor-pointer">
            <FaImage className="text-xl" />
          </label>
          <input type="file" className="hidden" id="filemessage" name="filemessage" onChange={handleAvatar} />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xl">😀</button>
        </div>
        {showEmojiPicker && (
          <div className="absolute left-14 -top-96">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
          </div>
        )}
        <Input name={''} placeholder="Enter Your Message" className="w-full" value={message} handldChange={(e: any) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
        <button className="text-white bg-blue-500 p-2 text-center rounded" onClick={handlesend}>Send</button>
      </div>
    </div>
  );
}

export default ChatDetail;
