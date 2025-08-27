import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/students');
      setStudents(res.data);
      setFilteredStudents(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleShowDeleteModal = (student) => {
    setStudentToDelete(student);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setStudentToDelete(null);
  };
  
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      setDeleting(true);
      await axios.delete(`/users/${studentToDelete._id}`);
      setStudents(students.filter(student => student._id !== studentToDelete._id));
      setShowModal(false);
      setStudentToDelete(null);
    } catch (err) {
      setError(`Failed to delete student: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setDeleting(false);
    }
  };
  
  // Function to check if a student has any issued books
  const fetchStudentBooksCount = async (studentId) => {
    try {
      const res = await axios.get(`/issues/student/${studentId}`);
      return res.data.filter(issue => issue.status === 'issued').length;
    } catch (err) {
      console.error('Error fetching student books:', err);
      return 0;
    }
  };
  
  // Handle view issued books
  const viewIssuedBooks = (studentId) => {
    // This would typically navigate to a student-specific issued books page
    window.location.href = `/admin/issued-books?student=${studentId}`;
  };
  
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading students...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">Manage Students</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search students by name, email or student ID"
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
      
      {filteredStudents.length === 0 ? (
        <Alert variant="info">
          No students found. {searchTerm ? 'Try a different search term.' : 'Students need to register to appear here.'}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.studentId || 'N/A'}</td>
                  <td>{student.phone || 'N/A'}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => viewIssuedBooks(student._id)}
                    >
                      Books
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleShowDeleteModal(student)}
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
          <p>Are you sure you want to delete the student "{studentToDelete?.name}"?</p>
          <p className="text-danger">
            Warning: This action cannot be undone. If the student has any issued books, 
            they must be returned before the account can be deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteStudent}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Student'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageStudents; 