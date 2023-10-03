import React from 'react'
import './loginsignupform.css'
import Navbar from '../Navbar/Navbar'
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../firebaseConfig/firebaseConfig';
import { storage,db } from '../../firebaseConfig/firebaseConfig';
import { collection,getdocs, query, where,addDoc, docs, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

function Login() {

  const [email,setEmail]  = useState(); 
  const [password, setPassword] = useState();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth,email,password)
    .then((usercredentials) => {
      const user = usercredentials.user;
      setSuccessMsg('Logged in Successfully')
      setTimeout(()=> {
        navigate('/mainpage');
      },2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)

      if(errorMessage == 'Firebase: Error (auth/wrong-password).' ) {
        setErrorMsg('Wrong Password')
      }
      if(errorMessage == 'Firebase: Error (auth/invalid-email).'){
        setErrorMsg('Invalid Email')
      }
      if(errorMessage == 'Firebase: Error (auth/user-not-found).'){
        setErrorMsg('User not registered ! Please signup first.')
      }
      if(errorMessage == 'Firebase: Error (auth/missing-email).' || errorMessage == 'Firebase: Error (auth/internal-error).' ||
       errorMessage == 'Firebase: Error (auth/missing-password).'){
        setErrorMsg("Field can't be empty")
      }
      setTimeout(() => {
        setErrorMsg('');
      },2000);
    });
  }

  return (
    <div>
        <Navbar />
        <div className="form-outermost">
            <h1>Login</h1>
            <form action="" className='from-inner'>

                {successMsg && <><div className="success-msg">{successMsg}</div></>}    
                {errorMsg && <><div className="error-msg">{errorMsg}</div></>}

                <input type="email" placeholder='Enter Your Email Address' onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} />

                <button onClick={handleLogin}>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login