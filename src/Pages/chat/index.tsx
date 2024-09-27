import CustomCard from "../../Components/CustomCard"
import ChatContainer from "../../Containers/ChatContainer"
import ChatDetail from "./ChatDetail/ChatDetail"
// import ChatInfo from "./ChatInfo/ChatInfo"
import ChatList from "./ChatList/ChatList"
import { useChatStore } from '../../Context/chatStore'
function Chat() {
    const { chatId } = useChatStore()

    return (
        <ChatContainer styleClass="">
            <CustomCard styleClass="w-full !flex-row justify-between p-5">
                <ChatList />
                {/* <ChatDetail /> */}
                {chatId ? <ChatDetail /> :
                        (<div className="w-full h-full flex flex-col items-center justify-center">
                            <h1 className="text-3xl font-semibold font-sans">WelCome To Chatapp</h1>
                        </div>)
                }
            </CustomCard>
        </ChatContainer>
    )
}

export default Chat
