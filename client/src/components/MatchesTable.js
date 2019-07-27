import React from 'react';
import { Table } from 'reactstrap';
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

const MatchesTable = ({ players }) => {
    let matches = [];
    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i + 1; j < players.length; j++) {
            matches.push({ pOne: players[i], pTwo: players[j] });
            axios.post('/matches', { pOne: players[i], pTwo: players[j] }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        };
    };
    return (
        <Table>
            <thead>
                <tr>
                    <th>
                        Matches
                    </th>
                </tr>
            </thead>
            <tbody>
                <MatchesTableRows matches={matches} />
            </tbody>
        </Table>
    );
};

export default MatchesTable;
