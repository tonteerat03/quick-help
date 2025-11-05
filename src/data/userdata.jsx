const defaultUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@quickhelp.com",
    password: "admin123",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    joinDate: "2024-01-01T00:00:00Z",
    isActive: true,
    permissions: [
      "create_manual",
      "edit_manual",
      "delete_manual",
      "manage_users",
      "view_analytics",
    ],
  },
  {
    id: 2,
    username: "john_doe",
    email: "john.doe@example.com",
    password: "user123",
    role: "user",
    firstName: "John",
    lastName: "Doe",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    joinDate: "2024-02-15T10:30:00Z",
    isActive: true,
    permissions: ["create_manual", "edit_own_manual", "comment"],
  },
  {
    id: 3,
    username: "sarah_dev",
    email: "sarah.dev@example.com",
    password: "user123",
    role: "user",
    firstName: "Sarah",
    lastName: "Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    joinDate: "2024-03-10T14:20:00Z",
    isActive: true,
    permissions: ["create_manual", "edit_own_manual", "comment"],
  },
];

const initializeUsers = () => {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  localStorage.setItem("users", JSON.stringify(defaultUsers));
  return defaultUsers;
};

export let USER_DATA = initializeUsers();

const updateUsersInStorage = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
  USER_DATA = users;
};

// Helper functions for user management
export const getUserById = (id) => {
  return USER_DATA.find((user) => user.id === parseInt(id));
};

export const getUserByEmail = (email) => {
  return USER_DATA.find((user) => user.email === email);
};

export const getUserByUsername = (username) => {
  return USER_DATA.find((user) => user.username === username);
};

export const authenticateUser = (emailOrUsername, password) => {
  // Try to find user by email first, then by username
  let user = getUserByEmail(emailOrUsername);
  if (!user) {
    user = getUserByUsername(emailOrUsername);
  }
  if (user && user.password === password && user.isActive) {
    return user;
  }
  return null;
};

export const addUser = (userData) => {
  const newId =
    USER_DATA.length > 0 ? Math.max(...USER_DATA.map((u) => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    ...userData,
    joinDate: new Date().toISOString(),
    isActive: true,
    permissions:
      userData.role === "admin"
        ? [
            "create_manual",
            "edit_manual",
            "delete_manual",
            "manage_users",
            "view_analytics",
          ]
        : ["create_manual", "edit_own_manual", "comment"],
  };
  const updatedUsers = [...USER_DATA, newUser];
  updateUsersInStorage(updatedUsers);
  return newUser;
};

export const updateUser = (userId, updates) => {
  const id = parseInt(userId);
  const idx = USER_DATA.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");

  // Uniqueness checks
  if (updates.email) {
    const emailTaken = USER_DATA.some(
      (u) =>
        u.id !== id && u.email?.toLowerCase() === updates.email.toLowerCase()
    );
    if (emailTaken) throw new Error("Email already in use");
  }
  if (updates.username) {
    const usernameTaken = USER_DATA.some(
      (u) =>
        u.id !== id &&
        u.username?.toLowerCase() === updates.username.toLowerCase()
    );
    if (usernameTaken) throw new Error("Username already in use");
  }

  const updated = { ...USER_DATA[idx], ...updates };
  const newUsers = USER_DATA.map((u) => (u.id === id ? updated : u));
  updateUsersInStorage(newUsers);

  // Refresh currentUser copy if needed
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const cur = JSON.parse(stored);
      if (cur.id === id) {
        localStorage.setItem("currentUser", JSON.stringify(updated));
      }
    }
  } catch (_) {
    // ignore
  }

  return updated;
};
