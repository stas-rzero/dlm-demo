import React from 'react';
import { FloorplanAppState, DeviceOrPlaceholder } from '../../types';

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
};

const LeftPanel: React.FC<Props> = ({ state }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDevices = state.devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.type === 'hub' && 'label' in device && device.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-64 h-full bg-white shadow-sm rounded-md p-4 flex flex-col">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search devices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="p-2 mb-2 border rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <div className="font-medium">{device.name}</div>
            {!device.placeholder && 'label' in device && (
              <div className="text-sm text-gray-500">{device.label}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel; 