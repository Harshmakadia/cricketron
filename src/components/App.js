import '../assets/css/App.css';
import '../assets/css/accordion.css';
import React, {Component} from 'react';
import { ipcRenderer } from 'electron';
import cricLive from 'cric-live';
import {Panel,Row,Col, Button} from 'react-bootstrap';
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
    constructor(){
        super();
        this.triggerNotification = this.triggerNotification.bind(this);
    }

    triggerNotification() {
        // send notification example
        ipcRenderer.send('notification', {
            type: 'basic',
            data: {
                title: 'Indian Premier League, 2018 RR vs KKR T20',
                message: 'Kolkata won by 7 wkts!'
            }
        })
    }

    componentWillMount() {
        this.setState({currentMatches: []})
        cricLive.getRecentMatches()
            .then(currentMatches => {
                console.log('DEBUG', '40 ', currentMatches);
                this.setState({ currentMatches })
            })
    }

    render() {

        //Parse Current Match JSON
        let currentMatch = this.state.currentMatches;
        let currentMatchHTML = []
        for (let i = 0; i < currentMatch.length; i++) {
            currentMatchHTML.push(
                    <AccordionItem key={i}>
                        <AccordionItemTitle>
                            <div className="single-match-container" key={i} >
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
                                        4's <input type="checkbox" value="fours"/>
                                    </div>
                                    <div>
                                        6's <input type="checkbox" value="sixes"/>
                                    </div>
                                    <div>
                                        Wickets <input type="checkbox" value="wickets"/>
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
                <Button onClick={this.triggerNotification}>Try Sample Notification</Button>
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
