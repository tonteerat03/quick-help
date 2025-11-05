import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
} from "react-bootstrap";
import {
  MANUAL_DATA,
  getPendingManuals,
  approveManual,
  rejectManual,
  deleteManual,
} from "../data/manualdata";
import { USER_DATA } from "../data/userdata";
import { COMMENT_DATA } from "../data/commentdata";
import "./css/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [manuals, setManuals] = useState(MANUAL_DATA);
  const [users, setUsers] = useState(USER_DATA);
  const [comments, setComments] = useState(COMMENT_DATA);
  const [stats, setStats] = useState({
    totalManuals: 0,
    totalUsers: 0,
    totalComments: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
  });
  const [pendingManuals, setPendingManuals] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    calculateStats();
    loadPendingManuals();
  }, [navigate]);

  const loadPendingManuals = () => {
    setPendingManuals(getPendingManuals());
  };

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

  const handleDeleteManual = (manualId) => {
    if (window.confirm("Are you sure you want to delete this manual?")) {
      deleteManual(manualId);
      const updatedManuals = manuals.filter((m) => m.id !== manualId);
      setManuals(updatedManuals);
      loadPendingManuals();
      calculateStats();
    }
  };

  const handleApproveManual = (manualId) => {
    approveManual(manualId);
    loadPendingManuals();
    setManuals(MANUAL_DATA);
    calculateStats();
  };

  const handleRejectManual = (manualId) => {
    if (window.confirm("Are you sure you want to reject this manual?")) {
      rejectManual(manualId);
      loadPendingManuals();
      calculateStats();
    }
  };
  const handleEditManual = (manualId) => {
    navigate(`/edit-manual/${manualId}`);
  };

  const handleToggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
  };
  const handleCreateManual = () => {
    navigate("/create-manual");
  };

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="dashboard-container">
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
          </Col>{" "}
        </Row>

        {/* Pending Manuals Section */}
        {pendingManuals.length > 0 && (
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="management-card">
                <Card.Header>
                  <h3>
                    Pending Manuals Approval{" "}
                    <Badge bg="warning" text="dark">
                      {pendingManuals.length}
                    </Badge>
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Category</th>
                          <th>Submitted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingManuals.map((manual) => (
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
                              <Badge bg="secondary">{manual.category}</Badge>
                            </td>
                            <td>
                              {new Date(manual.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleApproveManual(manual.id)}
                                className="me-2"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleRejectManual(manual.id)}
                              >
                                Reject
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
          </Row>
        )}

        <Row>
          {/* Manuals Management */}
          <Col lg={8}>
            {" "}
            <Card className="management-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h3>Manuals Management</h3>
                <Button variant="primary" onClick={handleCreateManual}>
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
                          <td>{manual.likes}</td>{" "}
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEditManual(manual.id)}
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
            </Card>{" "}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
