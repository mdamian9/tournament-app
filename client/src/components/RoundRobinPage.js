import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import MatchesTable from './MatchesTable';

class RoundRobinPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            newPlayerName: '',
            ready: false
        };
    };

    componentDidMount = () => {
        console.log(this.state);
    };

    componentDidUpdate = () => {
        // console.log(this.state.newPlayerName);
    };

    handleChange = event => {
        // Extract name & value from event target and set to state - newPlayerName
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    submitPlayerForm = event => {
        event.preventDefault();
        this.state.players.push(this.state.newPlayerName);
        console.log(this.state.players);
        event.target.reset();
    };

    submitRoundForm = event => {
        event.preventDefault();
        this.setState({
            ready: true
        });
        console.log(this.state.players);
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
                        <Form inline onSubmit={this.submitPlayerForm}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Player name:</Label>
                                <Input type='text' name="newPlayerName" id='new-player=name'
                                    placeholder='Enter player name' onChange={this.handleChange} />
                            </FormGroup>
                            <Button color='primary'>Submit</Button>
                        </Form>
                    </Col>
                    <Col>
                        <Form inline onSubmit={this.submitRoundForm}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Ready to play?</Label>
                            </FormGroup>
                            <Button color='danger'>Submit</Button>
                        </Form>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <MatchesTable players={this.state.players} />
                    </Col>
                </Row>
            </Container>
        );
    };

};

export default RoundRobinPage;
