import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import {
  useParams,
  useLocation,
} from "react-router-dom";

const PaymentSuccess = () => {
  const { state, dispatch } = useContext(UserContext);
  let location = useLocation();

  function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  useEffect(() => {
      console.log(state)
    if (state) {
      const paymentId = getParameterByName("paymentId", location.search);
      const PayerID = getParameterByName("PayerID", location.search);
      fetch(`/success/${state._id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          PayerID,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            console.log(result);
          } else {
            console.log(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state]);

  return (
  

<div className="card center" style={{direction:"rtl", textAlign: "center", margin: "0 auto", float: "none", marginBottom: "10px"}}>
    <div className="col s12 m5">
      <div className="card-panel">
        <span className="white-text">
        <h4 className="light-green-text" >התשלום בוצע בהצלחה</h4>
        <p className="black-text">תודה לך!
התשלום בוצע בהצלחה!

</p>
<img style={{width: "10%"}} data-src="/images/payment/success.gif" src="https://fcs3pub.s3.amazonaws.com/photo-book/images/payment/success.gif"></img>
        </span>
      </div>
    </div>
  </div>


  );
};

export default PaymentSuccess;
