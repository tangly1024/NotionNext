
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AboutAuthor from './AboutAuthor'; // Add import statement for AboutAuthor
import AboutProject from './AboutProject'; // Add import statement for AboutProject

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