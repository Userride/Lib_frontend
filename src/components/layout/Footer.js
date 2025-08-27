import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <h5>Library Management System</h5>
            <p className="small">Manage your books efficiently</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0">&copy; {new Date().getFullYear()} Library Management</p>
            <p className="small">MERN Stack Project</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 