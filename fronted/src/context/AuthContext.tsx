import React, { createContext, useContext, useState, useEffect } from "react";

export interface Address {
  _id?: string;
  tag: string;
  name: string;
  addressLine: string;
  city: string;
  phone: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  wishlist: string[];
  cart: Array<{ product: string; quantity: number }>;
  addresses: Address[];
}

interface AuthContextProps {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addAddress: (address: Omit<Address, "_id">) => Promise<{ success: boolean; message?: string }>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<{ success: boolean; message?: string }>;
  deleteAddress: (id: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile on initial load or token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          wishlist: data.data.wishlist || [],
          cart: data.data.cart || [],
          addresses: data.data.addresses || [],
        });
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          wishlist: data.data.wishlist || [],
          cart: data.data.cart || [],
          addresses: data.data.addresses || [],
        });
        return { success: true };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          wishlist: data.data.wishlist || [],
          cart: data.data.cart || [],
          addresses: data.data.addresses || [],
        });
        return { success: true };
      } else {
        return { success: false, message: data.message || "Google auth failed" };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const addAddress = async (addressData: Omit<Address, "_id">) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (data.success) {
        if (user) {
          setUser({ ...user, addresses: data.data });
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to add address" };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (data.success) {
        if (user) {
          setUser({ ...user, addresses: data.data });
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to update address" };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        if (user) {
          setUser({ ...user, addresses: data.data });
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to delete address" };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
