import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { MANUAL_DATA } from "../data/manualdata";
import {
  COMMENT_DATA,
  getCommentsByManualId,
  addComment,
  addReply,
  likeComment,
} from "../data/commentdata";
import { USER_DATA, getUserById } from "../data/userdata";
import "./css/manualdetail.css";

const ManualDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manual, setManual] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState({ content: "", rating: 5 });
  const [replyToComment, setReplyToComment] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [newManual, setNewManual] = useState({
    title: "",
    description: "",
    category: "Programming",
    tags: "",
    fileSize: "",
    pages: "",
  });

  useEffect(() => {
    // Get current user from localStorage (simulated login)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    // Find manual by ID
    const foundManual = MANUAL_DATA.find((m) => m.id === parseInt(id));
    if (foundManual) {
      setManual(foundManual);
      // Increment view count
      foundManual.views += 1;
    } else {
      navigate("/feeds");
    }

    // Load comments
    const manualComments = getCommentsByManualId(id);
    setComments(manualComments);
  }, [id, navigate]);

  const handleCreateManual = () => {
    if (!currentUser) {
      alert("Please login to create a manual");
      return;
    }
    setShowCreateModal(true);
  };

  const handleSubmitManual = () => {
    if (!newManual.title || !newManual.description) {
      alert("Please fill in all required fields");
      return;
    }

    const manualData = {
      ...newManual,
      id:
        MANUAL_DATA.length > 0
          ? Math.max(...MANUAL_DATA.map((m) => m.id)) + 1
          : 1,
      thumbnail:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      views: 0,
      likes: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name:
          currentUser.username ||
          `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
        avatar:
          currentUser.avatar || "https://via.placeholder.com/40x40?text=U",
        role: currentUser.role,
      },
      tags: newManual.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    MANUAL_DATA.push(manualData);
    setShowCreateModal(false);
    setNewManual({
      title: "",
      description: "",
      category: "Programming",
      tags: "",
      fileSize: "",
      pages: "",
    });
    alert("Manual created successfully!");
  };

  const handleAddComment = () => {
    if (!currentUser) {
      alert("Please login to add a comment");
      return;
    }

    if (!newComment.content.trim()) {
      alert("Please enter a comment");
      return;
    }

    const commentData = {
      manualId: parseInt(id),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      content: newComment.content,
      rating: newComment.rating,
    };

    addComment(commentData);
    setComments(getCommentsByManualId(id));
    setNewComment({ content: "", rating: 5 });
    setShowCommentModal(false);
  };

  const handleAddReply = (commentId) => {
    if (!replyContent.trim()) {
      alert("Please enter a reply");
      return;
    }

    const replyData = {
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      content: replyContent,
    };

    addReply(commentId, replyData);
    setComments(getCommentsByManualId(id));
    setReplyContent("");
    setReplyToComment(null);
  };

  const handleLikeComment = (commentId) => {
    likeComment(commentId);
    setComments(getCommentsByManualId(id));
  };

  const handleDownload = () => {
    if (!currentUser) {
      alert("Please login to download");
      return;
    }
    manual.downloads += 1;
    alert("Download started! (This is a demo)");
  };

  const handleLike = () => {
    if (!currentUser) {
      alert("Please login to like");
      return;
    }
    manual.likes += 1;
    setManual({ ...manual });
  };

  if (!manual) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="manual-detail-container">
      <div className="manual-header">
        <div className="manual-thumbnail-large">
          <img src={manual.thumbnail} alt={manual.title} />
          <div className="manual-category-badge">{manual.category}</div>
        </div>

        <div className="manual-info">
          <h1 className="manual-title">{manual.title}</h1>
          <p className="manual-description">{manual.description}</p>

          <div className="manual-meta">
            <div className="meta-item">
              <i className="bi bi-eye"></i>
              <span>{manual.views} views</span>
            </div>
            <div className="meta-item">
              <i className="bi bi-download"></i>
              <span>{manual.downloads} downloads</span>
            </div>
            <div className="meta-item">
              <i className="bi bi-heart"></i>
              <span>{manual.likes} likes</span>
            </div>
            <div className="meta-item">
              <i className="bi bi-file-text"></i>
              <span>{manual.pages} pages</span>
            </div>
            <div className="meta-item">
              <i className="bi bi-hdd"></i>
              <span>{manual.fileSize}</span>
            </div>
          </div>

          <div className="manual-tags">
            {manual.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="manual-actions">
            <Button variant="primary" onClick={handleDownload}>
              <i className="bi bi-download"></i> Download
            </Button>
            <Button variant="outline-primary" onClick={handleLike}>
              <i className="bi bi-heart"></i> Like
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowCommentModal(true)}
            >
              <i className="bi bi-chat"></i> Comment
            </Button>
            {currentUser && currentUser.role === "admin" && (
              <Button variant="success" onClick={handleCreateManual}>
                <i className="bi bi-plus"></i> Create Manual
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="manual-author-section">
        <div className="author-info">
          <img
            src={
              manual.author.avatar || "https://via.placeholder.com/80x80?text=U"
            }
            alt={manual.author.name}
            className="author-avatar-large"
          />
          <div>
            <h3>{manual.author.name}</h3>
            <p>{manual.author.role}</p>
            <small>
              Published {new Date(manual.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments & Reviews ({comments.length})</h2>

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <img
                src={comment.userAvatar}
                alt={comment.username}
                className="comment-avatar"
              />
              <div className="comment-user-info">
                <h4>{comment.username}</h4>
                <div className="comment-rating">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi bi-star${
                        i < comment.rating ? "-fill" : ""
                      }`}
                    ></i>
                  ))}
                </div>
                <small>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="comment-actions">
                <button
                  className="like-btn"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <i className="bi bi-heart"></i> {comment.likes}
                </button>
              </div>
            </div>

            <div className="comment-content">
              <p>{comment.content}</p>
            </div>

            {comment.replies.length > 0 && (
              <div className="comment-replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <img
                      src={reply.userAvatar}
                      alt={reply.username}
                      className="reply-avatar"
                    />
                    <div className="reply-content">
                      <h5>{reply.username}</h5>
                      <p>{reply.content}</p>
                      <small>
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="reply-btn"
              onClick={() => setReplyToComment(comment.id)}
            >
              Reply
            </button>

            {replyToComment === comment.id && (
              <div className="reply-form">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="reply-actions">
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyToComment(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="no-comments">
            <p>No comments yet. Be the first to review this manual!</p>
          </div>
        )}
      </div>

      {/* Create Manual Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Manual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={newManual.title}
                onChange={(e) =>
                  setNewManual({ ...newManual, title: e.target.value })
                }
                placeholder="Enter manual title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newManual.description}
                onChange={(e) =>
                  setNewManual({ ...newManual, description: e.target.value })
                }
                placeholder="Enter manual description"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newManual.category}
                    onChange={(e) =>
                      setNewManual({ ...newManual, category: e.target.value })
                    }
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Security">Security</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>File Size</Form.Label>
                  <Form.Control
                    type="text"
                    value={newManual.fileSize}
                    onChange={(e) =>
                      setNewManual({ ...newManual, fileSize: e.target.value })
                    }
                    placeholder="e.g., 2.4 MB"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Pages</Form.Label>
                  <Form.Control
                    type="number"
                    value={newManual.pages}
                    onChange={(e) =>
                      setNewManual({ ...newManual, pages: e.target.value })
                    }
                    placeholder="Number of pages"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={newManual.tags}
                    onChange={(e) =>
                      setNewManual({ ...newManual, tags: e.target.value })
                    }
                    placeholder="Comma-separated tags"
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitManual}>
            Create Manual
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Comment Modal */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi bi-star${
                      star <= newComment.rating ? "-fill" : ""
                    } star-rating`}
                    onClick={() =>
                      setNewComment({ ...newComment, rating: star })
                    }
                  ></i>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newComment.content}
                onChange={(e) =>
                  setNewComment({ ...newComment, content: e.target.value })
                }
                placeholder="Write your review..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCommentModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddComment}>
            Add Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManualDetail;
