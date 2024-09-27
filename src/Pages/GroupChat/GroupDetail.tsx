import { IoCall } from "react-icons/io5";
import { IoVideocam } from "react-icons/io5";
import { FaImage, FaInfoCircle } from "react-icons/fa";
import Input from "../../Components/Input";
import { useGroupChatStore } from "../../Context/chatsmanystore";
import M from '../../assets/img/Image_not_available.png'
import AddMember from "./AddMember";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { db } from "../../Firebase/Firebase";
import { doc, onSnapshot, arrayUnion, updateDoc } from 'firebase/firestore';
import { useUserStore } from "../../Context/useStore";
import moment from "moment";
import { UploadImage } from "../../Context/UploadImage";

interface ImgProps {
    file: any,
    url: string
}

function GroupDetail() {
    const { group, groupId, groupChatId } = useGroupChatStore();
    const { currentUser } = useUserStore()
    const [addMemberpopup, setAddMemberPopup] = useState(false)
    const [groupinfopopup, setGroupInfoPopup] = useState(false)
    const [chatdb, setChatdb] = useState([]) as any;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [img, setImg] = useState<ImgProps>({ file: '', url: '' }) as any;
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!groupChatId || !groupId) {
            console.error('groupChatId or groupId is null');
            return; // Prevent further execution if these values are missing
        }

        const unSub = onSnapshot(doc(db, 'groupchats', groupChatId), (res: any) => {
            const data = res.data();
            console.log('Fetched data:', data); // Log the structure of the data
            if (data && Array.isArray(data.messages)) {
                setChatdb(data.messages); // Set chatdb to the messages array
            } else {
                setChatdb([]); // Ensure chatdb is always an array
            }
        }, (error) => {
            console.error("Error fetching chat data: ", error);
        });

        return () => {
            unSub();
        };
    }, [groupChatId, groupId]);


    console.log('messagesdb', chatdb)

    const handlesend = async () => {
        if (newMessage.trim() === '' || !groupChatId) return;
        if (newMessage === '' && !img.file) return; // Return if no message or image

        try {
            let imgurl: any = null;
            if (img.file) {
              imgurl = await UploadImage(img.file); // Upload the image to Firebase Storage
              console.log("Image URL: ", imgurl);
            }
            // Send a new message to the Firestore subcollection
            await updateDoc(doc(db, 'groupchats', groupChatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    newMessage,
                    createdAt: new Date(),
                    ...(imgurl && { file: imgurl }), // Include image URL if available
                }),
            });
            setNewMessage(''); // Clear input after sending
            setImg({
                file: '',
                url: '',
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handlesend(); // Call the send function on pressing Enter
        }
    };

    const handleEmojiClick = (event: any) => {
        setNewMessage((prevMessage) => prevMessage + event.emoji);
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


    useEffect(() => {
        if (endRef.current) {
          endRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [chatdb]);

    return (
        <div className="contailner border-l-2 border-r-2 relative top-0 left-0 right-0 bottom-0 w-full">
            <div className="flex items-center justify-between p-3">
                <div className="user flex items-center gap-5">
                    <div className="flex relative">
                        <img src={group?.groupImage || M} className="w-14 h-14 rounded-full" alt="" onClick={() => setGroupInfoPopup(pre => !pre)} />
                        {/* <div className={`w-4 h-4 rounded-full absolute left-10 top-10 ${user?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div> */}
                    </div>
                    <div className="user-text flex flex-col">
                        <span>{group?.groupName}</span>
                    </div>
                </div>
                <div className="user-icon flex items-center gap-3">
                    <IoCall className="text-lg font-bold" />
                    <IoVideocam className="text-lg font-bold" />
                    <FaInfoCircle className="text-lg font-bold" />
                    <button
                        className="text-white bg-blue-500 rounded-md p-2"
                        onClick={() => setAddMemberPopup(pre => !pre)}
                    >
                        Add Member
                    </button>
                </div>
            </div>
            {/* chat */}
            <div className={`w-full flex flex-col gap-3  ${chatdb?.length !== 2 ? 'h-96 overflow-y-scroll' : ''} `}>
                {chatdb?.map((message: any) => (
                    <div
                        key={message?.createdAt}
                        className={`flex gap-2 ${message?.senderId === currentUser?.id ? 'self-end' : 'self-start'}`}>
                        <div className='flex items-start gap-1'>
                            {/* <button onClick={() => handleDelete(message?.senderId)}><MdDelete className='text-black mt-4' /></button> */}
                            <div className='p-5'>
                                {message?.file &&
                                    <div className={`p-3 rounded-xl text-white ${message?.senderId === currentUser?.id ? ' text-right' : 'text-left'}`}>
                                        <img src={message?.file} alt="" className="w-24 h-24 rounded-xl" />
                                        {/* <FaCheckDouble />
                    <TiTick />
                    {user?.MessageReadSeen == true ? <FaCheckDouble className='text-blue-500'/> : <FaCheckDouble className='text-gray-400' />} */}
                                    </div>
                                }
                                {message?.newMessage &&
                                    <div className={`p-3 rounded-xl text-white ${message?.senderId === currentUser.id ? 'bg-gray-400 text-right' : 'bg-blue-400 text-left'}`}>
                                        <p>{message?.newMessage}</p>
                                    </div>
                                }
                                <p className="text-[9px] text-left">{moment(message?.createdAt?.seconds * 1000).format('MMM D, h:mm a')}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div>

            </div>

            {/* chat input */}
            <div className="w-full flex items-center justify-between gap-5 p-2 absolute bottom-0">
                {img.file && <img src={img.url} alt="" className="w-24 h-24 rounded-xl -mt-10" />}
                <div className="flex items-center gap-3">
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
                <Input name={''} placeholder="Enter Your Message" className="w-full" value={newMessage} handldChange={(e: any) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} />
                <button className="text-white bg-blue-500 p-2 text-center rounded" onClick={handlesend}>Send</button>
            </div>




            {/* group info */}
            {groupinfopopup && <div className="flex flex-col gap-4 items-start absolute top-[10%] left-[15%] right-0 bottom-0 bg-[#00000049] p-4 rounded-lg w-72 h-72 z-50">
                <h1>group info</h1>
                <div className="flex w-full items-center justify-between gap-5 bg-gray-200 p-2 rounded-md">
                    <img src={M} className="h-14 w-14 rounded-full" alt="" />
                    <span>Name</span>
                </div>
            </div>}
            {addMemberpopup && <AddMember />}
        </div>
    )
}

export default GroupDetail
