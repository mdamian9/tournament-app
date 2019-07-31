import React from 'react';
import { Table, Button } from 'reactstrap';

const MatchTableRow = ({ match, num, endMatch }) => {
    return (
        <tr>
            <th scope='row'><b>Match #{num}:</b></th>
            <td>
                <Button onClick={endMatch} color='primary' value={match.pOne} match_id={match._id}>
                    {match.pOne}
                </Button>
                &ensp;vs.&ensp;
                <Button onClick={endMatch} color='danger' value={match.pTwo} match_id={match._id}>
                    {match.pTwo}
                </Button>
            </td>
        </tr>
    );
};

const MatchesTableRows = ({ matches, endMatch }) => {
    return matches.map(match => {
        return <MatchTableRow key={match._id} num={matches.indexOf(match) + 1} match={match} endMatch={endMatch} />
    })
};

const TournamentTable = props => {

    let hideEl = 'd-none';
    if (props.matches.length > 0) {
        hideEl = '';
    };

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
                                    <MatchesTableRows matches={props.matches} endMatch={props.endMatch} />
                                </tbody>
                            </Table>
                        </td>
                    </tr>
                </thead>
            </Table>
        </div>
    );
};

export default TournamentTable;
