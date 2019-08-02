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
            inProgress: false
        };
    };

    componentDidMount = () => {
        Promise.all([axios.get('/players'), axios.get('/matches'), axios.get('/tournaments')]).then(values => {
            let inProgress = false;
            if (values[2].data.count > 0) {
                inProgress = true;
            };
            this.setState({
                players: values[0].data.players,
                points: values[0].data.players.map(player => {
                    return player.points;
                }),
                matches: values[1].data.matches,
                inProgress: inProgress
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
        nextRoundPlayers.push(this.state.players.filter(player => {
            return player.name === this.state.newPlayerName
        })[0]);
        nextRoundPlayers.forEach(player => {
            player.points = 0;
        });
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
                }),
            });
        }).catch(err => {
            console.log(err);
        });
        axios.post('/tournaments', { inProgress: true }).then(res => {
            console.log(res);
            this.setState({
                inProgress: true
            });
            console.log(this.state.inProgress);
        }).catch(err => {
            console.log(err);
        });
    };

    submitNextRound = event => {
        event.preventDefault();
        const players = this.state.nextRoundPlayers;

        // First delete old round players to insert next round players to db
        axios.delete('/players').then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });

        // Hold different promises for Promise.all
        let newPlayerPromises = [], newMatchPromises = [];
        players.forEach(player => {
            newPlayerPromises.push(axios.post('/players', player));
        });
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                newMatchPromises.push(axios.post('/matches', { pOne: players[i].name, pTwo: players[j].name }));
            };
        };
        // Create next round players in db
        Promise.all(newPlayerPromises).then(values => {
            console.log(values);
        }).catch(err => {
            console.log(err);
        });
        // Create new matches for next round and set to state
        Promise.all(newMatchPromises).then(values => {
            console.log(values);
        }).catch(err => {
            console.log(err);
        });
        // Get new set of players and matches from db and set to state
        Promise.all([axios.get('/players'), axios.get('/matches')]).then(values => {
            this.setState({
                players: values[0].data.players,
                points: values[0].data.players.map(player => {
                    return player.points
                }),
                matches: values[1].data.matches
            });
        });
        console.log(this.state);
    };

    endMatch = event => {
        event.preventDefault();
        // Winner of match
        const winner = event.target.value;
        // MongoDB id of match
        const matchId = event.target.getAttribute('match_id');
        // Current points of winner before adding point
        const winnerPoints = this.state.players.filter(player => {
            return player.name === winner;
        })[0].points;

        Promise.all([
            axios.patch(`/players/${winner}`, { points: (winnerPoints + 1) }),
            axios.delete(`/matches/${matchId}`),
            axios.get('/players'),
            axios.get('/matches')
        ]).then(values => {
            console.log(values);
            this.setState({
                players: values[2].data.players,
                points: values[2].data.players.map(player => {
                    return player.points;
                }),
                matches: values[3].data.matches
            });
            console.log(this.state);
        }).catch(err => {
            console.log(err);
        });

    };

    render = () => {

        let hideNewPlForm = '', hideSubmitRound = '', hideNextPlForm = 'd-none', hideSubmitNextRound = '',
            hideNextRoundPlayers = 'd-none';
        // Don't display submit round button until there are 3 or more players
        if (this.state.players.length < 3) {
            hideSubmitRound = 'd-none';
        };
        // If there are matches, a tournament is underway - hide all forms and buttons until round is over
        if (this.state.matches.length < 1) {
            hideSubmitNextRound = 'd-none';
        } else {
            hideNewPlForm = 'd-none';
            hideSubmitRound = 'd-none';
        };
        // Don't display submit next round button until there are 2 or more players in next round
        if (this.state.nextRoundPlayers.length < 2) {
            hideSubmitNextRound = 'd-none';
        };
        // If round is over - display only the appropriate buttons and forms to continue to next round
        if (this.state.players.length > 0 && this.state.matches.length < 1 && this.state.inProgress === true) {
            hideNextPlForm = '';
            hideNewPlForm = 'd-none';
            hideSubmitRound = 'd-none';
            hideNextRoundPlayers = '';
            if (this.state.nextRoundPlayers.length >= 2) {
                hideSubmitNextRound = '';
            };
        };
        // If we are in final round (1 v 1) don't show certain elements
        if (this.state.players.length === 2) {
            hideNextPlForm = 'd-none';
            hideSubmitNextRound = 'd-none';
            hideNextRoundPlayers = 'd-none';
        };

        const renderPlayers = this.state.players.map(player => {
            return <th key={player._id} className='text-center'>{player.name}</th>
        });

        const renderPoints = () => {
            let points = [];
            for (let i = 0; i < this.state.points.length; i++) {
                points.push(<td key={i} className='text-center'>{this.state.points[i]}</td>)
            };
            return points;
        };

        const renderNextRoundPlayers = this.state.nextRoundPlayers.map(player => {
            return <th key={player._id} className='text-center'>{player.name}</th>
        })

        return (
            <Container>
                <Row>
                    <Col>
                        RoundRobinPage
                    </Col>
                </Row>
                <br />
                <Row className={hideNewPlForm}>
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
                                    {renderPoints()}
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
                <Row className={hideNextPlForm}>
                    <Col>
                        <Form inline onSubmit={this.submitNewPlayerForm}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Player name (next round):</Label>
                                <Input type='text' name="newPlayerName" id='new-player=name'
                                    placeholder='Enter player name' onChange={this.handleChange} />
                            </FormGroup>
                            <Button color='primary'>Submit</Button>
                        </Form>
                    </Col>
                </Row>
                <br className={hideNextRoundPlayers} />
                <Row className={hideNextRoundPlayers}>
                    <Col>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Next Round Players:</th>
                                    {renderNextRoundPlayers}
                                </tr>
                            </thead>
                        </Table>
                    </Col>
                </Row>
                <br className={hideSubmitNextRound} />
                <Row className={hideSubmitNextRound}>
                    <Col>
                        <Form inline onSubmit={this.submitNextRound}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Ready to start next round?</Label>
                            </FormGroup>
                            <Button color='danger'>Start</Button>
                        </Form>
                    </Col>
                </Row>
                <Row className={hideSubmitRound}>
                    <Col>
                        <Form inline onSubmit={this.submitRoundForm}>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                <Label for='new-player-name' className='mr-sm-2'>Ready to start round?</Label>
                            </FormGroup>
                            <Button color='danger'>Start</Button>
                        </Form>
                    </Col>
                </Row>
                <br />
            </Container>
        );

    };

};

export default RoundRobinPage;
