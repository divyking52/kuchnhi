import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { usechatStore } from "../../lib/chatStore"
import { auth, db } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore";
import "./detail.css"

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock}=
    usechatStore();
    const {currentUser} = useUserStore();
    const handleBlock = async() => {
    if(!user) return;

    const userDocRef = doc(db,"users", currentUser.id)

    try{
        await updateDoc(userDocRef,{
            blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),

        });
        changeBlock()
    }
    catch(err){
        console.log(err)
    }
    }
    return(
        <div className ='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>lalalslsllalla.......</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>chat settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoitem">
                            <div className="photodetail">
                            <img src="./theme.png" alt="" />
                            <span>photo_2929</span>
                        </div>
                        <img src="./download.png" alt="" className="icon" />
                    </div><div className="photoitem">
                            <div className="photodetail">
                            <img src="./theme.png" alt="" />
                            <span>photo_2929</span>
                        </div>
                        <img src="./download.png" alt="" className="icon"/>
                    </div><div className="photoitem">
                            <div className="photodetail">
                            <img src="./theme.png" alt="" />
                            <span>photo_2929</span>
                        </div>
                        <img src="./download.png" alt="" className="icon" />
                    </div></div>
                </div>
              
                <button onClick={handleBlock}>{
                    isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "user blocked" : "block User" 
                }</button>
                <button className="logout" onClick={()=> auth.signOut()}>Log Out</button>
            </div>
        </div> 
    )
}
export default Detail