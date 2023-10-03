import React from 'react'
import mainlogo from '../assets/mainlogo.png'
import { Link } from 'react-router-dom'
import './Navbar.css'
import '../../App.css'
import { useNavigate } from 'react-router-dom'
import { db,auth } from '../../firebaseConfig/firebaseConfig'
import { signOut } from 'firebase/auth'
import Addicon from "../assets/addicon.png"
import chatlogo from "../assets/chatlogo.png"
import homeicon from "../assets/homeicon.png"
import { useState, useEffect } from 'react'
import { collection } from 'firebase/firestore'
import { doc, getDocs, query, where } from 'firebase/firestore'
import Mainpage from '../Mainpage'


function Navbar(props) {

  const navigate = useNavigate()
  const logoutuser = () => {
    signOut(auth).then(()=> {
      setTimeout(()=>{
        navigate('/login');
      },2000)
    }).catch((error)=>{
      console.log(error.message);
    })
  }

  let curruser = props.userdata

  const [finduser, setFinduser] = useState("");
  const [finduserdoc, setFinduserdoc] = useState("");
  const [searched, setSearched] = useState(false);

  const searchuser = (e) => {
      e.preventDefault();

      const getUser = async() => {
        const q  = query(collection(db,"users"),where("email","==",finduser))
        const data = await getDocs(q);
        setFinduserdoc(data.docs.map((doc)=>({...doc.data(),id:doc.id})));

        if(finduserdoc.length != 0) {
          navigate(`/searchedprofile/${finduserdoc[0].uid}`);
        }
      }
      getUser();
  }

  // useEffect(() => {
  //   if (searched && finduserdoc.length > 0) {
      
  //   }
  // }, [searched, finduserdoc]);
  
  return (
    <div>
        <nav>
            <div className="left">
                <img src={mainlogo} alt="" className='mainlogo' />
                <div className="web-name">Chit Chat</div>
            </div>

            { curruser != undefined ? 
                <div className="center">
                  <input placeholder='Search a friend by email...' onChange={(e)=>setFinduser(e.target.value)} className='search-user'/>
                  <button onClick={searchuser}>&gt;</button>
                </div> : <div></div>
            }

            {
              curruser != undefined ?
              <div className="right">
                <Link to={'/mainpage'}>
                    <img src={homeicon} alt=""  className='nav-profile-pic'/>
                </Link>
                <Link to='/addpost'>
                  <img src={Addicon} alt=""  className='nav-profile-pic add-icon' />
                </Link>
                <Link to='/userchats'>
                  <img src={chatlogo} className='nav-profile-pic' />
                </Link>
                <Link to='/userprofile'>
                  <img src={curruser.profimage}  alt="Profile Pic" className='nav-profile-pic' />
                </Link>
                  <button onClick={logoutuser}>Logout</button>
              </div>
              :
              <div className='right'>
                <Link to='/login'><button>Login</button></Link>
                <Link to='/signup'><button>Signup</button></Link>
              </div>
            }
        </nav>
        <hr className='nav-hr'/>
    </div>
  )
}

export default Navbar