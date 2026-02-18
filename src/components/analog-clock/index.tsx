import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

import Svg, {
  Circle,
  Line,
  G,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

import { Colors } from '../../config/constants';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
}

// Converts degrees to radians
const degToRad = (deg: number): number => (deg * Math.PI) / 180;

// Numbers for hour markers
const HOUR_LABELS = [
  '12',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
];

const AnalogClock: React.FC<AnalogClockProps> = ({
  hours,
  minutes,
  seconds,
}) => {
  const { width, height } = useWindowDimensions();

  // Responsively compute clock size: ~70% of the smaller screen dimension,
  // capped at 400 for readability on large screens
  const clockSize = Math.min(width * 0.75, height * 0.5, 400);
  const center = clockSize / 2;
  const radius = clockSize / 2 - 8; // Inset slightly from the edge

  /// Compute hand angles

  const handAngles = useMemo(() => {
    // Second hand: 6° per second
    const secondAngle = seconds * 6;

    // Minute hand: 6° per minute + 0.1° per second for smooth sweep
    const minuteAngle = minutes * 6 + seconds * 0.1;

    // Hour hand: 30° per hour + 0.5° per minute for smooth sweep
    const hour12 = hours % 12;
    const hourAngle = hour12 * 30 + minutes * 0.5;

    return { secondAngle, minuteAngle, hourAngle };
  }, [hours, minutes, seconds]);

  // Pre-compute hour and minute marker positions.
  const markers = useMemo(() => {
    const hourMarkers = [];
    const minuteMarkers = [];

    for (let i = 0; i < 60; i++) {
      const angle = degToRad(i * 6 - 90); // -90 to start from 12 o'clock
      const isHour = i % 5 === 0;

      const outerR = radius - 2;
      const innerR = isHour ? radius - 18 : radius - 10;

      const x1 = center + Math.cos(angle) * innerR;
      const y1 = center + Math.sin(angle) * innerR;
      const x2 = center + Math.cos(angle) * outerR;
      const y2 = center + Math.sin(angle) * outerR;

      if (isHour) {
        hourMarkers.push({ x1, y1, x2, y2, index: i / 5 });
      } else {
        minuteMarkers.push({ x1, y1, x2, y2 });
      }
    }

    return { hourMarkers, minuteMarkers };
  }, [center, radius]);

  // Pre-compute label positions for hour numbers.

  const labels = useMemo(() => {
    return HOUR_LABELS.map((label, i) => {
      const angle = degToRad(i * 30 - 90);
      const labelR = radius - 32;
      return {
        x: center + Math.cos(angle) * labelR,
        y: center + Math.sin(angle) * labelR + 5, // +5 for vertical centering
        label,
      };
    });
  }, [center, radius]);

  // Compute the endpoint of a clock hand given angle and length
  const handEnd = (angleDeg: number, length: number) => {
    const rad = degToRad(angleDeg - 90);
    return {
      x: center + Math.cos(rad) * length,
      y: center + Math.sin(rad) * length,
    };
  };

  // Hand lengths relative to radius
  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.82;
  const secondHandTail = radius * 0.2;

  const hourEnd = handEnd(handAngles.hourAngle, hourHandLength);
  const minuteEnd = handEnd(handAngles.minuteAngle, minuteHandLength);
  const secondEnd = handEnd(handAngles.secondAngle, secondHandLength);
  const secondTailEnd = handEnd(handAngles.secondAngle + 180, secondHandTail);

  return (
    <View style={[styles.container, { width: clockSize, height: clockSize }]}>
      <Svg
        width={clockSize}
        height={clockSize}
        viewBox={`0 0 ${clockSize} ${clockSize}`}
      >
        <Defs>
          {/* Radial gradient for the clock face */}
          <RadialGradient id="faceGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#1A2236" />
            <Stop offset="85%" stopColor="#0F172A" />
            <Stop offset="100%" stopColor="#0A0E1A" />
          </RadialGradient>
        </Defs>

        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={clockSize}
          height={clockSize}
          fill="transparent"
        />

        {/* Outer rim glow */}
        <Circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="rgba(0, 229, 255, 0.12)"
          strokeWidth={2}
        />

        {/* Clock face */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#faceGradient)"
          stroke={Colors.clockRimStart}
          strokeWidth={3}
        />

        {/* Inner rim accent */}
        <Circle
          cx={center}
          cy={center}
          r={radius - 1}
          fill="none"
          stroke="rgba(0, 229, 255, 0.06)"
          strokeWidth={1}
        />

        {/* Minute markers */}
        {markers?.minuteMarkers?.map((m, i) => (
          <Line
            key={`min-${i}`}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke={Colors.minuteMarker}
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}

        {/* Hour markers */}
        {markers?.hourMarkers?.map((m, i) => (
          <Line
            key={`hr-${i}`}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke={Colors.hourMarker}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}

        {/* Hour labels */}
        {labels?.map(({ x, y, label }, i) => (
          <SvgText
            key={`label-${i}`}
            x={x}
            y={y}
            fill={Colors.textSecondary}
            fontSize={clockSize * 0.04}
            fontWeight="600"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {label}
          </SvgText>
        ))}

        {/* Hour hand */}
        <Line
          x1={center}
          y1={center}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke={Colors.hourHand}
          strokeWidth={5}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <Line
          x1={center}
          y1={center}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke={Colors.minuteHand}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Second hand (with tail) */}
        <G>
          <Line
            x1={secondTailEnd.x}
            y1={secondTailEnd.y}
            x2={secondEnd.x}
            y2={secondEnd.y}
            stroke={Colors.secondHand}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Second hand tip circle */}
          <Circle
            cx={secondEnd.x}
            cy={secondEnd.y}
            r={2}
            fill={Colors.secondHand}
          />
        </G>

        {/* Center pin */}
        <Circle cx={center} cy={center} r={5} fill={Colors.centerPin} />
        <Circle cx={center} cy={center} r={2.5} fill={Colors.secondHand} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(AnalogClock);
