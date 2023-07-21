import React, { useState } from "react";
import "../assets/css/Home.css";
import Pomodoro from '../components/Pomodoro';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("tab1");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="home">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="square-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "tab1" ? "active" : ""}`}
            onClick={() => handleTabChange("tab1")}
          >
            Pomodoro
          </button>
          <button
            className={`tab ${activeTab === "tab2" ? "active" : ""}`}
            onClick={() => handleTabChange("tab2")}
          >
            Short Break
          </button>
        </div>
        <div className="content">
          {activeTab === "tab1" && <div><Pomodoro duration={25} /></div>}
          {activeTab === "tab2" && <div><Pomodoro duration={5} /></div>}
        </div>
      </div>
    </div>
  );
};

export default Home;