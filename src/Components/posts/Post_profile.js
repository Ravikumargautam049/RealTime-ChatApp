import React from 'react'
import './Post_profile.css'

function Post_profile(props) {

  let currpost = props.postdata;

  return (
    <div className='post-profile'>
      {/* <p>post aa rha</p> */}
        <img src={currpost.postpic} />
    </div>
  )
}

export default Post_profile