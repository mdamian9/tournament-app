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
        // axios.get('/players').then(res => {
        //     this.setState({
        //         players: res.data.players
        //     });
        // }).catch(err => {
        //     console.log(err);
        // });

        // axios.get('/matches').then(res => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })

        let promises = [axios.get('/players'), axios.get('/matches')];
        Promise.all(promises).then(values => {
            console.log(values);
            this.setState({
                players: values[0].data.players,
                matches: values[1].data.matches
            });
        }).catch(err => {
            console.log(err);
        });

    };

    componentDidUpdate = () => {
        console.log('updated rrp');
    };

    // componentDidMount = () => {
    //     console.log('TT');
    //     console.log(this.state);
    //     const players = this.props.players;
    //     let matches = [];
    //     let promises = [];
    //     for (let i = 0; i < players.length - 1; i++) {
    //         for (let j = i + 1; j < players.length; j++) {
    //             matches.push({ pOne: players[i].name, pTwo: players[j].name });
    //             // promises.push(axios.post('/matches', { pOne: players[i].name, pTwo: players[j].name })
    //             //     // .catch(err => {
    //             //     //     console.log(err);
    //             //     // })
    //             // );
    //         };
    //     };
    //     console.log(matches);
    //     // this.setState({
    //     //     matches: matches
    //     // });
    // };


    handleChange = event => {
        // Extract name & value from event target and set to state - newPlayerName
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    submitPlayerForm = event => {
        // event.preventDefault();
        // this.state.players.push(this.state.newPlayerName);
        // console.log(this.state.players);

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

    };

    render = () => {

        console.log('rendered rrp');
        console.log(this.state);

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
                        <TournamentTable players={this.state.players}
                            submitRoundForm={this.submitRoundForm} ready={this.state.ready}
                            matches={this.state.matches} />
                    </Col>
                </Row>
            </Container>
        );
    };

};

export default RoundRobinPage;
