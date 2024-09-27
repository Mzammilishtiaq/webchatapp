import CustomCard from "../../Components/CustomCard"
import ChatContainer from "../../Containers/ChatContainer"
import { useGroupChatStore } from "../../Context/chatsmanystore";
import GroupDetail from "./GroupDetail"
import GroupList from "./GroupList";

function Group() {
    const { groupId } = useGroupChatStore()

    return (
        <ChatContainer styleClass="">
            <CustomCard styleClass="w-full !flex-row justify-between p-5">
                <GroupList />
                {   groupId ? <GroupDetail /> :
                        (<div className="w-full h-full flex flex-col items-center justify-center">
                            <h1 className="text-3xl font-semibold font-sans">WelCome To GroupChatapp</h1>
                        </div>)
                }
            </CustomCard>
        </ChatContainer>
    )
}

export default Group
