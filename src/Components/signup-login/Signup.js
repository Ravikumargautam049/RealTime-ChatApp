import React from 'react'
import './loginsignupform.css'
import '../../App.css'
import Navbar from '../Navbar/Navbar'
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { auth } from '../../firebaseConfig/firebaseConfig';
import { storage,db } from '../../firebaseConfig/firebaseConfig';
import { collection,getdocs, query, where,addDoc, docs, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'


function Signup() {

  const [email,setEmail]  = useState(); 
  const [password, setPassword] = useState();
  const [name,setUsername]  = useState(); 
  const [dob, setDob] = useState();
  const [profilepic, setProfilepic] = useState();

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if(selectedFile) {
        setProfilepic(selectedFile)
    }
    else {
        setErrorMsg('Please select your Profile Picture!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth,email, password)
    .then((userCredentials)=> {
        const user = userCredentials.user;
        const strorageRef = ref(storage, `profile-images/${Date.now()}`);

        uploadBytes(strorageRef,profilepic).then(()=>{
            getDownloadURL(strorageRef).then(url=>{
                addDoc(collection(db,'users'),{
                    email,password,name,dob,profimage: url,uid:user.uid
                }).then(()=> {
                    setSuccessMsg('user added successfully');
                    setTimeout(()=> {
                        navigate('/login');
                    },2000);
                }).catch((error)=>{
                    setErrorMsg(error.message);
                    setTimeout(()=>{
                        setErrorMsg('');
                    },2000);
                })
            })
        })
        .catch((error)=>{console.log(error.message)})

    })
    .catch((error)=> {
        console.log(error.message) 

        if(error.message == 'Firebase: Error (auth/invalid-email).' ||
        error.message == 'Firebase: Error (auth/admin-restricted-operation).' ||
         error.message == 'Firebase: Error (auth/missing-email).') {
            setErrorMsg("Please fill all required fields")
        }
        if(error.message == 'Firebase: Error (auth/email-already-in-use).')  {
            setErrorMsg('User already exists');
        }
        setTimeout(() => {
            setErrorMsg('');
        }, 2000);
    })
  }

  return (
    <div>
        <Navbar />
        <div className="form-outermost">
            <h1>Sign up</h1>
            <form action="" className='from-inner'>

                {successMsg && <><div className="success-msg">{successMsg}</div></>}    
                {errorMsg && <><div className="error-msg">{errorMsg}</div></>}

                <input type="email" placeholder='Enter Your Email Address' onChange={(e)=>setEmail(e.target.value)} />
                <input type="text" placeholder='Enter Your Full Name' onChange={(e)=>setUsername(e.target.value)} />
                <input type="date" placeholder='Choose Your DOB' onChange={(e)=>setDob(e.target.value)} />
                <input type="password" placeholder='Create a password' onChange={(e)=>setPassword(e.target.value)} />
                <input type="file" placeholder='choose a Profile Picture' accept="image/png, image/gif, image/jpeg" onChange={handleProductImg} />

                <button onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Signup