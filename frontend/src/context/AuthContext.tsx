import { createContext, useContext, useState, ReactNode } from 'react';



interface User {
  Country: string;
  postalCode: string;
  id: string;
  name: string;
  email: string;
  role: string;
  
   statutCompte?: boolean;
  stripeOnboardingUrl?: string;
  stripeAccountId?: string;
  stripeOnboardingCompleted?: boolean;
  canReceiveTransfers?: boolean;
  onboardingComplete?: boolean;
  transfersActive?: boolean;
  canReceiveMoney?: boolean
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  
  // Initialize user state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('user'); // Clear invalid data
        return null;
      }
    }
    return null;
  });

  // Initialize token state from localStorage
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    window.location.reload();
  };

  const fetchUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const response = await fetch('http://localhost:4000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};