import React from 'react';
import { Spin } from 'antd'
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { queryDayViews } from '@/services/data';

const styles = {
  mainTitle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
};

class VisitorChart extends React.PureComponent {
  state = {
    data: null,
    loading: true,
  };

  componentDidMount() {
    this.getDayViews();
  }

  getDayViews = () => {
    queryDayViews().then(res => {
      if (res.code === 200) {
        const { data } = res;
        const dataResult = [];
        Object.keys(data).forEach(d => {
          dataResult.push({
            value: data[d],
            day: d.slice(5),
          });
        });
        this.setState({
          data: dataResult,
          loading: false,
        });
      }
    });
  };

  render() {
    const { data } = this.state;

    const cols = {
      value: {
        min: 0,
      },
      day: {
        range: [0, 1],
      },
    };
    return (
      <div>
        <Spin spinning={this.state.loading}>
        <Chart height={400} data={data} scale={cols} forceFit>
          <h3 className="main-title" style={styles.mainTitle}>
            最近7天访问趋势
          </h3>
          <Axis name="day" />
          <Axis name="value" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="day*value" size={1} />
          <Geom
            type="point"
            position="day*value"
            size={4}
            shape="circle"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
        </Spin>

      </div>
    );
  }
}

export default VisitorChart;
