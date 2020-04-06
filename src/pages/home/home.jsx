import React from 'react';
import { Card, Row, Col, Icon } from 'antd';
import VisitorChart from './components/visitor-chart'

import styles from './style.less';

export default () => (
  <div>
    <Row gutter={10}>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box">
          <Card bordered={false}>
            <div className={styles.dataBody}>
              <div className={styles.dataIcon}>
                <Icon theme="twoTone" twoToneColor="#52c41a" type="book" />
              </div>
              <div className={styles.bodyContent}>
                <span style={{ marginRight: 10 }}> 文章数</span>
                <span style={{ color: '#eb2f96' }}>20</span>
              </div>
            </div>
          </Card>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <Card bordered={false}>
          <div className={styles.dataBody}>
            <div className={styles.dataIcon}>
              <Icon theme="twoTone" twoToneColor="#1890ff" type="file" />
            </div>
            <div className={styles.bodyContent}>
              <span style={{ marginRight: 10 }}> 文件数</span>
              <span style={{ color: '#eb2f96' }}>20</span>
            </div>
          </div>

        </Card>
      </Col>
      <Col className="gutter-row" span={6}>
        <Card bordered={false}>
          <div className={styles.dataBody}>
            <div className={styles.dataIcon}>
              <Icon theme="twoTone" twoToneColor="#975fe4" type="message" />
            </div>
            <div className={styles.bodyContent}>
              <span style={{ marginRight: 10 }}> 评论数</span>
              <span style={{ color: '#eb2f96' }}>20</span>
            </div>
          </div>
        </Card>
      </Col>
      <Col className="gutter-row" span={6}>
        <Card bordered={false}>
          <div className={styles.dataBody}>
            <div className={styles.dataIcon}>
            <Icon theme="twoTone" twoToneColor="#15c2c2" type="eye" />
            </div>
            <div className={styles.bodyContent}>
              <span style={{ marginRight: 10 }}> 访问数</span>
              <span style={{ color: '#eb2f96' }}>20</span>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <Row style={{ marginTop: 10 }}>
      <Col>
        <Card title="访问趋势" bordered={false}>
        <VisitorChart/>
        </Card>
      </Col>
    </Row>
  </div>
);
