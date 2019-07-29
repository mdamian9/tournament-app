import React, { Component } from 'react';
import { Table, Form, FormGroup, Label, Button } from 'reactstrap';
import axios from 'axios';

const MatchTableRow = ({ match, num }) => {
    return (
        <tr>
            <th scope='row'><b>Match #{num}:</b></th>
            <td>{match.pOne} vs. {match.pTwo}</td>
        </tr>
    );
};

const MatchesTableRows = ({ matches }) => {
    let renderMatches = [];
    for (let i = 0; i < matches.length; i++) {
        // change key to MongoDB id * ?
        renderMatches.push(<MatchTableRow key={i} num={i + 1} match={matches[i]} />)
    };
    return renderMatches;
};

class TournamentTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            ready: false
        };
    };

    submitRoundForm = event => {
        event.preventDefault();
        this.setState({
            ready: true
        });
    };

    componentDidUpdate = () => {
        console.log('TournamentTable did update');
        console.log(this.state);
    };

    render = () => {
        let hideEl = 'd-none';
        if (this.state.ready === true) {
            hideEl = '';
        };
        const players = this.props.players;
        let matches = [];
        // let promises = [];
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push({ pOne: players[i].name, pTwo: players[j].name });
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
                        <tr className={hideEl}>
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
