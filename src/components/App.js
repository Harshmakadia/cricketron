import '../assets/css/App.css';
import '../assets/css/accordion.css';
import React, {Component} from 'react';
import {ipcRenderer} from 'electron';
import cricLive from 'cric-live';
import {Panel, Row, Col, Button} from 'react-bootstrap';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

ipcRenderer.on('open-sms', (event, filename) => {
    console.log('sms setting open');
});


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isFourEnabled: false,
            isSixEnabled: false,
            isWicketEnabled: false,
            currentMatchId: "",
            interval: 20,
            over: "0"
        }
        this.triggerNotification = this.triggerNotification.bind(this);
        this.updateFour = this.updateFour.bind(this);
        this.updateSix = this.updateSix.bind(this);
        this.updateWicket = this.updateWicket.bind(this);
        this.getLiveScore = this.getLiveScore.bind(this);
        this.cronjobNotification = this.cronjobNotification.bind(this);
    }

    componentWillMount() {
        this.setState({currentMatches: []});
        cricLive.getRecentMatches()
            .then(currentMatches => {
                console.log('DEBUG', '40 ', currentMatches);
                this.setState({currentMatches})
            })
    }

    triggerNotification(title, message) {
        // send notification example
        ipcRenderer.send('notification', {
            type: 'basic',
            data: {
                title: title,
                message: message
            }
        })
    }

    updateFour() {
        this.setState({isFourEnabled: !this.state.isFourEnabled});
    };

    updateSix() {
        this.setState({isSixEnabled: !this.state.isSixEnabled});
    };

    updateWicket() {
        this.setState({isWicketEnabled: !this.state.isWicketEnabled});
    }

    getLiveScore(id) {
        cricLive.getLiveScore(id)
            .then(liveMatchScore => {
                console.log('DEBUG', '46 ', liveMatchScore);
                console.log("last Ball", liveMatchScore.score.lastBall);
                console.log("Over", liveMatchScore.score.detail.batting.overs);
                const lastBallScore = liveMatchScore.score.lastBall;
                const over = liveMatchScore.score.detail.batting.overs;
                if (this.state.over !== over && over !== "0") {
                    if (lastBallScore === "4" && this.state.isFourEnabled) {
                        this.triggerNotification(`FOUR`, `${liveMatchScore.score.detail.batting.score}-${liveMatchScore.score.detail.batting.wickets}(${over})`);
                    }
                    if (lastBallScore === "6" && this.state.isSixEnabled) {
                        this.triggerNotification(`SIX`, `${liveMatchScore.score.detail.batting.score}-${liveMatchScore.score.detail.batting.wickets}(${over})`);
                    }
                    if (lastBallScore === "W" && this.state.isWicketEnabled) {
                        this.triggerNotification(`WICKET`, `${liveMatchScore.score.detail.batting.score}-${liveMatchScore.score.detail.batting.wickets}(${over})`);
                    }
                }
                this.setState({over});
            })
    }

    cronjobNotification(id) {
        const intervalTime = this.state.interval * 1000;
        setInterval(() => {
            this.getLiveScore("20077");
        }, intervalTime);
    }


    render() {

        //Parse Current Match JSON
        let currentMatch = this.state.currentMatches;
        let currentMatchHTML = []
        for (let i = 0; i < currentMatch.length; i++) {
            currentMatchHTML.push(
                <AccordionItem key={i}>
                    <AccordionItemTitle>
                        <div className="single-match-container" key={i}>
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
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="notification-title">Get Notification Alerts on</div>
                        <Row className="padding-spacer">
                            <Col lg={5} md={5} sm={5} xs={12} className="notification-container">
                                    <span className="notification-title-1">
                                        Something Special
                                    </span>
                                <div>
                                    4's <input type="checkbox" value="fours"
                                               checked={this.state.isFourEnabled} onChange={this.updateFour}/>
                                </div>
                                <div>
                                    6's <input type="checkbox" value="sixes"
                                               checked={this.state.isSixEnabled} onChange={this.updateSix}/>
                                </div>
                                <div>
                                    Wickets <input type="checkbox" value="wickets"
                                                   checked={this.state.isWicketEnabled} onChange={this.updateWicket}/>
                                </div>
                            </Col>
                            <Col lg={2} md={2} sm={2} xs={12} className="optional-container">
                                OR
                            </Col>
                            <Col lg={5} md={5} sm={5} xs={12} className="notification-container">
                                    <span className="notification-title-2">
                                        Every
                                    </span><br/>
                                <input type="text" className="minutes-setting" autoFocus/> <br/>
                                Minutes
                            </Col>
                        </Row>
                        <Button bsStyle="success" onClick={() => this.cronjobNotification(currentMatch[i].id)}>SAVE</Button>
                    </AccordionItemBody>
                </AccordionItem>
            )
        }

        return (
            <div className="container">
                <h1 className="container-header">Hello, Cricket Score!</h1>
                <Panel>
                    <Panel.Body>Get live cricket score updates here</Panel.Body>
                </Panel>
                <Button bsStyle="primary" onClick={() => this.triggerNotification("Hey Stay Tunned", "You will Notification of the IPL")}>Try Sample Notification</Button>
                <br/>
                <br/>
                <Panel>
                    <Panel.Body>
                        <div>
                            <Accordion>
                                {currentMatchHTML}
                            </Accordion>
                        </div>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default App;
