import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import { MANUAL_DATA } from "../data/manualdata";
import { USER_DATA } from "../data/userdata";
import { COMMENT_DATA } from "../data/commentdata";
import "./css/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [manuals, setManuals] = useState(MANUAL_DATA);
  const [users, setUsers] = useState(USER_DATA);
  const [comments, setComments] = useState(COMMENT_DATA);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedManual, setSelectedManual] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newManual, setNewManual] = useState({
    title: "",
    description: "",
    category: "Programming",
    tags: "",
    fileSize: "",
    pages: "",
  });
  const [stats, setStats] = useState({
    totalManuals: 0,
    totalUsers: 0,
    totalComments: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    calculateStats();
  }, [navigate]);

  const calculateStats = () => {
    const totalManuals = manuals.length;
    const totalUsers = users.length;
    const totalComments = comments.length;
    const totalViews = manuals.reduce((sum, manual) => sum + manual.views, 0);
    const totalLikes = manuals.reduce((sum, manual) => sum + manual.likes, 0);
    const totalDownloads = manuals.reduce(
      (sum, manual) => sum + manual.downloads,
      0
    );

    setStats({
      totalManuals,
      totalUsers,
      totalComments,
      totalViews,
      totalLikes,
      totalDownloads,
    });
  };

  const handleCreateManual = () => {
    if (!newManual.title || !newManual.description) {
      alert("Please fill in all required fields");
      return;
    }

    const manualData = {
      ...newManual,
      id: Math.max(...manuals.map((m) => m.id)) + 1,
      thumbnail:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      views: 0,
      likes: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        avatar: currentUser.avatar,
        role: currentUser.role,
      },
      tags: newManual.tags.split(",").map((tag) => tag.trim()),
    };

    manuals.push(manualData);
    setManuals([...manuals]);
    setShowManualModal(false);
    setNewManual({
      title: "",
      description: "",
      category: "Programming",
      tags: "",
      fileSize: "",
      pages: "",
    });
    calculateStats();
  };

  const handleDeleteManual = (manualId) => {
    if (window.confirm("Are you sure you want to delete this manual?")) {
      const updatedManuals = manuals.filter((m) => m.id !== manualId);
      setManuals(updatedManuals);
      calculateStats();
    }
  };

  const handleEditManual = (manual) => {
    setSelectedManual(manual);
    setNewManual({
      title: manual.title,
      description: manual.description,
      category: manual.category,
      tags: manual.tags.join(", "),
      fileSize: manual.fileSize,
      pages: manual.pages.toString(),
    });
    setShowManualModal(true);
  };

  const handleUpdateManual = () => {
    if (selectedManual) {
      const updatedManuals = manuals.map((m) =>
        m.id === selectedManual.id
          ? {
              ...m,
              title: newManual.title,
              description: newManual.description,
              category: newManual.category,
              tags: newManual.tags.split(",").map((tag) => tag.trim()),
              fileSize: newManual.fileSize,
              pages: parseInt(newManual.pages),
            }
          : m
      );
      setManuals(updatedManuals);
      setSelectedManual(null);
      setShowManualModal(false);
    }
  };

  const handleToggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <span>Welcome, {currentUser.firstName}!</span>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Container fluid className="dashboard-content">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">📚</div>
                <h3>{stats.totalManuals}</h3>
                <p>Total Manuals</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">👥</div>
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">💬</div>
                <h3>{stats.totalComments}</h3>
                <p>Total Comments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">👁️</div>
                <h3>{stats.totalViews}</h3>
                <p>Total Views</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">❤️</div>
                <h3>{stats.totalLikes}</h3>
                <p>Total Likes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">⬇️</div>
                <h3>{stats.totalDownloads}</h3>
                <p>Total Downloads</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Manuals Management */}
          <Col lg={8}>
            <Card className="management-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h3>Manuals Management</h3>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedManual(null);
                    setShowManualModal(true);
                  }}
                >
                  <i className="bi bi-plus"></i> Add Manual
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Views</th>
                        <th>Likes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manuals.map((manual) => (
                        <tr key={manual.id}>
                          <td>
                            <div className="manual-info">
                              <img
                                src={manual.thumbnail}
                                alt={manual.title}
                                className="manual-thumb"
                              />
                              <div>
                                <strong>{manual.title}</strong>
                                <br />
                                <small className="text-muted">
                                  {manual.description.substring(0, 50)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{manual.author.name}</td>
                          <td>
                            <Badge bg="primary">{manual.category}</Badge>
                          </td>
                          <td>{manual.views}</td>
                          <td>{manual.likes}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEditManual(manual)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeleteManual(manual.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Users Management */}
          <Col lg={4}>
            <Card className="management-card">
              <Card.Header>
                <h3>Users Management</h3>
              </Card.Header>
              <Card.Body>
                <div className="users-list">
                  {users.map((user) => (
                    <div key={user.id} className="user-item">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <div className="user-name">
                          {user.firstName} {user.lastName}
                          <Badge
                            bg={user.role === "admin" ? "danger" : "success"}
                            className="ms-2"
                          >
                            {user.role}
                          </Badge>
                        </div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-status">
                          <Badge bg={user.isActive ? "success" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          user.isActive ? "outline-danger" : "outline-success"
                        }
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Manual Modal */}
      <Modal
        show={showManualModal}
        onHide={() => setShowManualModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedManual ? "Edit Manual" : "Create New Manual"}
          </Modal.Title>
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

            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>

            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowManualModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={selectedManual ? handleUpdateManual : handleCreateManual}
          >
            {selectedManual ? "Update Manual" : "Create Manual"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
