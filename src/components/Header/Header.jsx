import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="jobhax-logo-container">
          <Link  to="/">
            <div className="jobhax-logo"></div>
          </Link>
        </div>
        <div className="search-box" >
          <img className="header-icon search-icon" src="../../src/assets/icons/SearchIcon@3x.png"></img>
          <div contenteditable="true" className="search-input" id="query"></div>
        </div>
        <div className="header-icon general">
          <Link to="/dashboard">
            <img src="../../src/assets/icons/SyncIcon@3x.png"></img>
          </Link>
        </div>
        <div className="header-icon general">
          <Link to="/modal">
            <img src="../../src/assets/icons/StatsIcon@3x.png"></img>
          </Link>
        </div>
        <div className="header-icon general">
          <Link to="/test1">
            <img src="../../src/assets/icons/NotifIcon@3x.png"></img>
          </Link>
        </div>
        <div className="header-icon user-icon">
          <Link to="/test1/">
            <img src="../../src/assets/icons/SeyfoIcon@3x.png"></img>
          </Link>
        </div>
      </div>
  );
  }
  }

  export default Header;