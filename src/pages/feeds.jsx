import { Button } from "react-bootstrap";
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/feeds.css";
import { MANUAL_DATA } from "../data/manualdata";

const CATEGORY_OPTIONS = ["Most View", "Most Like", "Recent"];

const Feeds = () => {
  const [selectedCategory, setSelectedCategory] = useState("Most View");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const sortedFeeds = useMemo(() => {
    const feeds = [...MANUAL_DATA];
    if (selectedCategory === "Most View") {
      return feeds.sort((a, b) => b.views - a.views);
    }
    if (selectedCategory === "Most Like") {
      return feeds.sort((a, b) => b.likes - a.likes);
    }
    // Recent
    return feeds.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [selectedCategory]);

  const handleCardClick = (manualId) => {
    navigate(`/manual/${manualId}`);
  };

  const handleCreateManual = () => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate(`/login`);
      return;
    }
    const user = JSON.parse(stored);
    if (user.role !== "admin") {
      alert("Only admins can create manuals.");
      return;
    }
    // No dedicated create page exists; send admins to dashboard for now
    navigate(`/dashboard`);
  };

  return (
    <>
      <div className="home-container">
        <div className="feeds-header">
          <div className="feeds-categories">
            {CATEGORY_OPTIONS.map((label) => (
              <Button
                key={label}
                type="button"
                className={
                  "home-category-btn" +
                  (selectedCategory === label ? " selected" : "")
                }
                onClick={() => setSelectedCategory(label)}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button
            className="create-manual-btn"
            onClick={handleCreateManual}
            variant="primary"
          >
            + Create Manual
          </Button>
        </div>

        <div className="home-manuals-grid">
          {sortedFeeds.map((manual) => (
            <div
              key={manual.id}
              className="manual-card"
              onClick={() => handleCardClick(manual.id)}
            >
              <div className="manual-thumbnail">
                <img
                  src={manual.thumbnail}
                  alt={manual.title}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <div className="manual-category">{manual.category}</div>
              </div>

              <div className="manual-content">
                <h3 className="manual-title">{manual.title}</h3>
                <p className="manual-description">{manual.description}</p>

                <div className="manual-stats">
                  <span className="stat-item">
                    <i className="bi bi-eye"></i> {manual.views}
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-download"></i> {manual.downloads}
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-file-text"></i> {manual.pages} pages
                  </span>
                </div>
              </div>

              <div className="manual-footer">
                <div className="manual-author">
                  <img
                    src={manual.author.avatar}
                    alt={manual.author.name}
                    className="author-avatar"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/40x40?text=U";
                    }}
                  />
                  <div className="author-info">
                    <div className="author-name">{manual.author.name}</div>
                    <div className="author-role">{manual.author.role}</div>
                  </div>
                </div>

                <div className="manual-actions">
                  <button
                    className="like-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Liked manual ${manual.id}`);
                    }}
                  >
                    <i className="bi bi-heart"></i>
                    <span>{manual.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feeds;
