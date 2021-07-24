import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
const { categories } = require('../../globals')

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loader, setLoader] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
          price,
          category,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
          } else {
            M.toast({
              html: "המוצר הועלה בהצלחה",
              classes: "#689f38 light-green darken-2",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetail = () => {
    setLoader("indeterminate");
    const data = new FormData();
    data.append("file", image);
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-file"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
        direction: "rtl",
      }}
    >
      <input
        type="text"
        placeholder="שם המוצר"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="תאור המוצר"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        type="number"
        placeholder="מחיר"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <div dir="rtl" className="input-field col s20 m6">
        <select
        className="right"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((option) => (
              <option value={categories.value}>{option.label}</option>
            ))}
        </select>
      </div>
      <div className="file-field input-field">
        <div className="btn blue darken-1">
          <span>
            <i className="material-icons">add_a_photo</i>
          </span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect blue darken-1"
        onClick={() => postDetail()}
      >
        אישור מוצר
      </button>
      <div className="progress" style={{ margin: "4% auto" }}>
        <div className={loader}></div>
      </div>
    </div>
  );
};

export default CreatePost;
