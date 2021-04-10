import React, { useState, useContext } from "react"
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = () => {
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "invalid email", classes:"#b71c1c red darken-4"})
      return
    }
    fetch("/signin",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
        
      },
      body:JSON.stringify({
        password,
        email
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html: data.error, classes:"#b71c1c red darken-4"})
      } else {
        localStorage.setItem("jwt",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        dispatch({type:"USER",payload:data.user})
        M.toast({html:"תהליך האימות בוצע בהצלחה", classes:"#689f38 light-green darken-2"})
        history.push('/')
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
        <input type="password" placeholder="סיסמא" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button className="btn waves-effect  light-blue darken-4" onClick={()=>PostData()}>היכנס לחשבון</button>
        <h5>
            <Link to="/signup" style={{color:" light-blue darken-4"}}>עוד לא נרשמת?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
