import React, { useState } from "react"
import {useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'

const NewPassword = () => {
  const history = useHistory()
  const [password, setPassword] = useState("");
  const {token} = useParams()
  console.log(token)

  const PostData = () =>{
    fetch("/new-password",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
        
      },
      body:JSON.stringify({
        password,
        token
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
        <h2>Use Mine!</h2>
        <input type="password" placeholder="הכנס סיסמא חדשה" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button style={{margin:"10px"}} className="btn waves-effect  light-blue darken-4" onClick={()=>PostData()}>עדכן סיסמא</button>
      </div>
    </div>
  );
};

export default NewPassword;