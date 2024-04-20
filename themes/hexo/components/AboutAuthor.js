
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AboutAuthor from './AboutAuthor';
import AboutProject from './AboutProject'; // Add missing import statement

const App = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <AboutAuthor />
                </Col>
                <Col>
                    <AboutProject />
                </Col>
            </Row>
        </Container>
    );
};

export default App;