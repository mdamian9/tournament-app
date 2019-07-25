import React, { Component } from 'react';

class UserHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'User'
        };
    };

    render = () => {
        return (
            <div>
                UserHomePage
            </div>
        );
    };
};

export default UserHomePage;
