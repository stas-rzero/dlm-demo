import { Circle } from 'react-konva';
import { BaseDevice } from './BaseDevice';

export class EECDevice extends BaseDevice {
  protected renderDeviceShape() {
    return <Circle radius={12} fill="#f59e0b" stroke="#d97706" strokeWidth={2} />;
  }

  render() {
    return super.render();
  }
}
