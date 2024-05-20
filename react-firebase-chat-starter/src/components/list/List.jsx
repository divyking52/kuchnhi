import "./list.css"
import Userinfo from "./userinfo/Userinfo"
import Chatlist from "./Chatlist/Chatlist"

const List = () => {
    return(
        <div className ='list'>
            <Userinfo/>
            <Chatlist/>
        </div> 
    )
}
export default List