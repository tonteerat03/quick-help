import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { updateUser } from "../data/userdata";
import "./css/profilesettings.css";

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const updatedUser = updateUser(user.id, formData);
      setSuccess("Profile updated successfully!");
      setUser(updatedUser);
    } catch (err) {
      setError(err?.message || "Failed to update profile. Please try again.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-settings-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="profile-settings-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="profile-settings-title">Profile Settings</h2>
                  <p className="profile-settings-subtitle">
                    Manage your account details
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileSettings;
