import React, { Component } from 'react';
import { Container, Row, Col, Table, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import TournamentTable from './TournamentTable';

class RoundRobinPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPlayerName: '',
            players: [],
            matches: []
        };
    };

    componentDidMount = () => {
        Promise.all([axios.get('/players'), axios.get('/matches')]).then(values => {
            console.log(values);
            this.setState({
                players: values[0].data.players,
                matches: values[1].data.matches
            });
            console.log(this.state);
        }).catch(err => {
            console.log(err);
        });

    };

    handleChange = event => {
        // Extract name & value from event target and set to state - newPlayerName
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    submitPlayerForm = event => {
        axios.post('/players', {
            name: this.state.newPlayerName
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        event.target.reset();
    };

    submitRoundForm = event => {
        event.preventDefault();
        const players = this.state.players;
        let matches = [];
        let promises = [];
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push({ pOne: players[i].name, pTwo: players[j].name });
                promises.push(axios.post('/matches', { pOne: players[i].name, pTwo: players[j].name }));
            };
        };
        Promise.all(promises).then(values => {
            this.setState({
                matches: values.map(value => {
                    return value.data.match
                })
            });
        }).catch(err => {
            console.log(err);
        });
    };

    endMatch = event => {
        console.log('match ended, point incremented');
        console.log(`Winner: ${event.target.value}`);
    };

    render = () => {

        let hideEl = '';
        if (this.state.matches.length > 0) {
            hideEl = 'd-none';
        };

        const players = this.state.players;

        const renderPlayers = players.map(player => {
            return <th key={player._id} className='text-center'>{player.name}</th>
        });
        const renderPoints = players.map(player => {
            return <td key={player._id} className='text-center'>{player.points}</td>
        });

        return (
            <Container>
                <Row>
                    <Col>
                        RoundRobinPage
                    </Col>
                </Row>
                <br />
                <Row className={hideEl}>
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
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Players:</th>
                                    {renderPlayers}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Points:</th>
                                    {renderPoints}
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TournamentTable
                            submitRoundForm={this.submitRoundForm}
                            endMatch={this.endMatch}
                            matches={this.state.matches}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form className={hideEl} inline onSubmit={this.submitRoundForm}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Ready to start round?</Label>
                            </FormGroup>
                            <Button color='danger'>Start</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    };

};

export default RoundRobinPage;
