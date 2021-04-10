import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [cart, setCart] = useState([]);
  const [loader, setLoader] = useState("");
  let [sum, setSum] = useState(Number);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    setSum(0);
    var elems = document.querySelector("#collapsible");
    M.Collapsible.init(elems, {});
    var elem = document.querySelector(".tabs");
    M.Tabs.init(elem, {});

    fetch("/mypost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    fetch("/mycart", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        var total = 0;
        result.cart.map((item) => {
          total += item ? item.price : 0;
        });
        setSum(total);
        setCart(result.cart);
      });
  }, []);

  const removeItem = (item) => {
    fetch(`/removeitem/${state._id}`, {
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
            html: "המוצר הוסר מעגלת המוצרים",
            classes: "#689f38 light-green darken-2",
          });
          const newCart = cart.filter((item) => {
            return item._id !== data;
          });
          setCart(newCart);
          var total = 0;
          newCart.map((item) => {
            total += item.price;
          });
          setSum(total);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pay = () => {
    setLoader("indeterminate");
    fetch(`/pay/${state._id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status === "Success") {
          window.location = result.redirect;
        } else {
          console.log(result);
        }
        setLoader("determinate");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mern-stack-project");
    data.append("cloud_name", "dyiceswks");
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const cloudinaryURL =
      "https://api.cloudinary.com/v1_1/dyiceswks/image/upload";
    fetch(cloudinaryURL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        fetch("/updatephoto", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            photo: data.url,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            localStorage.setItem(
              "user",
              JSON.stringify({ ...state, photo: result.photo })
            );
            dispatch({ type: "UPDATEPHOTO", payload: result.photo });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <form action="#">
            <div className="file-field input-field add-profile-image">
              <div className="btn-floating">
                <i className="material-icons">add</i>
                <input
                  type="file"
                  onChange={(e) => uploadImage(e.target.files[0])}
                />
              </div>
            </div>
          </form>
          <img
            style={{ width: "180px", height: "180px", borderRadius: "90px" }}
            src={
              state
                ? state.photo
                : "https://www.regionalsan.com/sites/main/files/imagecache/lightbox/main-images/vacant_placeholder.gif"
            }
            alt="_blank"
          />
        </div>
        <div>
          <h5>{state ? state.name : "loading"}</h5>
          <a style={{margin: "7px"}} target="_blank" href={`https://wa.me/${state ? state.phone : ""}?text=Hi%20How's%20it%20going?`}><i class="fab fa-whatsapp fa-2x"></i></a>
          <a style={{margin: "7px"}} target="_blank" href="#"><i class="fab fa-facebook-square fa-2x"></i></a>
          <a style={{margin: "7px"}} target="_blank" href="#"><i class="fab fa-facebook-messenger fa-2x"></i></a>
          <div
           style={{
            display: "flex",
            justifyContent: "space-between",
            width: "108%",
          }}
          >
          <h6>{mypics.length} פוסטים</h6>
          <h6>
            {state ? (state.rating ? state.rating.length : "0") : "0"} דירוג
          </h6>
          </div>
        </div>
      </div>

      <ul id="tabs-swipe-demo" className="tabs tabs-fixed-width">
        <li className="tab col s3">
          <a className="active" href="#test-swipe-1">
            המוצרים שלי
          </a>
        </li>
        <li className="tab col s3">
          <a href="#test-swipe-2">סל מוצרים</a>
        </li>
      </ul>
      <div id="test-swipe-1" className="col s12">
        <div className="gallery">
          {mypics.map((item) => {
            return (
              <div key={item._id} className="card profile hoverable">
                <div className="card-image waves-effect waves-block waves-light">
                  <img
                    className="activator"
                    src={item.photo}
                    alt={item.title}
                  />
                </div>
                <div className="card-content">
                  <span className="card-title activator">
                    {item.title}
                    <i className="material-icons right">more_vert</i>
                  </span>
                  <p>
                    <a href={item.photo}>photo</a>
                  </p>
                </div>
                <div className="card-reveal">
                  <span className="card-title">
                    {item.title}
                    <i className="material-icons right">close</i>
                  </span>
                  <p>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div id="test-swipe-2" className="col s12">
        <div id="cardPanel" className="card-panel right black-text">
          <div id="collapsible" className="collapsible-header right ">
            <i className="material-icons">shopping_cart</i>
            סל מוצרים
            <span className="new badge green">{cart.length}</span>
          </div>
          <table className="centered">
            <thead>
              <tr>
                <th>מחיר</th>
                <th>שם המוצר</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                return (
                  <tr key={cart.id}>
                    <td>₪{item ? item.price : 0}</td>
                    <td>{item ? item.title : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ direction: "rtl" }}>
            סה"כ לתשלום: ₪{sum}
            <br />
          </p>
          <div className={loader === "determinate" ? "" : "progress"}>
            <div className={loader}></div>
          </div>
          <button
            className="btn waves-effect  light-blue darken-4"
            onClick={() => pay()}
          >
            מעבר לתשלום
          </button>
        </div>
        <div className="gallery">
          {cart.map((item) => {
            if (item) {
              sum += item.price;
              return (
                <div className="card profile hoverable">
                  <a class="btn-floating halfway-fab waves-effect waves-light red absolute">
                    <i
                      class="material-icons"
                      onClick={() => {
                        removeItem(item);
                      }}
                    >
                      remove
                    </i>
                  </a>
                  <div className="card-image waves-effect waves-block waves-light">
                    <img
                      className="activator"
                      src={item.photo}
                      alt={item.title}
                    />
                  </div>
                  <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">
                      {item.title}
                      <i className="material-icons right">more_vert</i>
                    </span>
                    <p>
                      <a href={item.photo}>photo</a>
                    </p>
                    <h6 style={{ float: "left" }}>
                      ₪{item.price ? item.price : 0}
                    </h6>
                  </div>
                  <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">
                      {item.title}
                      <i className="material-icons right">close</i>
                    </span>
                    <p>{item.body}</p>
                  </div>
                </div>
              );
            } else {
              return "";
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
