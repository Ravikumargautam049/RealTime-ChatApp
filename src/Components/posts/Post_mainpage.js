import React from 'react'
import './post_mainpage.css'   

function post_mainpage(props) {

  const currpost = props.postdata
  
  return (
    <div className="post-mainpage">
      <div className="section-row">
        <img src={currpost.profilepic} className="prp" />
        <div className="section-col">
          <h1>{currpost.name}</h1>
          <h2>{currpost.email}</h2>
        </div>
        </div>
        <hr />
        <img src={currpost.postpic} className="pop" />
      <hr />
        <p><span>{currpost.name} &nbsp; </span>{currpost.description}</p>
    </div>
  )
}

export default post_mainpage