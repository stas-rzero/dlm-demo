import { Circle } from 'react-konva';
import { BaseDevice } from './BaseDevice';

export class HubDevice extends BaseDevice {
  protected renderDeviceShape() {
    return <Circle radius={12} fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} />;
  }

  render() {
    const { device, scale } = this.props;
    const { x, y } = device;

    // Convert feet to pixels using the scale
    const range100ft = 100 * scale;

    return (
      <>
        {super.render()}
        {/* Range circles */}
        <Circle
          radius={range100ft}
          fill="transparent"
          stroke="#3b82f6"
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
