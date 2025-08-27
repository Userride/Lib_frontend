import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    fetchBooks();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.id.toString().includes(searchTerm)
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);
  
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/books');
      setBooks(res.data);
      setFilteredBooks(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch books');
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleShowDeleteModal = (book) => {
    setBookToDelete(book);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setBookToDelete(null);
  };
  
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    try {
      setDeleting(true);
      await axios.delete(`/books/${bookToDelete.id}`);
      setBooks(books.filter(book => book.id !== bookToDelete.id));
      setShowModal(false);
      setBookToDelete(null);
    } catch (err) {
      setError(`Failed to delete book: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setDeleting(false);
    }
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
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Books</h1>
        <Link to="/admin/books/add">
          <Button variant="primary">Add New Book</Button>
        </Link>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search books by title, author, subject or ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button 
              variant="outline-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </InputGroup>
      </div>
      
      {filteredBooks.length === 0 ? (
        <Alert variant="info">
          No books found. {searchTerm ? 'Try a different search term.' : 'Add some books to get started.'}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Subject</th>
                <th>Semester</th>
                <th>Status</th>
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
                  <td>{book.semester}</td>
                  <td>
                    <span className={`badge ${book.available ? 'bg-success' : 'bg-danger'}`}>
                      {book.available ? 'Available' : 'Issued'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/books/${book.id}`} className="me-2">
                      <Button variant="outline-primary" size="sm">View</Button>
                    </Link>
                    <Link to={`/admin/books/edit/${book.id}`} className="me-2">
                      <Button variant="outline-warning" size="sm">Edit</Button>
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleShowDeleteModal(book)}
                      disabled={!book.available}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the book "{bookToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteBook}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Book'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageBooks; 