import '../assets/css/App.css';
import React, {Component} from 'react';
import {Panel} from 'react-bootstrap';

const currentMatches = [{
    "id": "20074",
    "type": "T20",
    "series": "Indian Premier League, 2018",
    "title": "MI vs RCB",
    "state": "Result",
    "status": "Mumbai won by 46 runs",
    "teams": [{"name": "Mumbai", "shortName": "MI"}, {"name": "Bangalore", "shortName": "RCB"}],
    "date": "Apr 17 2018",
    "startTime": "14:30"
}, {
    "id": "20073",
    "type": "T20",
    "series": "Indian Premier League, 2018",
    "title": "KKR vs DD",
    "state": "Result",
    "status": "Kolkata won by 71 runs",
    "teams": [{"name": "Kolkata", "shortName": "KKR"}, {"name": "Delhi", "shortName": "DD"}],
    "date": "Apr 16 2018",
    "startTime": "14:30"
}];

class App extends React.Component {
    constructor(){
        super();
        this.triggerNotification = this.triggerNotification.bind(this);
    }

    triggerNotification(){
        console.log('DEBUG', '35 triggerNotification', );
    }

    componentWillMount() {
        console.log('DEBUG', '30 componentWillMount', currentMatches);
        this.setState({currentMatches: currentMatches})
    }

    render() {

        //Parse Current Match JSON
        let currentMatch = this.state.currentMatches;
        let currentMatchHTML = []
        for (let i = 0; i < currentMatch.length; i++) {
            currentMatchHTML.push(
                <div className="single-match-container" key={i} onClick={this.triggerNotification}>
                    <div className="series-name">
                        {currentMatch[i].series}
                    </div>
                    <div className="match-title">
                        {currentMatch[i].startTime} - {currentMatch[i].title} {currentMatch[i].type}
                    </div>
                    <div className="match-status">
                        {currentMatch[i].status}
                    </div>
                </div>
            )
        }

        return (
            <div className="container">
                <h1 className="container-header">Hello, Cricket Score!</h1>
                <Panel>
                    <Panel.Body>Get live cricket score updates here</Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Body>
                        <div>
                            {currentMatchHTML}
                        </div>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default App;
