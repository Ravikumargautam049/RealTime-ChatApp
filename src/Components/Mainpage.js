import React from 'react'
import Navbar from './Navbar/Navbar'
import './Mainpage.css'
import Post_profile from './posts/Post_profile'
import { useState,useEffect } from 'react'
import Post_mainpage from './posts/Post_mainpage'
import { collection, doc,getDocs,query } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebaseConfig'

function Mainpage(props) {

  let curruser = props.userdata[0]
  
  const [posts,setPosts] = useState([]);

  useEffect(()=>{
    const getPosts = async() => {
      const postsArray = [];
      const postsref = collection(db,"posts")
      const q = query(postsref);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc)=>{
          postsArray.push({...doc.data(), id:doc.id})
      });
      setPosts(postsArray)
    }
    getPosts()
  },[])

  function shuffleArray(array) {
    for(var i=array.length-1; i>0; i--) {
      var j = Math.floor(Math.random()*(i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  shuffleArray(posts)

  return (
    <div>
      { props ? 
          <div>
            <Navbar userdata={curruser}/>
            <div className='Mainpage-outer'>
                     {   posts.length > 0 ? <div>
                        { posts.map((post) => (
                            <Post_mainpage key={post.id} postdata = {post}/>
                        ))}
                        </div> 
                            :
                          <div className="big-head">Try Refreshing the page...</div>
                     }
            </div>
          </div>
          :
              <div>
              <Navbar/>
                <div>Mainpage</div>
              </div>
      }
    </div>
  )
}

export default Mainpage