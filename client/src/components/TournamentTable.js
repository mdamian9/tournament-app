import React from 'react';
import { Table, Button } from 'reactstrap';

const MatchTableRow = ({ match, num, endMatch }) => {
    return (
        <tr>
            <th scope='row'><b>Match #{num}:</b></th>
            <td>
                <Button onClick={endMatch} color='primary' value={match.pOne}>{match.pOne}</Button>
                &ensp;vs.&ensp;
                <Button onClick={endMatch} color='danger' value={match.pTwo}>{match.pTwo}</Button>
            </td>
        </tr>
    );
};

const MatchesTableRows = ({ matches, endMatch }) => {
    let renderMatches = [];
    for (let i = 0; i < matches.length; i++) {
        // change key to MongoDB id *
        renderMatches.push(<MatchTableRow key={i} num={i + 1} match={matches[i]} endMatch={endMatch} />)
    };
    return renderMatches;
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
