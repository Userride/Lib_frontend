import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalStudents: 0,
    overdueBooks: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch books, students, issues, and overdue books in parallel
        const [booksRes, studentsRes, issuesRes, overdueRes] = await Promise.all([
          axios.get('/books'),
          axios.get('/users/students'),
          axios.get('/issues'),
          axios.get('/issues/overdue')
        ]);
        
        // Calculate statistics
        const books = booksRes.data;
        const availableBooks = books.filter(book => book.available).length;
        const issuedBooks = issuesRes.data.filter(issue => issue.status === 'issued').length;
        
        setStats({
          totalBooks: books.length,
          availableBooks,
          issuedBooks,
          totalStudents: studentsRes.data.length,
          overdueBooks: overdueRes.data.length
        });
        
        // Get most recent issues
        const sortedIssues = issuesRes.data.sort((a, b) => 
          new Date(b.issueDate) - new Date(a.issueDate)
        );
        setRecentIssues(sortedIssues.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-primary">{stats.totalBooks}</h2>
              <h5>Total Books</h5>
              <div className="mt-3">
                <Link to="/admin/books/manage">
                  <Button variant="outline-primary" size="sm">Manage Books</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-success">{stats.availableBooks}</h2>
              <h5>Available Books</h5>
              <div className="mt-3">
                <Link to="/admin/books/add">
                  <Button variant="outline-success" size="sm">Add Book</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-info">{stats.totalStudents}</h2>
              <h5>Registered Students</h5>
              <div className="mt-3">
                <Link to="/admin/students">
                  <Button variant="outline-info" size="sm">Manage Students</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-warning">{stats.issuedBooks}</h2>
              <h5>Issued Books</h5>
              <div className="mt-3">
                <Link to="/admin/issued-books">
                  <Button variant="outline-warning" size="sm">View Issued Books</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-danger">{stats.overdueBooks}</h2>
              <h5>Overdue Books</h5>
              <div className="mt-3">
                <Link to="/admin/issued-books">
                  <Button variant="outline-danger" size="sm">View Overdue Books</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={6} md={3} className="mb-3">
                  <Link to="/admin/issue" className="d-grid">
                    <Button variant="primary">Issue Book</Button>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="mb-3">
                  <Link to="/admin/books/add" className="d-grid">
                    <Button variant="success">Add Book</Button>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="mb-3">
                  <Link to="/admin/issued-books" className="d-grid">
                    <Button variant="warning">Return Book</Button>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="mb-3">
                  <Link to="/admin/issued-books" className="d-grid">
                    <Button variant="danger">Send Reminders</Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Issues */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Recent Book Issues</h5>
            </Card.Header>
            <Card.Body>
              {recentIssues.length === 0 ? (
                <Alert variant="info">No recent book issues</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Book Title</th>
                        <th>Student</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentIssues.map(issue => (
                        <tr key={issue._id}>
                          <td>{issue.book.title}</td>
                          <td>{issue.student.name}</td>
                          <td>{formatDate(issue.issueDate)}</td>
                          <td>{formatDate(issue.dueDate)}</td>
                          <td>
                            <span className={`badge ${issue.status === 'returned' ? 'bg-success' : issue.status === 'overdue' ? 'bg-danger' : 'bg-warning'}`}>
                              {issue.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-end mt-3">
                <Link to="/admin/issued-books">
                  <Button variant="outline-primary" size="sm">View All Issues</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 