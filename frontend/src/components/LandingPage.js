import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Footer from "./Footer"; // Import Footer component

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="containerMain text-center flex-grow-1">
        <div className="jumbotron">
          <h1 className="display-4">Welcome to Real Time CollabTool</h1>
          <p className="lead">
            CollabTool is your ultimate platform for seamless real-time
            collaboration. Work together on documents, share ideas, and
            communicate effortlessly with your team.
          </p>
          <hr className="lead-2" />
          <p>
            Whether you're working on a team project or just need to organize
            your thoughts, CollabTool provides all the features you need to stay
            productive.
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary btn-lg me-3">
              Register
            </Link>
            <Link to="/login" className="btn btn-danger btn-lg">
              Login
            </Link>
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer component */}
    </div>
  );
};

export default LandingPage;
