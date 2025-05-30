import { Circle } from 'react-konva';
import { BaseDevice } from './BaseDevice';
import { DEVICE_COLORS } from './constants';

export class HubDevice extends BaseDevice {
  protected renderDeviceShape() {
    const colors = DEVICE_COLORS.hub;
    return <Circle radius={12} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />;
  }

  render() {
    const { device, scale } = this.props;
    const { x, y } = device;

    // Convert feet to pixels using the scale
    const range50ft = 50 * scale;

    return (
      <>
        {super.render()}
        {/* Range circles */}
        <Circle
          radius={range50ft}
          fill="transparent"
          stroke={DEVICE_COLORS.hub.fill}
          strokeWidth={1.5}
          dash={[5, 5]}
          listening={false}
          x={x}
          y={y}
        />
      </>
    );
  }
}
