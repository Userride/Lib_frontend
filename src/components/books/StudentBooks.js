import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const StudentBooks = ({ auth }) => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        if (!auth.user?._id) return;
        
        setLoading(true);
        const res = await axios.get(`/issues/student/${auth.user._id}`);
        setIssuedBooks(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your issued books');
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, [auth.user]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining or overdue
  const calculateDaysStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your books...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">My Issued Books</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {issuedBooks.length === 0 ? (
        <Alert variant="info">
          You haven't borrowed any books yet.
        </Alert>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Fine</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((issue) => {
                  const daysStatus = calculateDaysStatus(issue.dueDate);
                  
                  return (
                    <tr key={issue._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {issue.book.imageUrl ? (
                            <img 
                              src={issue.book.imageUrl} 
                              alt={issue.book.title}
                              style={{ width: '50px', height: '70px', objectFit: 'cover', marginRight: '15px' }}
                            />
                          ) : (
                            <img 
                              src={`https://source.unsplash.com/random/50x70/?book,${issue.book.subject}`} 
                              alt={issue.book.title}
                              style={{ width: '50px', height: '70px', objectFit: 'cover', marginRight: '15px' }}
                            />
                          )}
                          <div>
                            <h6 className="mb-0">{issue.book.title}</h6>
                            <small className="text-muted">by {issue.book.author}</small>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(issue.issueDate)}</td>
                      <td>{formatDate(issue.dueDate)}</td>
                      <td>
                        {issue.status === 'returned' ? (
                          <Badge bg="success">Returned</Badge>
                        ) : daysStatus < 0 ? (
                          <Badge bg="danger">Overdue by {Math.abs(daysStatus)} days</Badge>
                        ) : (
                          <Badge bg="primary">{daysStatus} days remaining</Badge>
                        )}
                      </td>
                      <td>
                        {issue.fine > 0 ? (
                          <span className="text-danger">${issue.fine.toFixed(2)}</span>
                        ) : (
                          <span>$0.00</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      
      <div className="mt-4">
        <h5>Important Notes:</h5>
        <ul>
          <li>Books must be returned on or before the due date</li>
          <li>Late fees are charged at $1 per day after the due date</li>
          <li>Contact the library admin if you need to extend the due date</li>
        </ul>
      </div>
    </Container>
  );
};

export default StudentBooks; 