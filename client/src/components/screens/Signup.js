import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import isIsraeliIdValid from 'israeli-id-validator';

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPhoto = () => {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "mern-stack-project");
    data.append("cloud_name", "dyiceswks");
    const cloudinaryURL =
      "https://api.cloudinary.com/v1_1/dyiceswks/image/upload";
    fetch(cloudinaryURL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {

    if (!name) {
      M.toast({ html: " שם משתמש לא תקין", classes: "#b71c1c red darken-4" });
      return;
    }

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "כתובת המייל אינה תקינה", classes: "#b71c1c red darken-4" });
      return;
    }

    if (!password) {
      M.toast({ html: "סיסמא לא תקינה", classes: "#b71c1c red darken-4" });
      return;
    }

    if (!phone) {
      M.toast({ html: "מספר פלאפון לא תקין", classes: "#b71c1c red darken-4" });
      return;
    }

    if (!isIsraeliIdValid(id) || !id){
      M.toast({ html: "מספר זהות לא תקין", classes: "#b71c1c red darken-4" });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        photo: url,
        phone: "+972" + parseInt(phone, 10),
        id
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: data.message,
            classes: "#689f38 light-green darken-2",
          });
          history.push("./signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    if (photo) {
      uploadPhoto();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card ">
      <img style={{width:"150px"}} src="https://res.cloudinary.com/dyiceswks/image/upload/v1618057929/UseMine_znnhow.png" alt="_blank" ></img>
        <input
          type="text"
          placeholder="שם מלא"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמא"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="tel"
          placeholder="טלפון נייד"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          class="validate"
        />
        <input
          type="tel"
          placeholder="מספר זהות"
          value={id}
          onChange={(e) => setId(e.target.value)}
          class="validate"
        />
        <div className="file-field input-field">
          <div className="btn blue darken-1">
            <span>
              <i className="material-icons">add_a_photo</i>
            </span>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect  light-blue darken-4"
          onClick={() => PostData()}
        >
          הירשם
        </button>
        <h5>
          <Link to="/signin">יש לך כבר חשבון קיים?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
