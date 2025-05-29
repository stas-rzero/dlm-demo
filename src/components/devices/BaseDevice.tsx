import React from 'react';
import { Circle, Group } from 'react-konva';
import { DeviceProps } from './types';

export class BaseDevice extends React.Component<DeviceProps> {
  render() {
    const { device, onSelect } = this.props;
    const { x, y } = device;

    return (
      <Group x={x} y={y} onClick={() => onSelect(device.id)} name="device">
        {this.renderDeviceShape()}
        {this.renderSelectionIndicator()}
      </Group>
    );
  }

  protected renderDeviceShape() {
    return <Circle radius={12} fill="gray" stroke="transparent" strokeWidth={2} />;
  }

  protected renderSelectionIndicator() {
    if (!this.props.isSelected) return null;

    return <Circle radius={18} stroke="#3b82f6" strokeWidth={2} />;
  }
}
