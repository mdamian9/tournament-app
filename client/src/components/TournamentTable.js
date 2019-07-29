import React from 'react';
import { Table, Form, FormGroup, Label, Button } from 'reactstrap';

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

const TournamentTable = (props) => {

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
                                    <MatchesTableRows matches={props.matches} />
                                </tbody>
                            </Table>
                        </td>
                    </tr>
                </thead>
            </Table>
            <Form inline onSubmit={props.submitRoundForm}>
                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                    <Label for='new-player-name' className='mr-sm-2'>Ready to start round?</Label>
                </FormGroup>
                <Button color='danger'>Start</Button>
            </Form>
        </div>
    );
};

export default TournamentTable;
