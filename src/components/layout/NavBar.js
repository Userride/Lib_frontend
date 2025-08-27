import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';

const NavBar = ({ auth, logout }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = auth;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/books">Books</Nav.Link>
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/register">Register</Nav.Link>
      <Nav.Link as={Link} to="/admin/login">Admin Login</Nav.Link>
    </>
  );

  const authLinks = (
    <>
      <Nav.Link as={Link} to="/books">Books</Nav.Link>
      <Nav.Link as={Link} to="/my-books">My Books</Nav.Link>
      <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
      
      {(user?.role === 'admin' || user?.role === 'super-admin') && (
        <NavDropdown title="Admin" id="admin-dropdown">
          <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/books/add">Add Book</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/books/manage">Manage Books</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/students">Manage Students</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/issue">Issue Book</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/issued-books">Issued Books</NavDropdown.Item>
        </NavDropdown>
      )}
      
      <Button variant="outline-danger" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Library Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar; 