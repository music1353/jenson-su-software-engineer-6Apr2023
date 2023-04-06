import React from 'react';
import { Col, Row } from 'antd';

const Jumbotron: React.FC = () => {
  return (
    <Row className="portal-jumbotron">
      <Col className="jumbotron-intro" xs={24} sm={10}>
        <div className="intro-header">
          <div className="header__title">The simplest and trendiest Profile Generator!</div>
          <div className="header__description">Design a top-notch profile that accurately reflects your in-person persona.</div>
        </div>
      </Col>
      
      <Col className="jumbotron-arts" xs={24} sm={14}>
        <img
          src={require("assets/images/icons/art.png")}
          alt="art-img"
        />
      </Col>
    </Row>
  )
}

export default Jumbotron;