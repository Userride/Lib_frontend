import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // Fetch all books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/books');
        setBooks(res.data);

        // Extract unique subjects and semesters for filters
        const uniqueSubjects = [...new Set(res.data.map(book => book.subject))];
        const uniqueSemesters = [...new Set(res.data.map(book => book.semester))];
        
        setSubjects(uniqueSubjects.sort());
        setSemesters(uniqueSemesters.sort((a, b) => a - b));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search term and filters
  const filteredBooks = books.filter(book => {
    const matchesSearchTerm = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject ? book.subject === selectedSubject : true;
    const matchesSemester = selectedSemester ? book.semester == parseInt(selectedSemester) : true;
    
    return matchesSearchTerm && matchesSubject && matchesSemester;
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedSemester('');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading books...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Books Collection</h1>
      
      {/* Search and Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search by title or author"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Filter by Subject</Form.Label>
                <Form.Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Filter by Semester</Form.Label>
                <Form.Select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {semesters.map((semester, index) => (
                    <option key={index} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Button 
                variant="secondary" 
                className="w-100"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Alert variant="info">No books found matching your criteria</Alert>
      ) : (
        <Row>
          {filteredBooks.map(book => (
            <Col key={book.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {book.imageUrl ? (
                  <Card.Img 
                    variant="top" 
                    src={book.imageUrl} 
                    alt={book.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <Card.Img 
                    variant="top" 
                    src={`https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D,${book.subject}`} 
                    alt={book.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text className="text-muted mb-1">By {book.author}</Card.Text>
                  <Card.Text>
                    <small>
                      <span className="badge bg-primary me-2">{book.subject}</span>
                      <span className="badge bg-secondary">Semester {book.semester}</span>
                    </small>
                  </Card.Text>
                  <Card.Text>
                    Published: {book.publicationYear}
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
    </Container>
  );
};

export default BookList; 