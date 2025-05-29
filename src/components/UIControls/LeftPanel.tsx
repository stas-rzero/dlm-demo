import React from 'react';
import { useFloorplan } from '../../context/useFloorplan';
import { DeviceType, AVAILABLE_DEVICES } from '../../types';
import { DEVICE_COLORS } from '../devices/constants';

const LeftPanel: React.FC = () => {
  const { appState, setAppState } = useFloorplan();

  const handleDeviceTypeSelect = (type: DeviceType) => {
    setAppState(prev => {
      if (!prev) return null;
      // If clicking the same type, deselect it
      if (prev.currentTypeToPlace === type) {
        return {
          ...prev,
          currentTypeToPlace: null,
        };
      }
      // Otherwise select the new type
      return {
        ...prev,
        currentTypeToPlace: type,
        selectedElementId: null,
      };
    });
  };

  const getDeviceCount = (type: DeviceType) => {
    return appState?.devices.filter(device => device.type === type).length || 0;
  };

  return (
    <div className="h-full w-64 rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Place Devices</h3>
      <div className="space-y-2">
        {AVAILABLE_DEVICES.map(device => (
          <div
            key={device.type}
            className={`cursor-pointer rounded p-2 ${
              appState?.currentTypeToPlace === device.type ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleDeviceTypeSelect(device.type)}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{device.name}</div>
              <div
                className="rounded-full px-2 py-0.5 text-sm"
                style={{
                  backgroundColor: DEVICE_COLORS[device.type].fill,
                  color: DEVICE_COLORS[device.type].text,
                }}
              >
                {getDeviceCount(device.type)}
              </div>
            </div>
            <div className="text-sm text-gray-500">{device.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
