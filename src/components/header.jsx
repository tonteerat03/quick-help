import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/header.css";
import { Button, Dropdown } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);

    // Remove existing theme classes and add the correct one
    document.documentElement.classList.remove("dark-mode", "light-mode");
    if (shouldBeDark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }

    // Check for current user
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Remove existing theme classes and add the correct one
    document.documentElement.classList.remove("dark-mode", "light-mode");
    if (newDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }

    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="nav-container">
      <nav className="p-4 flex justify-between items-center">
        <Link to="/feeds" className="font-bold text-xl brand-link">
          Quick Help
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/feeds">Feeds</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {currentUser && currentUser.role === "admin" && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
          <li>
            <Button
              variant="outline-secondary"
              onClick={toggleDarkMode}
              className="theme-toggle"
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? "☀️" : "🌙"}
            </Button>
          </li>
          {currentUser ? (
            <li className="user-menu">
              <Dropdown>
                <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.firstName}
                    className="user-avatar-small"
                  />
                  <span>{currentUser.firstName}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
