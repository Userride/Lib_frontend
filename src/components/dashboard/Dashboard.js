import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalBooksIssued: 0,
    currentlyIssued: 0,
    overdue: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?._id) return;

        setLoading(true);
        const res = await axios.get(`/issues/student/${user._id}`);
        
        // Calculate statistics
        const totalIssued = res.data.length;
        const currentIssued = res.data.filter(issue => issue.status === 'issued').length;
        const overdue = res.data.filter(issue => {
          const now = new Date();
          const dueDate = new Date(issue.dueDate);
          return issue.status === 'issued' && dueDate < now;
        }).length;
        
        setStats({
          totalBooksIssued: totalIssued,
          currentlyIssued: currentIssued,
          overdue: overdue
        });
        
        // Sort issues by issueDate (newest first)
        const sortedIssues = [...res.data].sort((a, b) => 
          new Date(b.issueDate) - new Date(a.issueDate)
        );
        
        setRecentIssues(sortedIssues.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate status of a book issue
  const calculateStatus = (issue) => {
    if (issue.status === 'returned') {
      return { text: 'Returned', color: 'success' };
    }
    
    const now = new Date();
    const dueDate = new Date(issue.dueDate);
    
    if (dueDate < now) {
      return { text: 'Overdue', color: 'danger' };
    }
    
    return { text: 'Issued', color: 'warning' };
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Student Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-primary">{stats.totalBooksIssued}</h2>
              <h5>Total Books Borrowed</h5>
              <div className="mt-3">
                <Link to="/books">
                  <Button variant="outline-primary" size="sm">Browse Books</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-warning">{stats.currentlyIssued}</h2>
              <h5>Currently Borrowed</h5>
              <div className="mt-3">
                <Link to="/my-books">
                  <Button variant="outline-warning" size="sm">View My Books</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h2 className="display-4 text-danger">{stats.overdue}</h2>
              <h5>Overdue Books</h5>
              <div className="mt-3">
                <Link to="/my-books">
                  <Button variant="outline-danger" size="sm">Check Overdue</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Recent Book Activity</h5>
            </Card.Header>
            <Card.Body>
              {recentIssues.length === 0 ? (
                <Alert variant="info">
                  You haven't borrowed any books yet. Browse our collection and start reading!
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentIssues.map(issue => {
                        const status = calculateStatus(issue);
                        
                        return (
                          <tr key={issue._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={issue.book.imageUrl || `https://source.unsplash.com/random/50x70/?book`} 
                                  alt={issue.book.title}
                                  style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                                  className="me-3"
                                />
                                <div>
                                  <h6 className="mb-0">{issue.book.title}</h6>
                                  <small className="text-muted">by {issue.book.author}</small>
                                </div>
                              </div>
                            </td>
                            <td>{formatDate(issue.issueDate)}</td>
                            <td>{formatDate(issue.dueDate)}</td>
                            <td>
                              <span className={`badge bg-${status.color}`}>
                                {status.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-end mt-3">
                <Link to="/my-books">
                  <Button variant="outline-primary" size="sm">View All Books</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 