import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import { useParams, Link} from 'react-router-dom'
import './Friendsprofile.css'
import { collection, getDocs, query, where,addDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig/firebaseConfig'
import Post_profile from '../posts/Post_profile'

function Friendsprofile(props) {

  const { fuseruid } = useParams();
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const loggeduser = props.userdata[0];  // logged user
  let curruser = user[0];  // searched user
  // console.log(loggeduser)
  // console.log(curruser)
  
  const getPosts = async () => {

    if (curruser && curruser.uid) {
      const postsArray = [];
      const postsref = collection(db, "posts");
      const q = query(postsref, where("post_user_uid", "==", curruser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postsArray.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postsArray);
    } else {
      console.error("User or uid is undefined in getPosts");
      console.log(posts)
    }
  };
  
  
  const getUser = async () => {
    const q = query(collection(db, "users"), where("uid", "==", fuseruid));
    getDocs(q).then((data) => {
      const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUser(userData);
  
      const user = userData[0];
      if (user && user.uid) {
        curruser = user; // Assign curruser here
        getPosts();
      }
    });
  };
  
  // Call getUser when the component mounts
  useEffect(() => {
    getUser();
  }, []); 
  
  posts.sort((a,b) => {
    return b.date - a.date;
  })

  const addtouserchats = () => {
     const addftologged = () => {         // add friend in my chat section
        const q = query(collection(db, `allchat-${loggeduser.uid}`), where("fuseruid","==",fuseruid))
        getDocs(q).then((data)=> {
              console.log(data.docs);
              if(data.docs.length !=0 ) {    // user already added to chat
                console.log('user already present to chat list')
              }
              else {
                addDoc(collection(db, `allchat-${loggeduser.uid}`), {
                  fuseruid:curruser.uid, fprofpic: curruser.profimage, fusername: curruser.name
                })
                .then(() => {
                  console.log("user added to chat section")
                }).catch(() => {
                  console.log("user not added to chat section")
                });
              }
        })
     }
     const addloggedtof = () => {
      const q = query(collection(db, `allchat-${fuseruid}`), where("fuseruid","==",loggeduser.uid))
        getDocs(q).then((data)=> {
              console.log(data.docs)
              if(data.docs.length !=0 ) {    // user already added to chat
                  console.log('user already present to chat list')
              }
              else {
                addDoc(collection(db, `allchat-${fuseruid}`), {
                  fuseruid:loggeduser.uid, fprofpic: loggeduser.profimage, fusername: loggeduser.name
                })
                .then(()=> {
                  console.log("user added to chat section")
                }).catch(() => {
                  console.log("user not added to chat section")
                });
              }
        })
     }

     addftologged();
     addloggedtof();
  }


   return (
    
    <div className="userprofile">
        { user ? <div>
          <Navbar userdata={loggeduser}/>
          <div className='section1'>
              <div className='left'>
                  <img src={curruser.profimage} alt="Profile picture" className='userprofile-image'/>
              </div>
              <div className="right">
                  <h1>{curruser.name}</h1>  
                  <h2>{curruser.email}</h2>  
              </div>
              { loggeduser.uid != curruser.uid ? 
              <Link to={`/msgp2p/${curruser.uid}`}>
                <button className="msg-btn-profile" onClick={addtouserchats}>message</button>
                </Link> : <></>}
          </div>

          <div className="userpost-head">
              <p>{curruser.name}'s Posts</p>
          </div>
          
          <div className="section2">
          {   posts.length > 0 ? <>
                  { posts.map((post) => (
                      <Post_profile key={post.id} postdata = {post}/>
                  ))}
                  </> 
              :
              <div className='big-head'>No Post</div>
          }
      </div>
        </div> :
        <div> Loading... </div>
        }
    </div>
  )
}

export default Friendsprofile