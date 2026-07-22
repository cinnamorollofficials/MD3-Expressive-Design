import { useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './CalendarChart.module.css';

export interface CalendarChartProps {
  /** Array of data items containing date and value fields */
  data: any[];
  /** Key of the date field in each object (Date or string ISO YYYY-MM-DD) */
  dateKey?: string;
  /** Key of the numeric value field in each object */
  valueKey?: string;
  /** Only render weekdays Monday through Friday (default: true) */
  weekdaysOnly?: boolean;
  /** Size of each square day cell in pixels */
  cellSize?: number;
  /** Diverging color scale: negative peak color */
  negativeColor?: string;
  /** Diverging color scale: neutral midpoint color */
  neutralColor?: string;
  /** Diverging color scale: positive peak color */
  positiveColor?: string;
  /** Enable interactive hover tooltips */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Title header for the legend bar */
  legendTitle?: string;
  /** Custom formatter for the values in tooltips */
  valueFormatter?: (val: number) => string;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_NEGATIVE_COLOR = '#b32657'; // pinkish red
const DEFAULT_NEUTRAL_COLOR = '#f5f5f5';  // light grey
const DEFAULT_POSITIVE_COLOR = '#2e7d32'; // green

export function CalendarChart({
  data = [],
  dateKey = 'date',
  valueKey = 'value',
  weekdaysOnly = true,
  cellSize = 15,
  negativeColor = DEFAULT_NEGATIVE_COLOR,
  neutralColor = DEFAULT_NEUTRAL_COLOR,
  positiveColor = DEFAULT_POSITIVE_COLOR,
  interactive = true,
  title,
  subtitle,
  legendTitle = 'Daily change',
  valueFormatter,
  className,
}: CalendarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    date: Date;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // Parse and group data by year
  const parsedDataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => {
      const rawDate = d[dateKey];
      const dateStr = rawDate instanceof Date
        ? rawDate.toISOString().split('T')[0]
        : String(rawDate).split('T')[0];
      map.set(dateStr, Number(d[valueKey]) || 0);
    });
    return map;
  }, [data, dateKey, valueKey]);

  // Determine the years range
  const years = useMemo(() => {
    const dates = data.map(d => new Date(d[dateKey])).filter(d => !isNaN(d.getTime()));
    if (dates.length === 0) return [new Date().getFullYear()];
    const startYear = d3.min(dates)!.getFullYear();
    const endYear = d3.max(dates)!.getFullYear();
    const list = [];
    for (let yr = endYear; yr >= startYear; yr--) {
      list.push(yr);
    }
    return list;
  }, [data, dateKey]);

  // Compute absolute max value for color scaling domain symmetric bounds [-max, max]
  const colorDomainLimit = useMemo(() => {
    const vals = data.map(d => Math.abs(Number(d[valueKey]) || 0));
    return d3.max(vals) || 0.05;
  }, [data, valueKey]);

  // Diverging color scale mapping function
  const colorScale = useMemo(() => {
    return d3.scaleLinear<string>()
      .domain([-colorDomainLimit, 0, colorDomainLimit])
      .range([negativeColor, neutralColor, positiveColor])
      .clamp(true);
  }, [colorDomainLimit, negativeColor, neutralColor, positiveColor]);

  // Day labels depending on weekday mode
  const dayLabels = weekdaysOnly ? ['M', 'T', 'W', 'T', 'F'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generator of all day nodes to render per year row
  const yearGrids = useMemo(() => {
    return years.map(year => {
      const days: any[] = [];
      const monthLabels: any[] = [];
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const allDays = d3.timeDays(startDate, new Date(endDate.getTime() + 86400000));

      let lastMonth = -1;

      allDays.forEach(date => {
        const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat

        // Filter weekends in weekdayOnly mode
        if (weekdaysOnly && (dayOfWeek === 0 || dayOfWeek === 6)) {
          return;
        }

        const dateStr = date.toISOString().split('T')[0];
        const val = parsedDataMap.get(dateStr) ?? 0;

        // Position coordinates mapping
        // Week number (columns 0 to 52)
        const week = d3.timeMonday.count(d3.timeYear(date), date);
        const yIndex = weekdaysOnly ? (dayOfWeek - 1) : dayOfWeek;

        days.push({
          date,
          dateStr,
          value: val,
          week,
          yIndex,
        });

        // Insert month labels at the first week of the month
        const currentMonth = date.getMonth();
        if (currentMonth !== lastMonth) {
          lastMonth = currentMonth;
          monthLabels.push({
            name: d3.timeFormat('%b')(date),
            week,
          });
        }
      });

      return {
        year,
        days,
        monthLabels,
      };
    });
  }, [years, weekdaysOnly, parsedDataMap]);

  // Size details
  const rowHeight = dayLabels.length * cellSize + 28; // height of grid row + spacing
  const totalSvgHeight = years.length * rowHeight + 10;
  const leftLabelOffset = 48;

  // Formatting helpers
  const tooltipDateFormatter = d3.timeFormat('%B %d, %Y');

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="calendar-chart"
    >
      <div className={styles.header}>
        {(title || subtitle) && (
          <div className={styles.titleArea}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}

        {/* Dynamic Diverging Color Scale Legend */}
        <div className={styles.legend}>
          <span className={styles.legendTitle}>{legendTitle}</span>
          <div className={styles.legendBarContainer}>
            <div
              className={styles.legendGradient}
              style={{
                background: `linear-gradient(to right, ${negativeColor}, ${neutralColor}, ${positiveColor})`,
              }}
            />
            <div className={styles.legendLabels}>
              <span>{valueFormatter ? valueFormatter(-colorDomainLimit) : `-${(colorDomainLimit * 100).toFixed(0)}%`}</span>
              <span>0%</span>
              <span>{valueFormatter ? valueFormatter(colorDomainLimit) : `+${(colorDomainLimit * 100).toFixed(0)}%`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer} style={{ height: totalSvgHeight }}>
        <svg
          className={styles.svg}
          width="100%"
          height={totalSvgHeight}
        >
          {yearGrids.map((row, rIdx) => {
            const yOffset = rIdx * rowHeight + 20;

            return (
              <g key={row.year} transform={`translate(10, ${yOffset})`}>
                
                {/* Year label */}
                <text
                  className={styles.yearLabel}
                  x={0}
                  y={rowHeight / 2 - 8}
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {row.year}
                </text>

                {/* Day of Week labels (M, T, W...) */}
                <g transform={`translate(${leftLabelOffset - 12}, 16)`}>
                  {dayLabels.map((lbl, idx) => (
                    <text
                      key={idx}
                      className={styles.dayLabel}
                      x={0}
                      y={(idx + 0.5) * cellSize}
                      textAnchor="end"
                      dominantBaseline="middle"
                    >
                      {lbl}
                    </text>
                  ))}
                </g>

                {/* Month labels (Jan, Feb, Mar...) */}
                <g transform={`translate(${leftLabelOffset}, 8)`}>
                  {row.monthLabels.map((lbl, idx) => (
                    <text
                      key={idx}
                      className={styles.monthLabel}
                      x={lbl.week * cellSize}
                      y={0}
                      textAnchor="start"
                    >
                      {lbl.name}
                    </text>
                  ))}
                </g>

                {/* Grid cells representing calendar days */}
                <g transform={`translate(${leftLabelOffset}, 16)`}>
                  {row.days.map((day) => {
                    const fillColor = colorScale(day.value);

                    const handleMouseEnter = (event: React.MouseEvent<SVGRectElement>) => {
                      if (!interactive) return;
                      const rect = event.currentTarget.getBoundingClientRect();
                      const containerRect = containerRef.current!.getBoundingClientRect();

                      setHoveredCell({
                        date: day.date,
                        value: day.value,
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top + rect.height / 2 - yOffset + 38,
                      });
                    };

                    return (
                      <rect
                        key={day.dateStr}
                        className={styles.dayCell}
                        width={cellSize - 1}
                        height={cellSize - 1}
                        x={day.week * cellSize}
                        y={day.yIndex * cellSize}
                        fill={fillColor}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </g>

              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Details */}
        {interactive && hoveredCell && (
          <div
            className={styles.tooltip}
            style={{
              left: hoveredCell.x,
              top: hoveredCell.y,
              borderTop: `3px solid ${colorScale(hoveredCell.value)}`,
            }}
          >
            <span className={styles.tooltipDate}>
              {tooltipDateFormatter(hoveredCell.date)}
            </span>
            <span
              className={styles.tooltipValue}
              style={{ color: hoveredCell.value >= 0 ? positiveColor : negativeColor }}
            >
              {hoveredCell.value >= 0 ? '+' : ''}
              {valueFormatter
                ? valueFormatter(hoveredCell.value)
                : `${(hoveredCell.value * 100).toFixed(2)}%`
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
