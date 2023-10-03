import React, { useEffect, useState } from 'react'
import './Ptopmsg.css'
import { useParams,  Link } from 'react-router-dom';
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebaseConfig';
import Navbar from '../Navbar/Navbar';

function Ptopmsg(props) {

  const loggeduser = props.userdata[0];
  const { fuseruid } = useParams();
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
        const q = query(collection(db, "users"), where("uid", "==", fuseruid));
        getDocs(q).then((data) => {
          const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setUser(userData);
                    
        })
      };
      getUser()
  },[])

  let curruser = user[0];
  let msgdocp2p;

  useEffect(() => {
    if(loggeduser.uid > fuseruid) {
        msgdocp2p = `${loggeduser.uid}_${fuseruid}`
    }
    if(loggeduser.uid < fuseruid) {
        msgdocp2p = `${fuseruid}_${loggeduser.uid}`
    }
  })

  // for the message user type  and over all chat of user
  const [typedmsg, setTypemsg] = useState("");
  const [p2pmsgs, setp2pmsgs] = useState([]);

  
  var dateObj = new Date();
  var year = dateObj.getUTCFullYear();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var hours = dateObj.getUTCHours();
  var minutes = dateObj.getMinutes();
  var seconds = dateObj.getSeconds();

  useEffect(() => {
    const getMessages = async () => {
        if (!msgdocp2p) return;
        const postsArray = [];
        const postsref = collection(db,`chats-${msgdocp2p}`)
        const q  = query(postsref,orderBy("date","asc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            postsArray.push({ ...doc.data(), id: doc.id });
          });
          setp2pmsgs(postsArray);
    };
    getMessages();
  },[p2pmsgs])

  const sendmsg = (e) => {
    e.preventDefault();
    const newdate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    addDoc(collection(db,`chats-${msgdocp2p}`), {
        typedmsg,from:loggeduser.uid, date: newdate
    })
    .then(()=>{
        console.log("Msg Saved to db successfully")
        typedmsg("");
    }).catch(()=>{
        console.log("Msg Not saved")
    });
  }
  console.log(fuseruid)

  return (
    <div>
        { curruser ? <div>
            <Navbar userdata = {loggeduser}/>
            <div className="p2p-section-1">
                <div className="p2p-section-1">
                    <img src={curruser.profimage} alt="" className='nav-profile-pic' />
                    <p>{curruser.name}</p>
                </div>
            </div>

            <div className="p2p-section-2">
                {  p2pmsgs.length > 0 ? <>
                        { p2pmsgs.map((msg) => (
                            <div key={msg.id}>
                                {msg.from == loggeduser.uid ?     // humare id se match huye to left warna right 
                                   <div className='right-msg'>
                                        <p>{msg.typedmsg}</p>
                                   </div>
                                   :
                                   <div className='left-msg'>
                                        <p>{msg.typedmsg}</p>
                                    </div>
                                } 
                            </div>
                        ))}
                        </>
                     :
                      <div className='big-head'>No messages</div>
                }
            </div>

            <div className="p2p-section-3">
                <input type="text" value={typedmsg} onChange={(e) => {setTypemsg(e.target.value)}} />
                <button onClick={sendmsg}>Send</button>
            </div>
            </div>
            :
        <div>
            <Navbar/>
            <div className='big-head'>No User logged in</div>
        </div>
        }
    </div>
  )
}

export default Ptopmsg