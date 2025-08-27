import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';

const IssueBook = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Calculate minimum due date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDueDate = tomorrow.toISOString().split('T')[0];

  // Calculate maximum due date (30 days from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDueDate = maxDate.toISOString().split('T')[0];

  // Fetch books and students when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const [booksRes, studentsRes] = await Promise.all([
          axios.get('/books'),
          axios.get('/users/students')
        ]);
        
        // Only include available books
        const availableBooks = booksRes.data.filter(book => book.available);
        setBooks(availableBooks);
        setFilteredBooks(availableBooks);
        setStudents(studentsRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  // Filter books based on search term
  useEffect(() => {
    if (bookSearchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
        book.id.toString().includes(bookSearchTerm)
      );
      setFilteredBooks(filtered);
    }
  }, [bookSearchTerm, books]);

  // Handle book selection
  const handleBookSelect = (bookId) => {
    setSelectedBookId(bookId);
    setBookSearchTerm('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    if (!selectedBookId || !selectedStudentId || !dueDate) {
      setError('Please select a book, a student, and a due date');
      setLoading(false);
      return;
    }

    try {
      console.log("Sending issue request:", {
        bookId: selectedBookId,
        studentId: selectedStudentId,
        dueDate
      });
      
      await axios.post('/issues', {
        bookId: selectedBookId,
        studentId: selectedStudentId,
        dueDate
      });

      setSuccess(true);
      setSelectedBookId('');
      setSelectedStudentId('');
      setDueDate('');
      
      // Refresh available books
      const booksRes = await axios.get('/books');
      const availableBooks = booksRes.data.filter(book => book.available);
      setBooks(availableBooks);
      setFilteredBooks(availableBooks);
    } catch (err) {
      console.error("Error issuing book:", err);
      if (err.response?.data?.message) {
        setError(`Failed to issue book: ${err.response.data.message}`);
      } else if (err.response?.status === 401) {
        setError('Authentication error. Please login again as an admin.');
      } else if (err.response?.status === 404) {
        setError('Book or student not found. Please try again.');
      } else {
        setError('Failed to issue book. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading data...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Issue Book to Student</h1>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
              Book issued successfully!
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="studentId">
                  <Form.Label>Select Student</Form.Label>
                  <Form.Select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Student --</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} {student.studentId ? `(${student.studentId})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="dueDate">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={minDueDate}
                    max={maxDueDate}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="bookSearch">
              <Form.Label>Search Book</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by title, author or ID"
                value={bookSearchTerm}
                onChange={(e) => setBookSearchTerm(e.target.value)}
              />
            </Form.Group>
            
            <div className="selected-book mb-3">
              <h5>Selected Book</h5>
              {selectedBookId ? (
                <div className="p-3 border rounded">
                  {books.find(book => book.id.toString() === selectedBookId.toString()) ? (
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img 
                          src={`https://source.unsplash.com/random/60x80/?book`} 
                          alt="Book Cover"
                          style={{ width: '60px', height: '80px', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1">
                          {books.find(book => book.id.toString() === selectedBookId.toString())?.title}
                        </h6>
                        <p className="mb-0 text-muted small">
                          by {books.find(book => book.id.toString() === selectedBookId.toString())?.author}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-danger">Selected book is no longer available</p>
                  )}
                </div>
              ) : (
                <p className="text-muted">No book selected. Please select from the table below.</p>
              )}
            </div>
            
            <div className="mb-4">
              <h5>Available Books</h5>
              {filteredBooks.length === 0 ? (
                <Alert variant="info">No books available for issue</Alert>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Subject</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map(book => (
                        <tr key={book.id}>
                          <td>{book.id}</td>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>{book.subject}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleBookSelect(book.id)}
                            >
                              Select
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !selectedBookId || !selectedStudentId || !dueDate}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Issuing Book...
                  </>
                ) : 'Issue Book'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default IssueBook; 