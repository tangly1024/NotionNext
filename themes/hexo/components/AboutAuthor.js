
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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