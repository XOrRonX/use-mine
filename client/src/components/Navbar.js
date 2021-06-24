import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const NavBar = () => {
  const searchModel = useRef(null);
  const [search, setSearch] = useState("");
  const [darkToggle, setDarkToggle] = useState("");
  const [postDetails, setPostDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    setDarkToggle('brightness_4');
    let sidenav = document.querySelector(".sidenav");
    M.Sidenav.init(sidenav, {});
    M.Modal.init(searchModel.current);
  }, []);

  const darkMode = () => {
    if (darkToggle === 'brightness_4') {
      setDarkToggle('brightness_high');
    } else {
      setDarkToggle('brightness_4');
    }
    localStorage.setItem(
      "mode",
      (localStorage.getItem("mode") || "dark") === "dark" ? "light" : "dark"
    );
    localStorage.getItem("mode") === "dark"
      ? document.querySelector("body").classList.add("dark")
      : document.querySelector("body").classList.remove("dark");
  };

  const renderList = () => {
    if (state) {
      return [
        <li  key={1}>
          <Link to="/profile">אזור אישי</Link>
        </li>,
        <li  key={2}>
          <Link to="" data-target="modal1" className="modal-trigger">
            חפש מוצר
          </Link>
        </li>,
        <li  key={3}>
          <Link to="/create">פרסם מוצר</Link>
        </li>,
        <li  key={4}>
          <Link to="/reset">איפוס סיסמא</Link>
        </li>,
        <li  key={5}>
        <Link to="/terms">תקנון</Link>
      </li>,
        <li  key={6}>
          <button
            className="btn waves-effect"
            
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            התנתק
          </button>
        </li>,
        <li>
          
          <a
            id="dark-toggle"
            class="btn dark-toggle"
            onClick={() => {
              darkMode();
            }}
            title="Dark/light"
          >
            <i class="material-icons left">{darkToggle}</i>Dark Mode</a>
        </li>,
      ];
    } else {
      return [
        <li key={4}>
          <Link to="/signin">כניסה לחשבון</Link>
        </li>,
        <li key={5}>
          <Link to="/signup">הירשם</Link>
        </li>,
        <li>
          
        <a
          id="dark-toggle"
          class="btn dark-toggle"
          onClick={() => {
            darkMode();
          }}
          title="Dark/light"
        >
          <i class="material-icons left">{darkToggle}</i>Dark Mode</a>
      </li>
      ];
    }
  };

  const fetchPosts = (query) => {
    setSearch(query);
    fetch("/search-post", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPostDetails(result.post);
        console.log(result);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper blue-grey  lighten-1">
        <Link
          to={state ? "/" : "/signin"}
          className="brand-logo right"
          style={{ marginRight: "3%" }}
        >
          <img style={{width:"70px"}} src="https://res.cloudinary.com/dyiceswks/image/upload/v1618057929/UseMine_znnhow.png" alt="_blank" ></img>
        </Link>
        <a href="#" className="sidenav-trigger" data-target="mobile-links">
          <i className="material-icons">menu</i>
        </a>
        <ul id="nav-mobile" className="left hide-on-med-and-down">
          {renderList()}
        </ul>
        <ul id="mobile-links" className="sidenav">
          {renderList()}
        </ul>
      </div>

      <div
        id="modal1"
        className="modal"
        ref={searchModel}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="חפש מוצר"
            value={search}
            onChange={(e) => fetchPosts(e.target.value)}
          />
          <div className="collection">
            {postDetails.map((item) => {
              return (
                <Link
                  key={item._id}
                  className="collection-items"
                  to={"/profile/" + item.postedBy}
                >
                  <img
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "0px",
                      margin: "7px",
                    }}
                    src={item.photo}
                    alt=""
                    className="circle"
                  />
                  <a href="#!" className="collection-item">
                    {item.title}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            סגור
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
