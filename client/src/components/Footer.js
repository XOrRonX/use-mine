import React from "react";

const Footer = () => {
    return (
        <footer className="page-footer blue-grey darken-1">
            <div className="container">
                <div className="row">
                <div className="col l6 s12">
                    <h5 className="white-text">Use Mine</h5>
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
                © 2020 use mine
                </div>
            </div>
            </footer>
    );
};

export default Footer;