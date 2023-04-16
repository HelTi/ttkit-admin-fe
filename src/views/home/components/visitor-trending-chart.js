import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card } from "antd";
import { queryDayViews } from "@/services/data";

function VisitorTrendingChart() {
  const chartRef = useRef(null);
  const [xAxisData,setXAxisData] = useState([])
  const [seriesData, setSeriesData] = useState([])

  useEffect(() => {
    const defaultOptions = {
      grid: {
        // 直角坐标系内绘图网格
        left: '5%',
        right: '5%',
        top: '5%',
        bottom: '10%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
      },
      legend: {
        // 图例
        show: false, // 是否展示图例
        bottom: 0, // 0 为展示到下面
        data: [], // 图例名称item
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: 'rgba(171, 193, 241, 1)',
          fontSize: '14px',
        },
        itemGap: 46, // 图例每项之间的间隔
      },
    }
    const chart = echarts.init(chartRef.current);

    function resizeChart() {
      chart.resize();
    }

    window.addEventListener("resize", resizeChart);

    chart.setOption({
      ...defaultOptions,
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: seriesData,
          type: "line",
        },
      ],
    });

    return () => {
      chart.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [xAxisData,seriesData]);

  useEffect(()=>{
    async function getData(){
      const res = await queryDayViews()
      const {code,data} = res
      if (code === 200) {
         const xData =  Object.keys(data)
         setXAxisData(xData)
         const sData = xData.map(key=>data[key])
         setSeriesData(sData)
      }
    }
    getData()
  },[])

  return (
    <Card title="趋势分析">
      <div ref={chartRef} style={{ width: "100%", height: "300px" }}></div>
    </Card>
  );
}

export default VisitorTrendingChart;
