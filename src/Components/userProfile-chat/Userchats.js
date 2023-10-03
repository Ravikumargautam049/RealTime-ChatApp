import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import './Userchats.css'
import { collection, getDocs, query} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../../firebaseConfig/firebaseConfig'

function Userchats(props) {

  let loggeduser = props.userdata[0]
  const [chats,setChats] = useState([])

  const getchatlist = async () => {
    const chatlistArray = []
    const q = query(collection(db,`allchat-${loggeduser.uid}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      chatlistArray.push({...doc.data(),id:doc.id})
    });
    setChats(chatlistArray)
  }
  getchatlist()

  // console.log()

  return (
    <div>
      {
        props ? <div>
            <Navbar userdata = {loggeduser} />
            <div className='big-head-1'>Userchat</div>
            <div className="chat-list">
              { chats.length>0 ? <>
                  {chats.map((chat) => (
                     <Link style={{textDecoration: 'none'}} to={`/msgp2p/${chat.fuserid}`}>
                     <div className="chat-single" key={chat.id}>
                        <img src={chat.fprofpic} className='nav-profile-pic' />
                        <p>{chat.fusername}</p>
                      </div>
                     </Link>
                  ))}
              </>
              :
              <div> No Chats
                </div>}
            </div>
        </div> :
        <div>
            <Navbar/>
            <div> You are not Logged in</div>
        </div>
      }
    </div>
  )
}

export default Userchats