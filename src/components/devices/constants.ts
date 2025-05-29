import { DeviceType } from '../../types';

export const DEVICE_COLORS: Record<DeviceType, { fill: string; stroke: string; text: string }> = {
  hub: { fill: '#3b82f6', stroke: '#1d4ed8', text: '#ffffff' },
  eec: { fill: '#f59e0b', stroke: '#d97706', text: '#ffffff' },
  counter: { fill: '#10b981', stroke: '#059669', text: '#ffffff' },
  desk_occupancy: { fill: '#8b5cf6', stroke: '#7c3aed', text: '#ffffff' },
  room_occupancy: { fill: '#ec4899', stroke: '#db2777', text: '#ffffff' },
  iaq: { fill: '#06b6d4', stroke: '#0891b2', text: '#ffffff' },
};
