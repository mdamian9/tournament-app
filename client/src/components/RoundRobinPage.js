import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class RoundRobinPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    };

    componentDidMount = () => {
        console.log(this.state);
    };

    render = () => {
        return (
            <Container>
                <Row>
                    <Col>
                        RoundRobinPage
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Form inline>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for='player-name' className='mr-sm-2'>Player name:</Label>
                                <Input type='text' name="playerName" id='player=name' placeholder='Enter player name' />
                            </FormGroup>
                            <Button>Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    };

};

export default RoundRobinPage;
