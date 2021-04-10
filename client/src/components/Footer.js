import React from "react";

const Footer = () => {
    return (
        <footer className="page-footer blue-grey lighten-1">
            <div className="container">
                <div className="row">
                <div className="col l6 s12">
                    <img style={{width:"120px"}} src="https://res.cloudinary.com/dyiceswks/image/upload/v1618057929/UseMine_znnhow.png" alt="_blank" ></img>
                    <p className="grey-text text-lighten-4">אתר זה נבנה בטכנולוגיית MERN STACK בשימוש ב MATIRIALIZE </p>
                </div>
                <div className="col l4 offset-l2 s12">
                    <h5 className="white-text">קישור לאתר המכללה</h5>
                    <ul>
                    <li><a className="grey-text text-lighten-3" href="https://www.hac.ac.il/">אתר המכללה</a></li>
                    </ul>
                </div>
                </div>
            </div>
            <div className="footer-copyright center">
                <div className="container">
                © 2020 UseMine
                </div>
            </div>
            </footer>
    );
};

export default Footer;