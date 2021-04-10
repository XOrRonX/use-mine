import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import M from "materialize-css";
/**
 * Profile component
 * 
 * @returns Profile
 */
const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showRate, setShowRate] = useState(
    state ? (state.myRating ? !state.myRating.includes(userid) : true) : true
  );

  useEffect(() => {
    var elems = document.querySelector("#collapsible");
    M.Collapsible.init(elems, {});
    var elem = document.querySelector(".tabs");
    M.Tabs.init(elem, {});

    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);

  const rateUser = () => {
    fetch("/rate", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        rateid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { myRating: data.myRating, rating: data.rating },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              rating: [...prevState.user.rating, data._id],
            },
          };
        });
        setShowRate(false);
        console.log(data);
      });
  };

  const unRateUser = () => {
    fetch("/unrate", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unrateid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { myRating: data.myRating, rating: data.rating },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newRater = prevState.user.rating.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              rating: newRater,
            },
          };
        });
        console.log(data);
      });
  };

  return (
    <>
      {
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
              <img
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "90px",
                }}
                src={
                  userProfile
                    ? userProfile.user.photo
                    : "https://www.regionalsan.com/sites/main/files/imagecache/lightbox/main-images/vacant_placeholder.gif"
                }
                alt="_blank"
              />
            </div>
            <div>
              <h5>{userProfile ? userProfile.user.name : ""}</h5>
              <a style={{margin: "7px"}} target="_blank" href={`https://wa.me/${userProfile ? userProfile.user.phone : ""}?text=Hi%20How's%20it%20going?`}><i class="fab fa-whatsapp-square fa-2x"></i></a>
              <a style={{margin: "7px"}} target="_blank" href="#"><i class="fab fa-facebook-square fa-2x"></i></a>
              <a style={{margin: "7px"}} target="_blank" href="#"><i class="fab fa-facebook-messenger fa-2x"></i></a>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile ? userProfile.posts.length : "0"} פוסטים</h6>
                <h6>
                  {userProfile ? userProfile.user.rating.length : ""} דירוג
                </h6>
              </div>
              {showRate ? (
                <button
                  style={{ margin: "5px" }}
                  className="btn waves-effect  light-blue darken-4"
                  onClick={() => rateUser()}
                >
                  דרג אותי
                </button>
              ) : (
                <button
                  style={{ margin: "5px" }}
                  className="btn waves-effect  light-blue darken-4"
                  onClick={() => unRateUser()}
                >
                  הסר דירוג
                </button>
              )}
              
            </div>
          </div>

          <ul id="tabs-swipe-demo" className="tabs tabs-fixed-width">
            <li className="tab col s3">
              <a className="active" href="#test-swipe-1">
                מוצרים
              </a>
            </li>
            <li className="tab col s3">
              <a href="#test-swipe-2">ביקורות</a>
            </li>
          </ul>
          <div id="test-swipe-1" className="col s12">
            <div className="gallery">
              {userProfile
                ? userProfile.posts.map((item) => {
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
                          <span className="card-title activator grey-text text-darken-4">
                            {item.title}
                            <i className="material-icons right">more_vert</i>
                          </span>
                          <p>
                            <a href={item.photo}>photo</a>
                          </p>
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
                  })
                : ""}
            </div>
          </div>
          <div
            id="test-swipe-2"
            className="col s12"
            style={{ direction: "rtl" }}
          >
            <div className="row">
              <form className="col s12">
                <div className="row">
                  <div className="input-field col s6 right">
                    <i className="material-icons prefix">mode_edit</i>
                    <textarea
                      id="icon_prefix2"
                      className="materialize-textarea"
                    ></textarea>
                    <label htmlFor="icon_prefix2">כתוב ביקורת</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Profile;
