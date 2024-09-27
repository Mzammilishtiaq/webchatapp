import { Form, Formik } from "formik";
import Input from "../../Components/Input";
import { useState } from "react";
import { useUserStore } from "../../Context/useStore";
import { arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import M from '../../assets/img/Image_not_available.png';
import { UploadImage } from "../../Context/UploadImage";


function AddGroup() {
    const { currentUser } = useUserStore();
    const [addMode, setAddMode] = useState(true);

    const initialValues = {
        groupname: '',
        profileimg: ''
    };

    const [avatar, setAvatar] = useState({
        file: null,
        url: ''
    });

    // const handleSubmit = async (values: any) => {
    //     if (!currentUser?.id) {
    //         console.log("Error: User not logged in");
    //         return;
    //     }
    //     try {
    //         // Await the image upload and get the image URL
    //         const imgUrl = await UploadImage(values.file.file); // Ensure UploadImage is an async function
    //         const groupId = 'groupId' + Math.random()
    //         const GroupRoomRef = doc(db, `GroupRoom/${groupId}`);
    //         const newGroup = {
    //             id: groupId,
    //             groupName: values.groupname,
    //             groupImage: imgUrl,
    //             members: [{
    //                 memberId: currentUser.id,
    //             }],
    //             createdBy: currentUser.id,
    //             createdAt: serverTimestamp(),
    //             lastMessage: {
    //                 content: '',
    //                 senderId: '',
    //                 timestamp: '',
    //             },
    //             isActive: true,
    //         };

    //         // Add the new group to Firestore
    //         await setDoc(GroupRoomRef, newGroup);



    //         // group user
    //         const userchatRef: any = collection(db, 'Groupuser');
    //         const currentUserChatRef = doc(userchatRef, currentUser.id);  // Fixed for current user
    //         // const groupchatRef = collection(db, 'groupchats');
    //         // const newChatRef = doc(groupchatRef)

    //         // await setDoc(newChatRef, {
    //         //     createdAt: serverTimestamp(),
    //         //     messages: [],
    //         // });
            
    //         await updateDoc(currentUserChatRef, {
    //             userGroup: arrayUnion({
    //                 groupId: groupId,
    //                 // groupChatId: newChatRef.id,
    //                 lastMessage: {
    //                     content: '',
    //                     senderId: '',
    //                     timestamp: '',
    //                 },
    //                 receiverId: [{
    //                     memberId: currentUser.id,
    //                 }],  // Fixed spelling from 'reciverId' to 'receiverId'
    //                 updatedAt: Date.now()
    //             })
    //         });



    //         setAddMode(false);
    //     } catch (error) {
    //         console.log("Error creating group:", error);
    //     }
    // };





    const handleSubmit = async (values: any) => {
        if (!currentUser?.id) {
            console.log("Error: User not logged in");
            return;
        }
        try {
            // Await the image upload and get the image URL
            const imgUrl = await UploadImage(values.file.file); // Ensure UploadImage is an async function
            const groupId = 'groupId' + Math.random();
            const GroupRoomRef = doc(db, `GroupRoom/${groupId}`);
            const newGroup = {
                id: groupId,
                groupName: values.groupname,
                groupImage: imgUrl,
                members: [{
                    memberId: currentUser.id,
                }],
                createdBy: currentUser.id,
                createdAt: serverTimestamp(),
                lastMessage: {
                    content: '',
                    senderId: '',
                    timestamp: '',
                },
                isActive: true,
            };
    
            // Add the new group to Firestore
            await setDoc(GroupRoomRef, newGroup);
    
            // group user
            const userchatRef: any = collection(db, 'Groupuser');
            const currentUserChatRef = doc(userchatRef, currentUser.id);  // Fixed for current user
            const chatRef = collection(db, 'groupchats');
            const newChatRef = doc(chatRef);
    
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });
    
            // Check if the currentUserChatRef document exists
            const currentUserDoc = await getDoc(currentUserChatRef);
    
            if (currentUserDoc.exists()) {
                // Document exists, update it
                await updateDoc(currentUserChatRef, {
                    userGroup: arrayUnion({
                        groupId: groupId,
                        groupChatId: newChatRef.id,
                        lastMessage: {
                            content: '',
                            senderId: '',
                            timestamp: '',
                        },
                        receiverId: [{
                            memberId: currentUser.id,
                        }],
                        updatedAt: Date.now()
                    })
                });
            } else {
                // Document does not exist, create it with setDoc
                await setDoc(currentUserChatRef, {
                    userGroup: [{
                        groupId: groupId,
                        groupChatId: newChatRef.id,
                        lastMessage: {
                            content: '',
                            senderId: '',
                            timestamp: '',
                        },
                        receiverId: [{
                            memberId: currentUser.id,
                        }],
                        updatedAt: Date.now()
                    }]
                });
            }
    
            setAddMode(false);
        } catch (error) {
            console.log("Error creating group:", error);
        }
    };
    
    if (!addMode) {
        return null;  // You can return a different component or message here when addMode is false
    }

    return (
        <div className="flex flex-col gap-4 items-start absolute top-[20%] left-[10%] right-0 bottom-0 bg-[#00000049] p-4 rounded-lg w-72 h-96 z-50">
            <h1 className="text-lg font-semibold text-left">Create Group</h1>
            <img src={avatar.url || M} className="w-24 h-24 rounded-full shadow-md" alt="" />
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ handleChange, errors, handleBlur, touched, values, setFieldValue }) => {
                    const handleAvatar = (e: any) => {
                        if (e.target?.files[0]) {
                            setAvatar({
                                file: e.target?.files[0],
                                url: URL.createObjectURL(e.target?.files[0])
                            });
                            setFieldValue('file', {
                                file: e.target?.files[0],
                                url: URL.createObjectURL(e.target?.files[0])
                            });
                        }
                    };
                    return (
                        <Form className="flex flex-col items-center gap-5">
                            <Input
                                id="profileimg"
                                name="profileimg"
                                type="file"
                                variant="borderNone"
                                handldChange={handleAvatar}
                                onBlur={handleBlur}
                                value={values.profileimg}
                                error={errors.profileimg}
                                touched={touched.profileimg}
                                className='w-full sm:w-full'
                            />
                            <Input
                                id="groupname"
                                name="groupname"
                                label="Group Name"
                                labelClassName='flex gap-1'
                                type="text"
                                variant="outline"
                                placeholder="Enter Group Name"
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                value={values.groupname}
                                error={errors.groupname}
                                touched={touched.groupname}
                                className='w-full sm:w-full'
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Group</button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default AddGroup;
