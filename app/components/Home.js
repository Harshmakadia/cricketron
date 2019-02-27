// @flow
import React, { Component } from 'react';
import { Header, Menu, Container, Segment } from 'semantic-ui-react';
import cricLive from 'cric-live';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = { liveMatches: [] };
  }

  componentWillMount() {
    console.log(1);
    return cricLive.getRecentMatches().then(liveMatches => {
      this.setState({
        liveMatches
      });
      return null;
    });
  }

  generateMatchCards = () => {
    const { liveMatches } = this.state;
    const matches = [];
    console.log(12, { liveMatches });
    liveMatches.forEach(match => {
      if (match.state === 'inprogress') {
        console.log(21, { match: match.score.detail });
        matches.push(
          <div className="card">
            <div className="content">
              <div className="ui equal width header center aligned padded grid">
                <div className="row no-vertical-padding">
                  <div className="column no-vertical-padding">
                    <img
                      src={match.score.detail.batting.flag}
                      alt="team-pic"
                      className="country-image"
                    />
                    <span>&nbsp;{match.score.detail.batting.name}</span>
                  </div>
                  <div className="column no-vertical-padding">
                    <img
                      src={match.score.detail.batting.flag}
                      alt="team-pic"
                      className="country-image"
                    />
                    <span>&nbsp;{match.score.detail.batting.name}</span>
                  </div>
                </div>
                <div className="row no-vertical-padding meta">
                  <div className="column no-vertical-padding score">
                    93/3 (13.3)
                  </div>
                  <div className="column no-vertical-padding score">-</div>
                </div>
              </div>
              <hr />
              <div className="ui grid row description">
                <div className="twelve wide column  no-bottom-padding">
                  Virat Kohli*
                </div>
                <div className="four wide column  no-bottom-padding">
                  72(38)
                </div>
                <div className="twelve wide column no-top-padding">
                  Lokesh Rahul
                </div>
                <div className="four wide column no-top-padding">47(26)</div>
              </div>
              <hr />
              <div className="ui grid row description">
                <div className="ten wide column bottom-padding-5">
                  Pat Cummins
                </div>
                <div className="six wide column right aligned bottom-padding-5">
                  4-0-45-0
                </div>
              </div>
            </div>
            <div className="extra content">
              <span className="right floated">Australia need 179 runs</span>
              <span>RR: 6.55</span>
            </div>
          </div>
        );
      }
    });
    return matches.slice(0, 3);
  };

  render() {
    return (
      <div>
        <Menu borderless compact inverted color="grey" fixed="top">
          <Menu.Item name="home" to="/your_route">
            <Header inverted>Auth Demo</Header>
          </Menu.Item>
        </Menu>
        <Container className="body-container">
          <Segment basic padded />
        </Container>
        <div className="ui centered link cards">
          {this.generateMatchCards()}
        </div>
      </div>
    );
  }
}
