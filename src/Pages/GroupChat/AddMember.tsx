import { useEffect, useState } from 'react';
import M from '../../assets/img/Image_not_available.png';
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { useGroupChatStore } from '../../Context/chatsmanystore';
// import { useUserStore } from '../../Context/useStore';

type User = {
  id: string;
  username: string;
  avatar: string;
  email: string;
};

function AddMember() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Tracks selected users
  const { groupId, groupChatId } = useGroupChatStore();
  // const { currentUser } = useUserStore();
  //   const [addMode, setAddMode] = useState(true);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(userList);

      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  console.log('groupChatId', groupChatId)
  // Handle checkbox selection
  const handleCheckboxChange = (id: string) => {
    if (selectedUsers.includes(id)) {
      // Remove user from selected users if already selected
      setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
    } else {
      // Add user to selected users
      setSelectedUsers((prev) => [...prev, id]);
    }
  };

  // Handle member addition
  // const handleSubmit = async () => {
  //   if (selectedUsers.length === 0) {
  //     console.log('No users selected');
  //     return;
  //   }

  //   try {
  //     const groupDocRef = doc(db, `GroupRoom/${groupId}`);

  //     await updateDoc(groupDocRef, {
  //       members: arrayUnion(
  //         ...selectedUsers.map((id) => ({
  //           memberId: id,
  //         }))
  //       ),
  //     });
  //     console.log('selected user', selectedUsers)

  //     const userchatRef: any = collection(db, 'Groupuser');
  //     // const chatRef = collection(db, 'groupchats');
  //     // const newChatRef = doc(chatRef)
  //     // await setDoc(newChatRef, {
  //     //     createdAt: serverTimestamp(),
  //     //     messages: [],
  //     // });
  //     for (const userId of selectedUsers) {
  //       const selectedUserChatRef = doc(userchatRef, userId);
  //       await updateDoc(selectedUserChatRef, {
  //         userGroup: arrayUnion({
  //           groupId: groupId,
  //           groupChatId: groupChatId,
  //           lastMessage: {
  //             content: '',
  //             senderId: '',
  //             timestamp: '',
  //           },
  //           receiverId: [userId], // Receiver is the selected user
  //           updatedAt: Date.now(),
  //         }),
  //       });
  //     }

  //     console.log('Members added successfully!');
  //     // Clear the selected users after successful addition
  //     setSelectedUsers([]);
  //     //   setAddMode(false);
  //   } catch (err) {
  //     console.error('Failed to add members:', err);
  //   }
  // };


  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      console.log('No users selected');
      return;
    }
  
    try {
      const groupDocRef = doc(db, `GroupRoom/${groupId}`);
  
      // Update the group document to add the new members
      await updateDoc(groupDocRef, {
        members: arrayUnion(
          ...selectedUsers.map((id) => ({
            memberId: id,
          }))
        ),
      });
      console.log('Selected users:', selectedUsers);
  
      const userchatRef: any = collection(db, 'Groupuser');
  
      for (const userId of selectedUsers) {
        const selectedUserChatRef = doc(userchatRef, userId);
  
        // Check if the document exists before trying to update it
        const userDocSnapshot = await getDoc(selectedUserChatRef);
        if (userDocSnapshot.exists()) {
          // Document exists, update it
          await updateDoc(selectedUserChatRef, {
            userGroup: arrayUnion({
              groupId: groupId,
              groupChatId: groupChatId,
              lastMessage: {
                content: '',
                senderId: '',
                timestamp: '',
              },
              receiverId: [userId], // Receiver is the selected user
              updatedAt: Date.now(),
            }),
          });
        } else {
          // Document does not exist, create it with setDoc
          await setDoc(selectedUserChatRef, {
            userGroup: [{
              groupId: groupId,
              groupChatId: groupChatId,
              lastMessage: {
                content: '',
                senderId: '',
                timestamp: '',
              },
              receiverId: [userId], // Receiver is the selected user
              updatedAt: Date.now(),
            }]
          });
        }
      }
  
      console.log('Members added successfully!');
      setSelectedUsers([]); // Clear selected users after successful addition
    } catch (err) {
      console.error('Failed to add members:', err);
    }
  };


  //   if (!addMode) {
  //     return null;  // You can return a different component or message here when addMode is false
  // }
  // UI
  return (
    <div className="flex flex-col gap-4 items-start absolute top-[15%] right-[10%]  bottom-0 bg-[#00000049] p-4 rounded-lg w-72 h-72 z-50">
      <h1>Add Members</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className={users.length !== 0 ? 'overflow-y-scroll' : ''}>
          {users.map((user: User) => (
            <div key={user.id} className="flex items-center justify-between gap-3 w-60 m-2 bg-gray-200 p-2 rounded-md">
              <img src={user.avatar || M} className="h-14 w-14 rounded-full" alt="avatar" />
              <span>{user.username || 'Name'}</span>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)} // Toggle user selection
              />
            </div>
          ))}
        </div>
      )}

      <button
        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400 w-full"
        onClick={handleSubmit}
        disabled={selectedUsers.length === 0} // Disable if no users are selected
      >
        {selectedUsers.length > 0 ? `Add ${selectedUsers.length} User(s)` : 'Select Users to Add'}
      </button>
    </div>
  );
}

export default AddMember;

