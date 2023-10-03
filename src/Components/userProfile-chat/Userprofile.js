import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import './Userprofile.css'
import { collection, where,query,getDocs,orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebaseConfig';
import Post_profile from '../posts/Post_profile';

function Userprofile(props) {

    let curruser = props.userdata[0]

    const [posts,setPosts] = useState([]);

    
    useEffect(() => {
        const getPosts  = async () => {
            const postsArray = [];
            const postsref = collection(db,"posts")
            const q = query(postsref,where("post_user_uid","==",curruser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                postsArray.push({...doc.data(), id:doc.id})
            });
            setPosts(postsArray)
        }
        getPosts()
    },[])

    posts.sort((a,b) => {
        return b.date - a.date;
    })
    
    // console.log(posts)


  return (
    <div className='userprofile'>
        {
            props ? <div> 
                <Navbar userdata = {curruser}/>
                <div className='section1'>
                    <div className='left'>
                        <img src={curruser.profimage} alt="Profile picture" className='userprofile-image'/>
                    </div>
                    <div className="right">
                        <h1>{curruser.name}</h1>  
                        <h2>{curruser.email}</h2>  
                    </div>
                </div>
                <div className="userpost-head">
                    <p>Your Posts</p>
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
                <div>
                    <Navbar/>
                    <div>Not Logged In</div>
                </div>
        }
    </div>
  )
}

export default Userprofile