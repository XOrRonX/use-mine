import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
const { categories } = require('../../globals')

const Home = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [loader, setLoader] = useState("");
  const { state } = useContext(UserContext);
  const [category, setCategory] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setLoader("indeterminate");
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    category.push("מוצרי חשמל")
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
        console.log(result.posts);
        setLoader("determinate");
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  const clickOnImage = (id) => {
    var elem = document.getElementById(id);
    var instance = M.Materialbox.init(elem, {});
    instance.open();
  };

  const isItemFiltered = (val) => {
    return category.some(item => val.category === item);
  };

  const addProduct = (item) => {
    fetch(`/addproduct/${state._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        item,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "המוצר נוסף לעגלת המוצרים",
            classes: "#689f38 light-green darken-2",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  return (
    <div>
      <div className={loader === "determinate" ? "" : "progress"}>
        <div className={loader}></div>
      </div>
      <div dir="rtl" className="input-field col s20 m6 right">
        <select multiple
        className="right"
        value={category}
        onChange={(e) => setCategory(Array.from(e.target.selectedOptions, option => option.value))}
        >
          {categories.map((option) => (
              <option value={categories.value}>{option.label}</option>
            ))}
        </select>
      </div>
      <div className="home">
        {data.map((item) => {
          return item && isItemFiltered(item) ? (
            <div className="card home-card z-depth-5" key={item._id}>
              <div className="cart-title">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    margin: "7px",
                  }}
                  src={item.postedBy ? item.postedBy.photo : ""}
                  alt=""
                  className="circle"
                />
                <h5>
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile/"
                    }
                  >
                    {item.postedBy.name}
                  </Link>{" "}
                </h5>
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{ float: "left", marginRight: "100px" }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </div>
              <div className="card-image">
                <img
                  id={item._id}
                  className="materialboxed"
                  src={item.photo}
                  alt="_blank"
                  onClick={() => {
                    clickOnImage(item._id);
                  }}
                />
              </div>
              <div className="card-content">
                <h5 style={{ float: "left" }}>
                  ₪{item.price ? item.price : 0}
                </h5>
                <span
                  className={
                    item.status === "זמין" ? "new badge green" : "new badge red"
                  }
                  data-badge-caption={item.status}
                ></span>
                <i className="material-icons">favorite</i>
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => {
                      likePost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                )}
                <h6> {item.likes.length} likes</h6>
                <p>{item.title}</p>
                <p>{item.category}</p>
                {item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy ? record.postedBy.name : "משתמש לא קיים"}
                      </span>{" "}
                      {record.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <i className="material-icons prefix">textsms</i>
                  <input type="text" placeholder="הוסף תגובה" />
                </form>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addProduct(item);
                  }}
                >
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    name="action"
                  >
                    הוסף מוצר
                    <i className="material-icons left">add</i>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            ""
          );
        })}
      </div>
    </div>
  );
};

export default Home;
