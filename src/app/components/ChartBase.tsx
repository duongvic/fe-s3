import { createChart } from 'lightweight-charts';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface line {
  title: string;
  style: any;
  data: any[];
}

interface Props {
  lines: line[];
}

function ChartBase({ lines }: Props) {
  const { t } = useTranslation('constant');
  const chartContainer = useRef(null);
  const chartRef = useRef<any>({
    chart: null,
    areaSeries: [],
  });

  const chartEl = chartRef.current;

  useEffect(() => {
    chartEl.chart = createChart(chartContainer.current || '', {
      height: 380,
    });
    chartEl.chart.applyOptions({
      timeScale: { timeVisible: true },
      priceScale: { position: 'right' },
    });
  }, []);

  useEffect(() => {
    chartEl.areaSeries.forEach(areaLine => {
      chartEl.chart?.removeSeries(areaLine);
    });
    chartEl.areaSeries = [];

    lines.forEach(line => {
      const { title, data, style } = line;
      const areaLine = chartEl.chart?.addAreaSeries({
        title: title,
        ...style,
      });
      chartEl.areaSeries.push(areaLine);
      areaLine.setData(data);
      areaLine.applyOptions({
        priceFormat: {
          type: 'custom',
          formatter: price => {
            if (title === t('Title.CPU') || title === t('Title.RAM')) {
              return Number(price).toFixed(2) + '%';
            } else if (
              title === t('Title.DISK_READ') ||
              title === t('Title.DISK_WRITE')
            ) {
              return Number(price).toFixed(2) + ' MB/s';
            } else if (
              title === t('Title.NETWORK_TRANSFER') ||
              title === t('Title.NETWORK_RECEIVER')
            ) {
              return Number(price).toFixed(2) + ' Kb/s';
            } else if (
              title === t('Title.IOPS_RECEIVER') ||
              title === t('Title.IOPS_TRANSFER')
            ) {
              return Number(price).toFixed(2) + ' ';
            }
          },
        },
      });
    });
  });

  return <div ref={chartContainer} style={{ width: '100%' }}></div>;
}

export const MemorizedChartBase = memo(ChartBase);
