import { DeviceOrPlaceholder } from '../../types';

export interface DeviceProps {
  device: DeviceOrPlaceholder;
  isSelected: boolean;
  scale: number;
  onSelect: (deviceId: string) => void;
}
