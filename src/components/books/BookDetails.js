import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookDetails = ({ auth }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/books/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading book details...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!book) {
    return <Alert variant="info">Book not found</Alert>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={4} className="mb-4 mb-md-0">
          <Card className="shadow-sm">
            {book.imageUrl ? (
              <Card.Img 
                src={book.imageUrl} 
                alt={book.title}
                className="book-cover-img"
              />
            ) : (
              <Card.Img 
                src={`https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3DF,${book.subject}`} 
                alt={book.title}
                className="book-cover-img"
              />
            )}
            <Card.Footer className="text-center py-3">
              <h5 className={book.available ? 'text-success mb-0' : 'text-danger mb-0'}>
                {book.available ? 'Available' : 'Not Available'}
              </h5>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h1 className="mb-2">{book.title}</h1>
              <h5 className="text-muted mb-4">by {book.author}</h5>
              
              <div className="mb-4">
                <Badge bg="primary" className="me-2 p-2">
                  Subject: {book.subject}
                </Badge>
                <Badge bg="secondary" className="me-2 p-2">
                  Semester: {book.semester}
                </Badge>
                <Badge bg="info" className="p-2">
                  Publication Year: {book.publicationYear}
                </Badge>
              </div>
              
              <div className="book-description mb-4">
                <h5>About This Book</h5>
                <p>
                  This book is an essential resource for students studying {book.subject} 
                  in semester {book.semester}. Published in {book.publicationYear}, 
                  it provides comprehensive coverage of the subject matter.
                </p>
              </div>
              
              <div className="book-actions">
                {auth.isAuthenticated && auth.user.role === 'user' && book.available && (
                  <Button 
                    variant="primary" 
                    className="me-2"
                    as={Link}
                    to="/dashboard"
                  >
                    Request Book
                  </Button>
                )}
                
                {auth.isAuthenticated && (auth.user.role === 'admin' || auth.user.role === 'super-admin') && (
                  <>
                    <Button 
                      variant="warning" 
                      className="me-2"
                      as={Link}
                      to={`/admin/books/edit/${book.id}`}
                    >
                      Edit Book
                    </Button>
                    
                    {book.available && (
                      <Button 
                        variant="success" 
                        className="me-2"
                        as={Link}
                        to="/admin/issue"
                      >
                        Issue Book
                      </Button>
                    )}
                  </>
                )}
                
                <Button 
                  variant="outline-secondary"
                  as={Link}
                  to="/books"
                >
                  Back to Books
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetails; 