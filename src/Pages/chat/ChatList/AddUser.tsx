import { Form, Formik } from "formik"
import Input from "../../../Components/Input"
// import * as Yup from 'yup'
// import M from '../../../assets/img/M.jpg'
import { arrayUnion, collection, doc, getDocs, query, setDoc, updateDoc, where, serverTimestamp} from "firebase/firestore"
import { db } from "../../../Firebase/Firebase"
import { useState } from "react"
import { useUserStore } from "../../../Context/useStore"

function AddUser() {
  const { currentUser } = useUserStore()
  const [useradd, setUserAdd] = useState(null) as any
  const intialvaluesdata = {
    username: ''
  }
  const handleSubmit = async (values: any) => {
    console.log('search value ==>', values)
    try {
      const citiesRef = collection(db, "users");
      // Create a query against the collection.
      const q: any = query(citiesRef, where("username", "==", values.username));
      const querysnapshot: any = await getDocs(q)
      if (!querysnapshot.empty) {
        const userData = querysnapshot.docs[0].data();
        setUserAdd(userData);
      } else {
        setUserAdd(null); // Reset if no user found
      }
    } catch (err: any) {
      console.log(err)
    }

  }

  const handleAddChat = async () => {

    // if (!useradd || !currentUser) return;

    const chatRef = collection(db, 'chats');
    const userchatRef: any = collection(db, 'userchats');
    try {
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        message: [],
      });

      const currentUserChatRef = doc(userchatRef, currentUser.id);  // Fixed for current user

      await updateDoc(currentUserChatRef, {
        chats: arrayUnion({
          chatid: newChatRef.id,
          lastMessage: '',
          receiverId: useradd.id,  // Fixed spelling from 'reciverId' to 'receiverId'
          updatedAt: Date.now()
        })
      });

      const addedUserChatRef = doc(userchatRef, useradd.id);  // For the added user
      await updateDoc(addedUserChatRef, {
        chats: arrayUnion({
          chatid: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser.id,  // Fixed spelling from 'reciverId' to 'receiverId'
          updatedAt: Date.now()
        })
      });

      console.log(newChatRef.id)
    } catch (err: any) { console.log(err) }
  }



  return (
    <div className="flex flex-col gap-3 absolute top-[20%] left-[110%] right-0 bottom-0 bg-[#0000007e]  p-4 rounded-lg w-[100%] h-40 z-50">
      <Formik initialValues={intialvaluesdata} onSubmit={handleSubmit}>
        {
          ({ handleChange, errors, handleBlur, touched, values }) => (
            <Form className="flex items-center gap-5">
              <Input
                id="username"
                name="username"
                //  label="User"
                //  labelClassName='flex gap-1'
                type="text"
                variant="outline"
                placeholder="Enter Email ID"
                handldChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                error={errors.username}
                touched={touched.username}
                className='w-full sm:w-full'
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded" >Search</button>
            </Form>)}
      </Formik>

      <div>
        {useradd &&
          <div className="flex items-center justify-between gap-5 bg-gray-200 p-2 rounded-md">
            <img src={useradd?.avatar} className="h-14 w-14 rounded-full" alt="" />
            <span>{useradd?.username}</span>
            <button onClick={handleAddChat} className="bg-blue-500 text-white p-1 rounded">Add User</button>
          </div>
        }
      </div>
    </div>
  )
}

export default AddUser
