import React from 'react'
import Navbar from '../Navbar/Navbar'
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { auth } from '../../firebaseConfig/firebaseConfig';
import { storage,db } from '../../firebaseConfig/firebaseConfig';
import { collection,getdocs, query, where,addDoc, docs, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import '../../App.css'

function Addpost(props) {

  let curruser = props.userdata[0]

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  var dateObj = new Date();
  var year = dateObj.getUTCFullYear();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var hour = dateObj.getUTCHours();
  var minute = dateObj.getMinutes();
  var second = dateObj.getSeconds();

  const [description,setDescription] = useState();
  const [postpic, setPostpic] = useState();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if(selectedFile) {
        setPostpic(selectedFile)
        setErrorMsg('')
    }
    else {
        setErrorMsg('Please select your Post Picture!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = curruser;
    const newdate = `${year}${month}${day}${hour}${minute}${second}`;

    if (!description) {
      setErrorMsg('Please provide a description for your post!')
      return;
    }

    const storageRef = ref(storage, `posts/${newdate}`);

    uploadBytes(storageRef,postpic) 
    .then(()=> {
      getDownloadURL(storageRef).then(url => {
        addDoc(collection(db,'posts'), {
          email:user.email,description:description,name:user.name,profilepic: user.profimage
          ,postpic:url,post_user_uid: user.uid, date:parseInt(newdate)
        })
        .then(()=> {
          setSuccessMsg('Posted successfully');
          setTimeout(()=> {
              setSuccessMsg('');
          },2000);
        }).catch((error)=>{
            setErrorMsg(error.message);
            setTimeout(()=>{
                setErrorMsg('');
            },2000);
        });
      })
    })
    .catch((error) =>{
      console.log(error.message)
    })

  }

  return (
    <div>
      {
        props ? 
          <div>
            <Navbar userdata={curruser}/>
            <div className='form-outermost'>
              <h1>Add Post</h1>
              <form action="" className='form-inner'>   
                { successMsg && <>
                  <div className="success-msg">{successMsg}</div>
                  </> }    
                { errorMsg && <>
                  <div className="error-msg">{errorMsg}</div>
                  </> }
                
                  <input type="file" placeholder='choose a Picture to Post.' accept="image/png, image/gif, image/jpeg" onChange={handleProductImg} />
                  <input type="text" placeholder='Write about post...' onChange={(e)=> setDescription(e.target.value)} />
                  <button onClick={handleSubmit}> Submit Post</button>
              </form>
            </div>
         </div> :
         <div>
         <Navbar/>
            <div>Mainpage</div>
          </div>
      }
    </div>
  )
}

export default Addpost