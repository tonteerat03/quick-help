import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { addManual } from "../data/manualdata";
import "./css/createmanual.css";

const CreateManual = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [newManual, setNewManual] = useState({
    title: "",
    description: "",
    category: "Programming",
    tags: "",
    fileSize: "",
    pages: "",
  });
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const handleSubmitManual = (e) => {
    e.preventDefault();
    setAlertMessage({ type: "", text: "" });

    if (!newManual.title || !newManual.description) {
      setAlertMessage({
        type: "danger",
        text: "Please fill in all required fields (Title and Description)",
      });
      return;
    }

    const manualData = {
      ...newManual,
      thumbnail:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      author: {
        id: currentUser.id,
        name:
          currentUser.username ||
          `${currentUser.firstName} ${currentUser.lastName}`,
        avatar: currentUser.avatar,
        role: currentUser.role,
      },
      tags: newManual.tags
        ? newManual.tags.split(",").map((tag) => tag.trim())
        : [],
      pages: parseInt(newManual.pages) || 0,
      status: currentUser.role === "admin" ? "approved" : "pending",
    };

    addManual(manualData);

    if (currentUser.role === "admin") {
      setAlertMessage({
        type: "success",
        text: "Manual created and published successfully!",
      });
    } else {
      setAlertMessage({
        type: "success",
        text: "Manual submitted for admin approval!",
      });
    }

    // Reset form
    setNewManual({
      title: "",
      description: "",
      category: "Programming",
      tags: "",
      fileSize: "",
      pages: "",
    });

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/feeds");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/feeds");
  };

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="create-manual-container">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="create-manual-card">
              <Card.Header>
                <h2 className="create-manual-title">Create New Manual</h2>
                <p className="create-manual-subtitle">
                  {currentUser.role === "admin"
                    ? "Your manual will be published immediately"
                    : "Your manual will be submitted for admin approval"}
                </p>
              </Card.Header>
              <Card.Body>
                {alertMessage.text && (
                  <Alert variant={alertMessage.type} className="mb-4">
                    {alertMessage.text}
                  </Alert>
                )}{" "}
                <Form onSubmit={handleSubmitManual}>
                  {/* Title Field */}
                  <div className="form-group">
                    <Form.Label>
                      Title <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={newManual.title}
                      onChange={(e) =>
                        setNewManual({ ...newManual, title: e.target.value })
                      }
                      placeholder="Your answer"
                      className="form-input"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="form-group">
                    <Form.Label>
                      Description <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newManual.description}
                      onChange={(e) =>
                        setNewManual({
                          ...newManual,
                          description: e.target.value,
                        })
                      }
                      placeholder="Your answer"
                      className="form-input"
                    />
                    <div className="form-helper">
                      Provide a clear and detailed description of the manual
                    </div>
                  </div>

                  {/* Category Field */}
                  <div className="form-group">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={newManual.category}
                      onChange={(e) =>
                        setNewManual({
                          ...newManual,
                          category: e.target.value,
                        })
                      }
                      className="form-input"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Management">Management</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Security">Security</option>
                    </Form.Select>
                    <div className="form-helper">
                      Choose the most relevant category
                    </div>
                  </div>

                  {/* File Size and Pages Row */}
                  <div className="form-row">
                    <div className="form-col">
                      <Form.Label>File Size</Form.Label>
                      <Form.Control
                        type="text"
                        value={newManual.fileSize}
                        onChange={(e) =>
                          setNewManual({
                            ...newManual,
                            fileSize: e.target.value,
                          })
                        }
                        placeholder="e.g., 2.4 MB"
                        className="form-input"
                      />
                      <div className="form-helper">Optional</div>
                    </div>
                    <div className="form-col">
                      <Form.Label>Number of Pages</Form.Label>
                      <Form.Control
                        type="number"
                        value={newManual.pages}
                        onChange={(e) =>
                          setNewManual({
                            ...newManual,
                            pages: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="form-input"
                      />
                      <div className="form-helper">Optional</div>
                    </div>
                  </div>

                  {/* Tags Field */}
                  <div className="form-group">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      value={newManual.tags}
                      onChange={(e) =>
                        setNewManual({ ...newManual, tags: e.target.value })
                      }
                      placeholder="tag1, tag2, tag3"
                      className="form-input"
                    />
                    <div className="form-helper">
                      Add tags separated by commas to help others find your
                      manual
                    </div>
                  </div>

                  {/* Info Alert for Non-Admin Users */}
                  {currentUser && currentUser.role !== "admin" && (
                    <Alert variant="info">
                      <i className="bi bi-info-circle me-2"></i>
                      Your manual will be submitted for admin approval before it
                      appears in the feeds.
                    </Alert>
                  )}

                  <div className="form-actions">
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      className="cancel-btn"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      className="submit-btn"
                    >
                      {currentUser && currentUser.role === "admin"
                        ? "Create & Publish"
                        : "Submit for Approval"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateManual;
