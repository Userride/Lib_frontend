import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookSearch = () => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    subject: '',
    semester: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const { title, author, subject, semester } = searchParams;

  const onChange = e => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (title) queryParams.append('title', title);
      if (author) queryParams.append('author', author);
      if (subject) queryParams.append('subject', subject);
      if (semester) queryParams.append('semester', semester);

      const res = await axios.get(`/books/search?${queryParams.toString()}`);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Advanced Book Search</h1>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Enter book title"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={author}
                    onChange={onChange}
                    placeholder="Enter author name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={subject}
                    onChange={onChange}
                    placeholder="Enter subject"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control
                    type="number"
                    name="semester"
                    value={semester}
                    onChange={onChange}
                    placeholder="Enter semester"
                    min="1"
                    max="8"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || (!title && !author && !subject && !semester)}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Searching...
                  </>
                ) : 'Search Books'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {searched && (
        <>
          <h2 className="mb-3">Search Results</h2>
          
          {results.length === 0 ? (
            <Alert variant="info">No books found matching your criteria</Alert>
          ) : (
            <Row>
              {results.map(book => (
                <Col key={book.id} md={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={book.imageUrl || `https://source.unsplash.com/random/800x600/?book,${book.subject}`} 
                      alt={book.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{book.title}</Card.Title>
                      <Card.Text className="text-muted mb-1">By {book.author}</Card.Text>
                      <Card.Text>
                        <small>
                          <span className="badge bg-primary me-2">{book.subject}</span>
                          <span className="badge bg-secondary">Semester {book.semester}</span>
                        </small>
                      </Card.Text>
                      <div className="mt-auto">
                        <Link to={`/books/${book.id}`}>
                          <Button variant="outline-primary" className="w-100">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-center">
                      <small className={book.available ? 'text-success' : 'text-danger'}>
                        {book.available ? 'Available' : 'Not Available'}
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default BookSearch; 