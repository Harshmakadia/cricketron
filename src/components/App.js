import '../assets/css/App.css';
import '../assets/css/accordion.css';
import React, {Component} from 'react';
import {ipcRenderer} from 'electron';
import sanitizeHTML from 'sanitize-html';
// import cricLive from '../../../npm-cricbuzz';
import cricLive from 'cric-live';
import {Panel, Row, Col, Button} from 'react-bootstrap';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

const scoreMapper = {
    4: 'FOUR',
    6: 'SIX',
    W: 'WICKET',
}

ipcRenderer.on('open-sms', (event, filename) => {
    console.log('sms setting open');
});


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isFourEnabled: true,
            isSixEnabled: true,
            isWicketEnabled: true,
            currentMatchId: "",
            currentMatch: "No Match Selected",
            interval: 20,
            over: "0",
            intervalValue: "",
            shouldShowTMC: ""
        }
        this.triggerNotification = this.triggerNotification.bind(this);
        this.updateFour = this.updateFour.bind(this);
        this.updateSix = this.updateSix.bind(this);
        this.updateWicket = this.updateWicket.bind(this);
        this.getLiveScore = this.getLiveScore.bind(this);
        this.cronjobNotification = this.cronjobNotification.bind(this);
        this.updateIntervalValue = this.updateIntervalValue.bind(this);
        this.shouldShowTMC = this.shouldShowTMC.bind(this);
        this.openExternalURL = this.openExternalURL.bind(this);
    }

    componentWillMount() {
        this.setState({currentMatches: []});
        cricLive.getRecentMatches()
            .then(currentMatches => {
                console.log('DEBUG', '40 ', currentMatches);
                this.setState({currentMatches})
            })
    }

    triggerNotification(type, data) {
        // send notification example
        ipcRenderer.send('notification', {
            type, data
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

    updateIntervalValue(e) {
        //Update Interval Value here
        this.setState({intervalValue: e.target.value});
    }

    getLiveScore(id) {
        cricLive.getLiveScore(id)
            .then(liveMatchScore => {
                console.log('DEBUG', '46 ', liveMatchScore);
                console.log("last Ball", liveMatchScore.score.lastBallDetail.score);
                console.log("Over", liveMatchScore.score.detail.batting.overs);
                const lastBallScore = liveMatchScore.score.lastBallDetail.score;
                const over = liveMatchScore.score.detail.batting.overs;
                const wickets = liveMatchScore.score.detail.batting.wickets;
                const score = liveMatchScore.score.detail.batting.score;
                const teamName = liveMatchScore.score.detail.batting.shortName;
                const lastBallDetail = liveMatchScore.score.lastBallDetail;
                if (this.state.over !== over && over !== "0") {
                    if ((lastBallScore === "4" && this.state.isFourEnabled) || (lastBallScore === "6" && this.state.isSixEnabled)) {
                        let message = "";
                        liveMatchScore.score.batsmen.forEach(batsman => {
                            const batsmanName = `${batsman.shortName}${batsman.strike === '1' ? '*' : ''}`;
                            message += `${batsmanName.padEnd(25)} \t${batsman.r}(${batsman.b})\n`
                        });
                        this.triggerNotification(`${scoreMapper[lastBallScore]}`, {
                            title: `${scoreMapper[lastBallScore]} by ${lastBallDetail.batsman[0].shortName} - ${teamName} ${score}/${wickets} (${over})`,
                            message
                        });
                    }
                    if (lastBallScore === "W" && this.state.isWicketEnabled) {
                        const outBatsman = lastBallDetail.batsman[0];
                        this.triggerNotification(`WICKET`, {
                            title: `${scoreMapper[lastBallScore]} - ${outBatsman.shortName} ${outBatsman.r}(${outBatsman.b}) b ${lastBallDetail.bowler[0].shortName}`,
                            message: `${teamName} ${score}/${wickets} - ${sanitizeHTML(lastBallDetail.commentary, {allowedTags: []})}`
                        });
                    }
                }
                let liveScoreMessage = `${teamName} ${score}/${wickets} (${over})`;
                this.setState({over: over, liveScoreMessage: liveScoreMessage});
            })
    }

    cronjobNotification(id, matchTitle) {
        this.getLiveScore(id);
        this.setState({currentMatch: matchTitle, currentMatchId: id});
        const intervalTime = this.state.interval * 1000;
        setInterval(() => {
            this.getLiveScore(id);
        }, intervalTime);
    }

    shouldShowTMC(flag) {
        this.setState({shouldShowTMC: flag});
    }

    openExternalURL(url) {
        require('electron').shell.openExternal(url);
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
                        {currentMatch[i].state === 'innings break' || currentMatch[i].state === 'inprogress' || currentMatch[i].state === 'rain'
                            ?
                            (<div className="notification-content">
                                <div className="notification-title">Get Notification Alerts on</div>
                                <Row className="padding-spacer">
                                    <Col lg={5} md={5} sm={5} xs={12} className="notification-container">
                                        <span className="notification-title-1">
                                            Something Special
                                        </span>
                                        <hr className="custom-divider"/>
                                        <div>
                                            <b>4's</b> <input type="checkbox" value="fours"
                                                              checked={this.state.isFourEnabled}
                                                              onChange={this.updateFour}/>
                                        </div>
                                        <hr className="custom-divider"/>
                                        <div>
                                            <b>6's</b> <input type="checkbox" value="sixes"
                                                              checked={this.state.isSixEnabled}
                                                              onChange={this.updateSix}/>
                                        </div>
                                        <hr className="custom-divider"/>
                                        <div>
                                            <b>Wickets</b> <input type="checkbox" value="wickets"
                                                                  checked={this.state.isWicketEnabled}
                                                                  onChange={this.updateWicket}/>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={2} sm={2} xs={12} className="optional-container">
                                        OR
                                    </Col>
                                    <Col lg={5} md={5} sm={5} xs={12} className="notification-container">
                                        <span className="notification-title-2">
                                            Every
                                        </span>
                                        <hr className="custom-divider"/>
                                        <input type="text" value={this.state.intervalValue}
                                               placeholder="______(In Minutes)"
                                               className="minutes-setting" onChange={this.updateIntervalValue}
                                               autoFocus/>
                                        <hr className="custom-divider"/>
                                        Minutes
                                    </Col>
                                </Row>
                                <Button bsStyle="success" className="save-config-btn"
                                        onClick={() => this.cronjobNotification(currentMatch[i].id, currentMatch[i].title)}>
                                    Enable Notification
                                </Button>
                            </div>) :
                            (<div className="notification-no-match">
                                {currentMatch[i].status} <br/>
                                <i className="tip">(Notifications are only available for live matches)</i>
                            </div>)
                        }
                    </AccordionItemBody>
                </AccordionItem>
            )
        }

        return (
            <div className="container">
                <h1 className="container-header">Hello, Cricket Scores!</h1>
                <h3 className="subtitle">Get live cricket score updates here</h3><br/>
                <Button bsStyle="primary" onClick={() => this.triggerNotification('test', {
                    title: "Hey Stay Tunned",
                    message: "You will receive notification of the Live Matches"
                })}>Try Sample Notification</Button>
                <div className="updates-choosen">
                    <span>Notifications Enabled For :</span> &nbsp;
                    <b>{this.state.currentMatch}</b> <br/>
                    <span
                        className="current-score-detail">{!!this.state.liveScoreMessage ? this.state.liveScoreMessage : ""}</span>
                </div>
                <br/>
                <div>
                    <div>
                        <Accordion>
                            {currentMatchHTML}
                        </Accordion>
                    </div>
                </div>
                <div className="footer-section">
                    <div className="float-left" onMouseEnter={() => this.shouldShowTMC(true)}
                         onMouseLeave={() => this.shouldShowTMC(false)}>
                        <a href="#"> Terms & Conditions</a>
                    </div>
                    <div className="float-right">
                        Made with <span className="craft-style">&#9829;</span> by <a href='#'
                                                                                     onClick={() => this.openExternalURL('https://github.com/Harshmakadia')}>Harsh
                        Makadia</a> & <a href='#'
                                         onClick={() => this.openExternalURL('https://github.com/ridhamtarpara')}>Ridham
                        Tarpara</a>
                    </div>
                </div>
                <br/>
                {this.state.shouldShowTMC &&
                <div className="tmc-section float-left">
                    This tool is developed strictly for <b><i>Non-commercial use</i></b> only
                </div>}
                <div className="back-img"></div>
            </div>
        );
    }
}

export default App;
