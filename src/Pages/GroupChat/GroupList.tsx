import {  doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from '../../Firebase/Firebase';
import { useGroupChatStore } from '../../Context/chatsmanystore';
import { useUserStore } from '../../Context/useStore';
import M from '../../assets/img/Image_not_available.png'
import AddGroup from './AddGroup';
import Input from '../../Components/Input';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { RiSubtractLine } from 'react-icons/ri';
import { IoAdd } from 'react-icons/io5';
import { IoIosSearch } from 'react-icons/io';
interface User {
    id: string;
    name: string;
};
function GroupList() {
    const { changeGroup } = useGroupChatStore()
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const [addmode, setAddMode] = useState(false)

    const { currentUser } = useUserStore()
    // group list
    useEffect(() => {

        const Sub = onSnapshot(doc(db, 'Groupuser', currentUser.id), async (res: any) => {
            const items = await res.data()?.userGroup || [];

            const promises = items.map(async (item: any) => {
                console.log('items', item)
                const userDocRef = doc(db, 'GroupRoom', item.groupId);
                const userDocSnap = await getDoc(userDocRef);
                // debugger;
                const user = userDocSnap.data();
                return { ...item, user };
            })
            const ChatData = await Promise.all(promises);
            setGroupUsers(ChatData.sort((a, b) => b.updatedAt - a.updatedAt));
        })


        return () => {
            Sub()
        }
    }, [currentUser.id])


    console.log(groupUsers)

    const handleselectgroup = async (group: any) => {
        changeGroup(group?.groupId,group?.groupChatId, group?.user)
        console.log('group', group)
    }
    return (
        <div className='w-72'>
            {/* user search  add user*/}
            <div className="flex flex-col w-72">
                <div className="flex items-center gap-3">
                    <Input name={"search"} type="search" leftIcon={<IoIosSearch className="text-xl" />} className="placeholder:text-gray-300" placeholder="Search User Name" />
                    <div className="my-1">
                        <Dropdown >
                            <MenuButton>{addmode ? <RiSubtractLine className="text-2xl font-bold " /> : <IoAdd className="text-2xl font-bold " />}</MenuButton>
                            <Menu>
                                <MenuItem onClick={() => setAddMode(pre => !pre)}>New Group Chat</MenuItem>
                            </Menu>
                        </Dropdown>
                    </div>

                </div>


            </div>
            <div className="overflow-scroll h-[70vh]">

                {/* group list div */}
                {groupUsers?.map((group: any) => (
                    <div className='flex items-center gap-5 cursor-pointer border-b-2 py-3' key={group?.groupId} onClick={() => handleselectgroup(group)}>
                        <div className="flex relative">
                            <img src={group?.user?.groupImage || M} className='w-14 h-14 rounded-full' alt="" />
                            {/* <div className={`w-4 h-4 rounded-full absolute left-10 top-10 ${group?.user?.status == 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div> */}
                        </div>
                        <div className="">
                            <span className="text-lg font-semibold">{group?.user?.groupName}</span>
                            {/* <p>{group?.lastMessage}</p> */}
                        </div>
                    </div>))}
            </div>
            {addmode && <AddGroup />}
        </div>
    )
}

export default GroupList
