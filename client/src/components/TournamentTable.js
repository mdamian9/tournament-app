import React, { Component } from 'react';
import { Table, Form, FormGroup, Label, Button } from 'reactstrap';
import axios from 'axios';

const MatchTableRow = ({ match }) => {
    return (
        <tr>
            <th scope='row'><b>Match:</b></th>
            <td>{match.pOne} vs. {match.pTwo}</td>
        </tr>
    );
};

const MatchesTableRows = ({ matches }) => {
    return matches.map(match => {
        return <MatchTableRow match={match} />
    });
};

class TournamentTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            ready: false
        };
    };

    componentDidMount = () => {
        axios.get('/players').then(res => {
            console.log(res);
            this.setState({
                players: res.data.players.map(player => {
                    return player.name
                })
            });
            console.log(this.state);
        }).catch(err => {
            console.log(err);
        });

    };

    submitRoundForm = event => {
        event.preventDefault();
        this.setState({
            ready: true
        });
        console.log(this.state.ready);
    };

    render = () => {
        let hideMatches = 'd-none';
        if (this.state.ready === true) {
            hideMatches = '';
        };
        const players = this.state.players;
        let playersStr = '';
        for (let i = 0; i < players.length; i++) {
            if (i === players.length - 1) {
                playersStr = `${playersStr}${players[i]}`
            } else {
                playersStr = `${playersStr}${players[i]}, `;
            };
        };

        let matches = [];
        // let promises = [];
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push({ pOne: players[i], pTwo: players[j] });
                // promises.push(axios.post('/matches', { pOne: players[i], pTwo: players[j] }));
            };
        };
        // Promise.all(promises).then(values => {
        //     values.forEach(value => {
        //         console.log(value);
        //     });
        // });
        // console.log(promises);
        return (
            <div>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>
                                Players:
                            </th>
                            <td>
                                {playersStr}
                            </td>
                        </tr>
                        <tr className={hideMatches}>
                            <th className='align-middle'>
                                Matches:
                            </th>
                            <td>
                                <Table bordered>
                                    <tbody>
                                        <MatchesTableRows matches={matches} />
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                    </thead>
                </Table>
                <Form inline onSubmit={this.submitRoundForm}>
                    <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                        <Label for='new-player-name' className='mr-sm-2'>Ready to play?</Label>
                    </FormGroup>
                    <Button color='danger'>Start</Button>
                </Form>
            </div>
        );
    };

};

export default TournamentTable;
