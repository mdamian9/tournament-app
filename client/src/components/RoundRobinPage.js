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
            points: [],
            matches: [],
            nextRoundPlayers: [],
        };
    };

    componentDidMount = () => {
        Promise.all([axios.get('/players'), axios.get('/matches')]).then(values => {
            console.log(values);
            this.setState({
                players: values[0].data.players,
                points: values[0].data.players.map(player => {
                    return player.points;
                }),
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

    submitNewPlayerForm = event => {
        event.preventDefault();
        let nextRoundPlayers = this.state.nextRoundPlayers;
        nextRoundPlayers.push(this.state.newPlayerName);
        this.setState({
            nextRoundPlayers: this.state.nextRoundPlayers
        });
        console.log(this.state.nextRoundPlayers);

        event.target.reset();
    };

    submitRoundForm = event => {
        event.preventDefault();
        const players = this.state.players;
        let promises = [];
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
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

    submitNextRound = event => {
        event.preventDefault();
        console.log('submit next round');
    };

    endMatch = (event) => {
        // event.preventDefault();
        console.log(`Winner: ${event.target.value}`);
        // Winner of match
        const winner = event.target.value;
        // MongoDB id of match
        const matchId = event.target.getAttribute('match_id');
        // Current points of winner before adding point
        const winnerPoints = this.state.players.filter(player => {
            return player.name === winner;
        })[0].points;

        // axios.patch(`/players/${winner}`, { points: winnerPoints + 1 }).then(res => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // });


        Promise.all([
            axios.patch(`/players/${winner}`, { points: winnerPoints + 1 }),
            axios.delete(`/matches/${matchId}`),
            axios.get('/players'),
            axios.get('/matches')
        ]).then(values => {
            console.log(values);
            this.setState({
                points: values[2].data.players.map(player => {
                    return player.points;
                }),
                matches: values[3].data.matches
            });
        }).catch(err => {
            console.log(err);
        });
        
    };

    render = () => {

        let hideEl = '', hideNextRound = 'd-none';
        if (this.state.matches.length > 0) {
            hideEl = 'd-none';
        };
        if (this.state.players.length > 0 && this.state.matches.length < 1) {
            hideNextRound = '';
            hideEl = 'd-none';
        };

        const players = this.state.players;

        const renderPlayers = players.map(player => {
            return <th key={player._id} className='text-center'>{player.name}</th>
        });
        const renderPoints = this.state.points.map(playerPoints => {
            // encountering with same key problem
            // console.log(this.state.points.indexOf(playerPoints));
            return <td key={this.state.points.indexOf(playerPoints) + 1} className='text-center'>{playerPoints}</td>
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
                <Row className={hideNextRound}>
                    <Col>
                        <Form inline onSubmit={this.submitNewPlayerForm}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Player name:</Label>
                                <Input type='text' name="newPlayerName" id='new-player=name'
                                    placeholder='Enter player name' onChange={this.handleChange} />
                            </FormGroup>
                            <Button color='primary'>Submit</Button>
                        </Form>
                    </Col>
                </Row>
                <br className={hideNextRound} />
                <Row className={hideNextRound}>
                    <Col>
                        <Form inline onSubmit={this.submitNextRound}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Ready to start next round?</Label>
                            </FormGroup>
                            <Button color='danger'>Start</Button>
                        </Form>
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
                <Row className={hideEl}>
                    <Col>
                        <Form inline onSubmit={this.submitRoundForm}>
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

// Figure out key thing with renderPoints
// Finish updating points with state / 
