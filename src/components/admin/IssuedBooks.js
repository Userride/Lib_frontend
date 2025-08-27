import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup, Spinner, Alert, Tabs, Tab, Badge, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const IssuedBooks = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sendingReminders, setSendingReminders] = useState(false);
  const [reminderSuccess, setReminderSuccess] = useState(false);
  const [reminderResults, setReminderResults] = useState(null);
  
  // Return book modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [issueToReturn, setIssueToReturn] = useState(null);
  const [returning, setReturning] = useState(false);
  
  // Reminders modal
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentFilter = queryParams.get('student');
  
  useEffect(() => {
    fetchIssues();
  }, []);
  
  useEffect(() => {
    filterIssues();
  }, [searchTerm, issues, activeTab]);
  
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/issues');
      
      // Sort issues - most recent first
      const sortedIssues = res.data.sort((a, b) => 
        new Date(b.issueDate) - new Date(a.issueDate)
      );
      
      setIssues(sortedIssues);
      
      // If student filter is applied from URL
      if (studentFilter) {
        setActiveTab('all');
        setFilteredIssues(sortedIssues.filter(issue => 
          issue.student._id === studentFilter
        ));
      } else {
        filterIssues(sortedIssues);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch issued books');
      setLoading(false);
    }
  };
  
  const filterIssues = (issuesList = issues) => {
    // First filter by tab
    let filtered = issuesList;
    if (activeTab === 'issued') {
      filtered = issuesList.filter(issue => issue.status === 'issued');
    } else if (activeTab === 'returned') {
      filtered = issuesList.filter(issue => issue.status === 'returned');
    } else if (activeTab === 'overdue') {
      const now = new Date();
      filtered = issuesList.filter(issue => 
        issue.status === 'issued' && new Date(issue.dueDate) < now
      );
    }
    
    // Then filter by search term if provided
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(issue => 
        issue.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.student.studentId && issue.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // If student filter is applied from URL
    if (studentFilter) {
      filtered = filtered.filter(issue => 
        issue.student._id === studentFilter
      );
    }
    
    setFilteredIssues(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days overdue
  const calculateDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (now <= due) return 0;
    
    const diffTime = Math.abs(now - due);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Return book handlers
  const handleShowReturnModal = (issue) => {
    setIssueToReturn(issue);
    setShowReturnModal(true);
  };
  
  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
    setIssueToReturn(null);
  };
  
  const handleReturnBook = async () => {
    if (!issueToReturn) return;
    
    try {
      setReturning(true);
      const res = await axios.put(`/issues/${issueToReturn._id}/return`);
      
      // Update the issues list
      setIssues(issues.map(issue => 
        issue._id === issueToReturn._id ? res.data : issue
      ));
      
      setShowReturnModal(false);
      setIssueToReturn(null);
    } catch (err) {
      setError(`Failed to return book: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setReturning(false);
    }
  };
  
  // Send reminders handlers
  const handleShowReminderModal = () => {
    setShowReminderModal(true);
  };
  
  const handleCloseReminderModal = () => {
    setShowReminderModal(false);
    setReminderResults(null);
  };
  
  const handleSendReminders = async () => {
    try {
      setSendingReminders(true);
      const res = await axios.post('/issues/reminders');
      setReminderResults(res.data);
      setReminderSuccess(true);
    } catch (err) {
      setError(`Failed to send reminders: ${err.response?.data?.message || 'Server error'}`);
    } finally {
      setSendingReminders(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading issued books...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {studentFilter ? 'Student Books' : 'Issued Books'}
          {studentFilter && issues.length > 0 && (
            <small className="d-block text-muted">
              {issues[0].student.name}
            </small>
          )}
        </h1>
        
        <div>
          {activeTab === 'overdue' && filteredIssues.length > 0 && (
            <Button 
              variant="warning" 
              className="me-2"
              onClick={handleShowReminderModal}
            >
              Send Reminders
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {reminderSuccess && (
        <Alert variant="success" dismissible onClose={() => setReminderSuccess(false)}>
          Reminders sent successfully!
        </Alert>
      )}
      
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search by book title, author, student name or ID"
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
      
      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="mb-4"
      >
        <Tab eventKey="all" title="All Issues">
          {renderIssuesTable(filteredIssues)}
        </Tab>
        <Tab eventKey="issued" title="Currently Issued">
          {renderIssuesTable(filteredIssues)}
        </Tab>
        <Tab eventKey="returned" title="Returned">
          {renderIssuesTable(filteredIssues)}
        </Tab>
        <Tab 
          eventKey="overdue" 
          title={
            <span>
              Overdue
              {issues.filter(issue => 
                issue.status === 'issued' && new Date(issue.dueDate) < new Date()
              ).length > 0 && (
                <Badge bg="danger" className="ms-2">
                  {issues.filter(issue => 
                    issue.status === 'issued' && new Date(issue.dueDate) < new Date()
                  ).length}
                </Badge>
              )}
            </span>
          }
        >
          {renderIssuesTable(filteredIssues)}
        </Tab>
      </Tabs>
      
      {/* Return Book Modal */}
      <Modal show={showReturnModal} onHide={handleCloseReturnModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Book Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you confirming the return of:</p>
          <h5>"{issueToReturn?.book.title}"</h5>
          <p>Borrowed by: <strong>{issueToReturn?.student.name}</strong></p>
          
          {issueToReturn && new Date(issueToReturn.dueDate) < new Date() && (
            <Alert variant="warning">
              This book is overdue by <strong>{calculateDaysOverdue(issueToReturn.dueDate)} days</strong>. 
              A fine of <strong>${(calculateDaysOverdue(issueToReturn.dueDate) * 1).toFixed(2)}</strong> may apply.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReturnModal}>Cancel</Button>
          <Button 
            variant="success" 
            onClick={handleReturnBook}
            disabled={returning}
          >
            {returning ? 'Processing...' : 'Confirm Return'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Send Reminders Modal */}
      <Modal show={showReminderModal} onHide={handleCloseReminderModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Send Overdue Reminders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!reminderResults ? (
            <>
              <p>You are about to send SMS reminders to <strong>{filteredIssues.length}</strong> students with overdue books.</p>
              <Alert variant="info">
                <strong>Note:</strong> SMS reminders will only be sent to students who have provided a phone number.
              </Alert>
            </>
          ) : (
            <>
              <h5>Reminder Results</h5>
              <Alert variant="success">
                Successfully sent <strong>{reminderResults.totalSent}</strong> reminders.
              </Alert>
              
              {reminderResults.totalFailed > 0 && (
                <Alert variant="warning">
                  Failed to send <strong>{reminderResults.totalFailed}</strong> reminders.
                </Alert>
              )}
              
              {reminderResults.remindersSent.length > 0 && (
                <div className="mb-3">
                  <h6>Successfully Sent:</h6>
                  <ul>
                    {reminderResults.remindersSent.map((reminder, index) => (
                      <li key={index}>
                        {reminder.student} - {reminder.book}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {reminderResults.failedReminders.length > 0 && (
                <div>
                  <h6>Failed:</h6>
                  <ul>
                    {reminderResults.failedReminders.map((reminder, index) => (
                      <li key={index}>
                        {reminder.student} - {reminder.book} (Reason: {reminder.reason})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReminderModal}>
            {reminderResults ? 'Close' : 'Cancel'}
          </Button>
          {!reminderResults && (
            <Button 
              variant="warning" 
              onClick={handleSendReminders}
              disabled={sendingReminders}
            >
              {sendingReminders ? 'Sending...' : 'Send Reminders'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
  
  function renderIssuesTable(issues) {
    if (issues.length === 0) {
      return (
        <Alert variant="info">
          No books found. {searchTerm ? 'Try a different search term.' : 'No records in this category.'}
        </Alert>
      );
    }
    
    return (
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>Book</th>
              <th>Student</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Fine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => {
              const isOverdue = issue.status === 'issued' && new Date(issue.dueDate) < new Date();
              const daysOverdue = isOverdue ? calculateDaysOverdue(issue.dueDate) : 0;
              
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
                  <td>
                    <div>
                      <span>{issue.student.name}</span>
                      {issue.student.studentId && (
                        <small className="d-block text-muted">ID: {issue.student.studentId}</small>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(issue.issueDate)}</td>
                  <td>{formatDate(issue.dueDate)}</td>
                  <td>
                    {issue.status === 'returned' ? (
                      <Badge bg="success">Returned</Badge>
                    ) : isOverdue ? (
                      <Badge bg="danger">Overdue by {daysOverdue} days</Badge>
                    ) : (
                      <Badge bg="warning">Issued</Badge>
                    )}
                  </td>
                  <td>
                    {issue.fine > 0 ? (
                      <span className="text-danger">${issue.fine.toFixed(2)}</span>
                    ) : isOverdue ? (
                      <span className="text-danger">${(daysOverdue * 1).toFixed(2)}</span>
                    ) : (
                      '$0.00'
                    )}
                  </td>
                  <td>
                    {issue.status === 'issued' && (
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleShowReturnModal(issue)}
                      >
                        Return
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
};

export default IssuedBooks; 