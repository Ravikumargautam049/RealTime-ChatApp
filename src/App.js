import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';
import Signup from './Components/signup-login/Signup';
import Login from './Components/signup-login/Login';
import Mainpage from './Components/Mainpage';
import Fof from'./Components/Fof';
import userchats from './Components/userProfile-chat/Userchats';
import Userprofile from './Components/userProfile-chat/Userprofile'

import { useState, useEffect } from 'react';
import {storage, db ,auth } from './firebaseConfig/firebaseConfig'
import { collection,getdocs, query, where,addDoc, docs, setDoc, getDocs} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import Userchats from './Components/userProfile-chat/Userchats';
import Addpost from './Components/posts/Addpost';
import Friendsprofile from './Components/Friendsprofile/Friendsprofile';
import Ptopmsg from './Components/Chat-components/Ptopmsg';


function App() {

   const [user,setUser] = useState(' ')
   const [successMsg, setSuccessMsg] = useState('');
   const [errorMsg, setErrorMsg] = useState('');

   function GetCurrentUser(){
      useEffect(()=> {
         auth.onAuthStateChanged(userlogged => {
            // console.log('inside')
            if(userlogged) {
               const getUser = async () => {
                  const q= query(collection(db,"users"),where("uid","==",userlogged.uid))
                  const data = await getDocs(q);
                  setUser(data.docs.map((doc)=>({...doc.data(),id:doc.id})))
               };
               getUser();
            }
            else {
               setUser(null);
            }
         })
      },[])
      return user
   }

   GetCurrentUser();
   // console.log(user[0])
  return (
      <div>
         {user ? <div>
            <BrowserRouter>
               <Routes>
                  <Route path='/signup' element={<Signup/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/mainpage' element={<Mainpage userdata={user}/>}/>
                  <Route path='/' element={<Mainpage userdata={user}/>}/>
                  <Route path='/userchats' element={<Userchats userdata={user}/>}/>
                  <Route path='/userprofile' element={<Userprofile userdata={user}/>}/>
                  <Route path='/addpost' element= {<Addpost userdata={user}/>}/>
                  <Route path='/searchedprofile/:fuseruid' element={<Friendsprofile userdata={user}/>}/>
                  <Route path='/msgp2p/:fuseruid'element={<Ptopmsg userdata={user}/>}/>
                  <Route path='*' element={<Fof userdata={user}/>}/>
               </Routes>
            </BrowserRouter>
         </div> : 
         <div>
            <BrowserRouter>
               <Routes>
                  <Route path='/signup' element={<Signup/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='*' element={<Login/>}/>
               </Routes>
            </BrowserRouter>
           </div> }
      </div>
  );
}

export default App;
