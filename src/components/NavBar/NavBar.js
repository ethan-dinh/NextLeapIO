import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

import "./NavBar.css";
import NotificationIcon from "./icons/notification.png";
import Avatar from "../ProfilePage/images/default-avatar.png";
import logoutIcon from "./icons/logout.png";
import searchIcon from "./icons/search.png";

import { UserContext } from "../context/UserContext";

function NavBar() {
  const navigate = useNavigate();
  const { setUser, user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Fetch user data from the backend
    fetch("https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/getUsers.php")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    const fuse = new Fuse(users.users, {
      keys: ["fname", "lname"],
      threshold: 0.3,
    });

    const results = searchQuery.trim() === "" ? [] : fuse.search(searchQuery).map(result => result.item);

    // limit the number of search results to 8
    results.splice(8);

    setSearchResults(results);
  }, [searchQuery, users]);

  useEffect(() => {
    if (isSearchFocused) {
      document.body.classList.add("overlay-active");
      document.querySelector(".overlay").classList.add("overlay-active");
    } else {
      document.body.classList.remove("overlay-active");
    }
  }, [isSearchFocused]);

  const handleIconClick = (path) => {
    navigate(path);
  };

  const handleLogOut = () => {
    setUser(null);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (uid) => {
    setSearchQuery("");
    setSearchResults([]);

    // Add the search result to recent searches
    const user = users.users.find(user => user.uid === uid);
    setRecentSearches(prev => [user, ...prev.filter(u => u.uid !== uid)].slice(0, 5)); // Limit to 5 recent searches
    navigate(`/profile?uid=${uid}`);
  };

  return (
    <nav className="navbar">
      <div className="overlay"></div>

      <div className="logo">
        <div className="logo-text">NEXTLEAP.IO</div>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Start typing to search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {isSearchFocused && (
            <ul className="search-results">
              {searchQuery.trim() === "" && recentSearches.length > 0 ? (
                recentSearches.map(user => (
                  <li key={user.uid} onMouseDown={() => handleUserClick(user.uid)}>
                    <div className="search-result-item">
                      <img src={searchIcon} alt="search" id="search-icon" />
                      {user.fname} {user.lname}
                    </div>
                  </li>
                ))
              ) : (
                searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <li key={user.uid} onMouseDown={() => handleUserClick(user.uid)}>
                      <div className="search-result-item">
                        <img src={searchIcon} alt="search" id="search-icon" />
                        {user.fname} {user.lname}
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className="search-result-item">No results</div>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="interaction-field">
        <div className="nav-icons">
          <button
            onClick={() => handleIconClick("")}
            aria-label="Notifications"
            className="modern-button"
            id="notifications"
          >
            <span className="button-text">See Notifications</span>
            <img src={NotificationIcon} alt="Notifications" id="icon-notifications" />
          </button>

          <button className="modern-button" id="logout" onClick={handleLogOut}>
            <span className="button-text">Sign Out</span>
            <img src={logoutIcon} alt="logout" id="icon-logout" />
          </button>

          <button
            onClick={() => handleIconClick(`/profile?uid=${user.uid}`)}
            className="profile-pic"
            aria-label="Profile"
          >
            <img src={user.profilePicPath ? user.profilePicPath : Avatar} alt="Profile" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
