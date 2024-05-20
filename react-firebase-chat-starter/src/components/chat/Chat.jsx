import { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { usechatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/Upload";

const Chat = () => {
const [chat,setChat]= useState(false);
const [open,setOpen]= useState(false);
const [text,settext]= useState("");
const [img,setimg]= useState({
    file: null,
    url:"",
});
const {chatId, user,isCurrentUserBlocked, isReceiverBlocked}= usechatStore();
const {currentUser}= useUserStore();

const endRef =  useRef(null);

useEffect(()=> {
    endRef.current?.scrollIntoView({ behavior: "smooth"});
}, []);

useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats",chatId), (res)=>{
        setChat(res.data())

    });


    return () => {
        unSub();
    }
},[chatId])

const handleEmoji = e=> {
    settext((prev)=> prev + e.emoji);
    setOpen(false)
};

const handleImg = e =>{
    if(e.target.files[0]){
    setimg({
        file:e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
    })
}
}
const handleSend =async()=>{
    if(text === "") return;

    let imgUrl =null

    try{

        if(img.file){
            imgUrl = await upload(img.file)
        }

        await updateDoc(doc(db,"chats",chatId),{
            messages:arrayUnion({
                senderId: currentUser.id,
                text,
                createdAt: new Date(),
                ...(imgUrl  &&  {img: imgUrl}),
            }),
        });

        const userIDs = [currentUser.id, user.id];
        userIDs.forEach(async (id)=>{
        const userChatsRef = doc(db,"userchats", id);
        const userChatSnapshot = await getDoc(userChatsRef);

        if(userChatSnapshot.exists()){
            const userChatsData = userChatSnapshot.data()
            const chatIndex = userChatsData.chats.findIndex((c)=> c.chatId === chatId)

            userChatsData.chats[chatIndex].lastMessage = text
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt =  Date.now();

            await updateDoc(userChatsRef,{
                chats:userChatsData.chats,
            });
        }
    });
    }
    catch(err){
        console.log(err);
    }

    setimg({
        file:null,
        url:'',
    })

    settext("");

};
    return(
        <div className ='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>something random sasaasasasaaasasasassaasasasasasassa</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {  chat?.messages?.map(message=>(

                
               <div className={message.senderId === currentUser?.id ? "message own": "message"} key={message?.createAt}>
                    
                    <div className="texts">
                        {message.img && <img src={message.img} alt="" />}
                        <p>{message.text}</p>
                             {/* <span>1 min ago</span> */}
                    </div>
                </div>))}
            {img.url && (
            <div className="message own">
                <div className="texts">
                    <img src="{img.url" alt="" />
                </div>
            </div>)}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                    <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{display:"none"}} onChange={handleImg}/>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" name="" id=""  placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "you cant send a message" : "type a message ......"}
                value={text}
                 onChange={e=>settext(e.target.value)} disabled= {isCurrentUserBlocked || isReceiverBlocked}/>
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={()=>setOpen((prev)=> !prev)}/>
                    <div className="picker">
                    <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                </div>
                </div>
                <button className="sendButton" onClick={handleSend} disabled= {isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div> 
    )
}
export default Chat 