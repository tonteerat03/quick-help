import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  authenticateUser,
  addUser,
  getUserByEmail,
  getUserByUsername,
} from "../data/userdata";
import "./css/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields");
      return;
    }

    const user = authenticateUser(loginData.email, loginData.password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/feeds");
        }
      }, 1000);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Check if email/username already exist
    const emailTaken = getUserByEmail(registerData.email);
    if (emailTaken) {
      setError("Email already exists");
      return;
    }
    const usernameTaken = getUserByUsername(registerData.username);
    if (usernameTaken) {
      setError("Username already exists");
      return;
    }

    try {
      // Prepare user payload without confirmPassword
      const { username, email, password, role } = registerData;
      const newUser = addUser({
        username,
        email,
        password,
        role,
        avatar: "https://via.placeholder.com/40x40?text=U",
      });
      setSuccess("Registration successful! Please login.");
      setActiveTab("login");
      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col
            xs={12}
            sm={10}
            md={8}
            lg={6}
            xl={5}
            className="d-flex justify-content-center"
          >
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="login-title">Quick Help</h2>
                  <p className="login-subtitle">
                    Sign in to your account or create a new one
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mb-3">
                    {success}
                  </Alert>
                )}

                <Tabs
                  activeKey={activeTab}
                  className="mb-4 justify-content-center"
                  fill
                >
                  {activeTab === "login" && (
                    <Tab
                      eventKey="login"
                      title={<span className="fw-semibold">Login</span>}
                    >
                      <Form onSubmit={handleLogin} className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={loginData.email}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter your email"
                            required
                            className="form-control"
                            autoComplete="username"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={loginData.password}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                            placeholder="Enter your password"
                            required
                            className="form-control"
                            autoComplete="current-password"
                          />
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          className="login-btn"
                        >
                          Sign In
                        </Button>
                        <div className="text-center mt-3">
                          <Button
                            variant="link"
                            className="text-decoration-none fw-semibold"
                            onClick={() => setActiveTab("register")}
                            style={{
                              color: "var(--primary)",
                              textDecoration: "none",
                            }}
                          >
                            Don't have an account? Register
                          </Button>
                        </div>
                      </Form>
                    </Tab>
                  )}
                  {activeTab === "register" && (
                    <Tab
                      eventKey="register"
                      title={<span className="fw-semibold">Register</span>}
                    >
                      <Form onSubmit={handleRegister} className="mt-3">
                        {/* Removed First Name and Last Name fields */}
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            Username
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={registerData.username}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                username: e.target.value,
                              })
                            }
                            placeholder="Choose a username"
                            required
                            className="form-control"
                            autoComplete="username"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter your email"
                            required
                            className="form-control"
                            autoComplete="email"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={registerData.password}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                password: e.target.value,
                              })
                            }
                            placeholder="Create a password"
                            required
                            className="form-control"
                            autoComplete="new-password"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                            Confirm Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm your password"
                            required
                            className="form-control"
                            autoComplete="new-password"
                          />
                        </Form.Group>

                        <Button
                          variant="success"
                          type="submit"
                          className="login-btn"
                        >
                          Create Account
                        </Button>
                        <div className="text-center mt-3">
                          <Button
                            variant="link"
                            className="text-decoration-none fw-semibold"
                            onClick={() => setActiveTab("login")}
                            style={{
                              color: "var(--primary)",
                              textDecoration: "none",
                            }}
                          >
                            Already have an account? Login
                          </Button>
                        </div>
                      </Form>
                    </Tab>
                  )}
                </Tabs>

                <div className="text-center mt-3">
                  <Link
                    to="/feeds"
                    className="text-decoration-none fw-semibold"
                  >
                    Continue as Guest
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
