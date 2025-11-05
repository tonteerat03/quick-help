import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { getManualById, updateManual } from "../data/manualdata";
import "./css/editmanual.css";

const EditManual = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [manual, setManual] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Programming",
    tags: "",
    fileSize: "",
    pages: "",
  });
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);

    // Load manual data
    const manualData = getManualById(id);
    if (!manualData) {
      setAlertMessage({
        type: "danger",
        text: "Manual not found",
      });
      setLoading(false);
      setTimeout(() => navigate("/dashboard"), 2000);
      return;
    }

    // Check if user has permission to edit
    if (parsedUser.role !== "admin" && manualData.author.id !== parsedUser.id) {
      setAlertMessage({
        type: "danger",
        text: "You do not have permission to edit this manual",
      });
      setLoading(false);
      setTimeout(() => navigate("/feeds"), 2000);
      return;
    }

    setManual(manualData);
    setFormData({
      title: manualData.title,
      description: manualData.description,
      category: manualData.category,
      tags: manualData.tags.join(", "),
      fileSize: manualData.fileSize,
      pages: manualData.pages.toString(),
    });
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage({ type: "", text: "" });

    if (!formData.title || !formData.description) {
      setAlertMessage({
        type: "danger",
        text: "Please fill in all required fields (Title and Description)",
      });
      return;
    }

    const updatedData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [],
      fileSize: formData.fileSize,
      pages: parseInt(formData.pages) || 0,
    };

    updateManual(id, updatedData);

    setAlertMessage({
      type: "success",
      text: "Manual updated successfully!",
    });

    // Redirect after 2 seconds
    setTimeout(() => {
      if (currentUser.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/feeds");
      }
    }, 2000);
  };

  const handleCancel = () => {
    if (currentUser.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/feeds");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!manual) {
    return (
      <div className="edit-manual-container">
        <Container>
          <Alert variant="danger">Manual not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="edit-manual-container">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="edit-manual-card">
              <Card.Header>
                <h2 className="edit-manual-title">Edit Manual</h2>
                <p className="edit-manual-subtitle">
                  Update the details of your manual
                </p>
              </Card.Header>
              <Card.Body>
                {alertMessage.text && (
                  <Alert variant={alertMessage.type} className="mb-4">
                    {alertMessage.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      Title <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter manual title"
                      className="form-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      Description <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter manual description"
                      className="form-input"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
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
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>File Size</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.fileSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fileSize: e.target.value,
                            })
                          }
                          placeholder="e.g., 2.4 MB"
                          className="form-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Pages</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.pages}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pages: e.target.value,
                            })
                          }
                          placeholder="Number of pages"
                          className="form-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.tags}
                          onChange={(e) =>
                            setFormData({ ...formData, tags: e.target.value })
                          }
                          placeholder="Comma-separated tags"
                          className="form-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

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
                      Update Manual
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

export default EditManual;
