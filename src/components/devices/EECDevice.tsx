import { Circle } from 'react-konva';
import { BaseDevice } from './BaseDevice';
import { DEVICE_COLORS } from './constants';

export class EECDevice extends BaseDevice {
  protected renderDeviceShape() {
    const colors = DEVICE_COLORS.eec;
    return <Circle radius={12} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />;
  }

  render() {
    return super.render();
  }
}
