import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout Components
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminLogin from './components/auth/AdminLogin';
import AdminRegister from './components/auth/AdminRegister';
import BookList from './components/books/BookList';
import BookSearch from './components/books/BookSearch';
import BookDetails from './components/books/BookDetails';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AddBook from './components/admin/AddBook';
import ManageBooks from './components/admin/ManageBooks';
import ManageStudents from './components/admin/ManageStudents';
import IssueBook from './components/admin/IssueBook';
import IssuedBooks from './components/admin/IssuedBooks';
import StudentBooks from './components/books/StudentBooks';
import NotFound from './components/pages/NotFound';

// Set default axios base URL
axios.defaults.baseURL = 'https://lib-backend-2.onrender.com/api';


// Add auth token to axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null
  });

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
        try {
          const res = await axios.get('/users/me');
          setAuth({
            ...auth,
            isAuthenticated: true,
            loading: false,
            user: res.data
          });
        } catch (err) {
          localStorage.removeItem('token');
          setAuthToken(null);
          setAuth({
            ...auth,
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
          });
        }
      } else {
        setAuth({
          ...auth,
          loading: false
        });
      }
    };

    loadUser();
    // eslint-disable-next-line
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      console.log("Attempting login for user:", email);
      const res = await axios.post('/users/login', { email, password });
      
      console.log("Login successful, user role:", res.data.user.role);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setAuth({
        ...auth,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user
      });
      return { 
        success: true,
        user: res.data.user
      };
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/users/register', userData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setAuth({
        ...auth,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth({
      ...auth,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    });
  };

  // Protected route component
  const PrivateRoute = ({ element, allowedRoles }) => {
    if (auth.loading) {
      return <div>Loading...</div>;
    }
    
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
      return <Navigate to="/dashboard" />;
    }
    
    return element;
  };

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <NavBar auth={auth} logout={logout} />
        <main className="flex-grow-1 container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login login={login} isAuthenticated={auth.isAuthenticated} />} />
            <Route path="/register" element={<Register register={register} isAuthenticated={auth.isAuthenticated} />} />
            <Route path="/admin/login" element={<AdminLogin login={login} isAuthenticated={auth.isAuthenticated} />} />
            <Route path="/admin/register" element={<AdminRegister register={register} isAuthenticated={auth.isAuthenticated} />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/search" element={<BookSearch />} />
            <Route path="/books/:id" element={<BookDetails auth={auth} />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute
                element={<Dashboard user={auth.user} />}
              />
            } />
            
            <Route path="/my-books" element={
              <PrivateRoute
                element={<StudentBooks auth={auth} />}
              />
            } />
            
            <Route path="/admin" element={
              <PrivateRoute
                element={<AdminDashboard />}
                allowedRoles={['admin', 'super-admin']}
              />
            } />
            
            <Route path="/admin/books/add" element={
              <PrivateRoute
                element={<AddBook />}
                allowedRoles={['admin', 'super-admin']}
              />
            } />
            
            <Route path="/admin/books/manage" element={
              <PrivateRoute
                element={<ManageBooks />}
                allowedRoles={['admin', 'super-admin']}
              />
            } />
            
            <Route path="/admin/students" element={
              <PrivateRoute
                element={<ManageStudents />}
                allowedRoles={['admin', 'super-admin']}
              />
            } />
            
            <Route path="/admin/issue" element={
              <PrivateRoute
                element={<IssueBook />}
                allowedRoles={['admin', 'super-admin']}
              />
            } />
            
            <Route path="/admin/issued-books" element={
              <PrivateRoute
                element={<IssuedBooks />}
                allowedRoles={['admin', 'super-admin']}
              />
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
