import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap fixed-bottom justify-content-between align-items-center py-1 my-2 ">
      <div className="col-md-4 d-flex align-items-center">
        <a
          href="/"
          className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
        >
          <svg className="bi" width="30" height="24">
            <use xlinkHref="#bootstrap"></use>
          </svg>
        </a>
        <span className="MyName">Saket Kumar Jaiswal</span>
      </div>
    </footer>
  );
};

export default Footer;
