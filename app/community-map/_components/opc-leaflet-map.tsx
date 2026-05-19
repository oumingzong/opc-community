// 使用 ECharts 替代 Canvas 实现地图渲染
"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function OpcLeafletMap() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      console.error("Chart container not found.");
      return;
    }

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: "广州地图",
        left: "center",
        textStyle: {
          color: "#333",
          fontSize: 18,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}",
      },
      geo: {
        map: "china",
        roam: true,
        emphasis: {
          label: {
            show: false,
          },
        },
        regions: [
          {
            name: "广东",
            itemStyle: {
              areaColor: "#a5dff9",
              borderColor: "#111",
            },
          },
        ],
      },
      series: [
        {
          name: "标注",
          type: "scatter",
          coordinateSystem: "geo",
          data: [
            {
              name: "南沙区人才港",
              value: [113.5403, 22.7905],
            },
          ],
          symbolSize: 12,
          label: {
            show: true,
            formatter: "{b}",
            position: "right",
            color: "#333",
          },
          itemStyle: {
            color: "#f43f5e",
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className="h-full w-full"
      aria-label="广州地图 OPC 载体位置"
    />
  );
}
