import { HubDevice } from './HubDevice';
import { EECDevice } from './EECDevice';
import { CounterDevice } from './CounterDevice';
import { DeskOccupancyDevice } from './DeskOccupancyDevice';
import { RoomOccupancyDevice } from './RoomOccupancyDevice';
import { IAQDevice } from './IAQDevice';
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
    case 'counter':
      return CounterDevice;
    case 'desk_occupancy':
      return DeskOccupancyDevice;
    case 'room_occupancy':
      return RoomOccupancyDevice;
    case 'iaq':
      return IAQDevice;
    default:
      return BaseDevice;
  }
};
