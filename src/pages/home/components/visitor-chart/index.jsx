import React from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { get7day } from '@/utils/date'

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

const randomNum = () => Math.floor(Math.random() * 100 + 1)

class VisitorChart extends React.PureComponent {
  componentDidMount() {
    get7day()
    get7day(-1)
    console.log(randomNum())
  }

  render() {
    const day7 = get7day(-1)
    const data = day7.map(day => ({
        value: randomNum(),
        day,
      }))

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
      </div>
    );
  }
}

export default VisitorChart;
