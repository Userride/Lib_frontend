import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="bg-white text-black py-5 mb-5">



        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">IIIT Kalyani Library Management System</h1>
              <p className="lead">
                A complete solution for managing books, students, and issuance records
              </p>
              <Link to="/books">
                <Button variant="light" size="lg" className="me-3">
                  Browse Books
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="light" size="lg">
                  Register
                </Button>
              </Link>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <img 
                src="https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Library" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">Features</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <i className="bi bi-book fs-1 text-primary"></i>
                </div>
                <Card.Title className="text-center">Book Management</Card.Title>
                <Card.Text>
                  Easily add, update, and remove books from the library database. 
                  Track availability and manage book details.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <i className="bi bi-people fs-1 text-primary"></i>
                </div>
                <Card.Title className="text-center">Student Management</Card.Title>
                <Card.Text>
                  Register and manage student accounts. Track borrowing history 
                  and maintain student records.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <i className="bi bi-arrow-left-right fs-1 text-primary"></i>
                </div>
                <Card.Title className="text-center">Issue & Return</Card.Title>
                <Card.Text>
                  Streamline the process of issuing books to students and recording 
                  returns with an intuitive interface.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <h2 className="text-center mb-4">How It Works</h2>
          <Row className="g-4">
            <Col md={3} className="text-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <h3 className="mb-0">1</h3>
              </div>
              <h5>Register</h5>
              <p>Create an account to access the library system</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <h3 className="mb-0">2</h3>
              </div>
              <h5>Browse Books</h5>
              <p>Search through the available books in the library</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <h3 className="mb-0">3</h3>
              </div>
              <h5>Issue Books</h5>
              <p>Request to borrow books from the library</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <h3 className="mb-0">4</h3>
              </div>
              <h5>Return Books</h5>
              <p>Return books before the due date to avoid fines</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="my-5 text-center">
          <Col>
            <h1>Welcome to the Library Management System</h1>
            <p className="lead">
              A comprehensive solution for managing books, students, and circulation
            </p>
          </Col>
        </Row>
        
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>For Students</Card.Title>
                <Card.Text>
                  Browse our collection of books, check availability, and view your borrowed books.
                </Card.Text>
                <div className="mt-auto">
                  <Link to="/books">
                    <Button variant="primary">Browse Books</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>User Account</Card.Title>
                <Card.Text>
                  Login to your account or register as a new student to access all features.
                </Card.Text>
                <div className="mt-auto d-flex gap-2">
                  <Link to="/login">
                    <Button variant="outline-primary">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary">Register</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>Admin Access</Card.Title>
                <Card.Text>
                  Administrators can manage books, issue books to students, and handle returns.
                </Card.Text>
                <div className="mt-auto d-flex gap-2">
                  <Link to="/admin/login">
                    <Button variant="outline-danger">Admin Login</Button>
                  </Link>
                  <Link to="/admin/register">
                    <Button variant="danger">Admin Register</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="my-5">
          <Col>
            <h2 className="text-center mb-4">Key Features</h2>
            <ul className="list-group">
              <li className="list-group-item">Browse and search the entire book collection</li>
              <li className="list-group-item">Track currently borrowed books</li>
              <li className="list-group-item">Admin panel for managing library operations</li>
              <li className="list-group-item">Book issue and return system</li>
              <li className="list-group-item">Overdue management and notifications</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home; 
