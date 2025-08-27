import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AddBook = () => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    subject: '',
    semester: '',
    publicationYear: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { id, title, author, subject, semester, publicationYear, imageUrl } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      author: '',
      subject: '',
      semester: '',
      publicationYear: '',
      imageUrl: ''
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      // Convert string values to appropriate types
      const bookData = {
        ...formData,
        id: parseInt(id),
        semester: parseInt(semester),
        publicationYear: parseInt(publicationYear)
      };

      console.log("Adding book with data:", bookData);
      await axios.post('/books', bookData);
      setSuccess(true);
      resetForm();
    } catch (err) {
      console.error("Error adding book:", err);
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Add New Book</h1>
      
      <Card className="shadow-sm">
        <Card.Body>
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
              Book added successfully!
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="id">
                  <Form.Label>Book ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="id"
                    value={id}
                    onChange={onChange}
                    placeholder="Enter book ID"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Enter book title"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={author}
                    onChange={onChange}
                    placeholder="Enter author name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={subject}
                    onChange={onChange}
                    placeholder="Enter subject"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="semester">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control
                    type="number"
                    name="semester"
                    value={semester}
                    onChange={onChange}
                    placeholder="Enter semester number"
                    required
                    min="1"
                    max="8"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="publicationYear">
                  <Form.Label>Publication Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="publicationYear"
                    value={publicationYear}
                    onChange={onChange}
                    placeholder="Enter publication year"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="imageUrl">
              <Form.Label>Image URL (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={imageUrl}
                onChange={onChange}
                placeholder="Enter image URL"
              />
              <Form.Text className="text-muted">
                Provide a URL to an image of the book cover
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button 
                variant="outline-secondary"
                onClick={resetForm}
                type="button"
                disabled={loading}
              >
                Reset
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
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
                    Adding Book...
                  </>
                ) : 'Add Book'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddBook; 