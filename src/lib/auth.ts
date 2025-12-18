// Authentication utilities - Client-side only

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Store token in localStorage
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

// Get token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// Remove token from localStorage
export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }
};

// Store user data
export const setUserData = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_data", JSON.stringify(user));
  }
};

// Get user data
export const getUserData = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Login API call - calls Next.js API route
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  const data: AuthResponse = await response.json();
  
  // Store token and user data
  setAuthToken(data.token);
  setUserData(data.user);
  
  return data;
};

// Logout API call - calls Next.js API route
export const logout = async (): Promise<void> => {
  const token = getAuthToken();
  
  if (!token) {
    removeAuthToken();
    return;
  }

  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Logout request failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear local storage
    removeAuthToken();
  }
};
