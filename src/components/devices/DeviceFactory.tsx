import { HubDevice } from './HubDevice';
import { EECDevice } from './EECDevice';
import { DeviceProps } from './types';
import { ComponentType } from 'react';
import { DeviceType } from '../../types';
import { BaseDevice } from './BaseDevice';

export const createDeviceComponent = <T extends DeviceType>(
  deviceType: T
): ComponentType<DeviceProps> => {
  switch (deviceType) {
    case 'hub':
      return HubDevice;
    case 'eec':
      return EECDevice;
    // TODO: Add other device types
    default:
      return BaseDevice;
  }
};
