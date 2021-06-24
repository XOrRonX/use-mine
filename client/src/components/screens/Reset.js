import React, { useState } from "react"
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {
  const history = useHistory()
  const [email, setEmail] = useState("");

  const PostData = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "אימייל לא תקין", classes:"#b71c1c red darken-4"})
      return
    }
    fetch("/reset-password",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
        
      },
      body:JSON.stringify({
        email
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html: data.error, classes:"#b71c1c red darken-4"})
      } else {
        M.toast({html:data.message, classes:"#689f38 light-green darken-2"})
        history.push('/signin')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <div className="mycard">
      <div className="card auth-card ">
      <img style={{width:"150px"}} src="https://res.cloudinary.com/dyiceswks/image/upload/v1618057929/UseMine_znnhow.png" alt="_blank" ></img>
        <input type="text" placeholder="אימייל" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <button style={{margin:"10px"}} className="btn waves-effect  light-blue darken-4" onClick={()=>PostData()}>אפס סיסמא</button>
      </div>
    </div>
  );
};

export default Reset;