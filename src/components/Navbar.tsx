import React from "react";
import "../assets/css/Navbar.css";
import logo from "../assets/images/pomodoro.png";

const Navbar: React.FC = () => {
  const logoStyle = {
    width: "30px",
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-icon">
          <img src={logo} alt="logo" style={logoStyle}/>
        </span>
        <span className="navbar-title">PomoTimer</span>
      </div>
      <div className="navbar-right">
        {/* Add additional navigation items or components here */}
      </div>
    </nav>
  );
};

export default Navbar;