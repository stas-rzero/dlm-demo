import { FloorplanAppState } from '../types';

// Mock database of floorplans
export const mockFloorplans: Record<string, FloorplanAppState> = {
  '1': {
    mode: 'planning',
    floorplanImageUrl: 'floorplans/floorplan_1.png',
    imageScale: 1,
    imageRotation: 0,
    scaleRatio: 12,
    devices: [
      {
        id: 'placeholder-hub-1',
        type: 'hub',
        name: 'Hub',
        x: 300,
        y: 400,
        placeholder: true,
      },
      {
        id: 'placeholder-desk-1',
        type: 'desk_occupancy',
        name: 'Desk Occupancy',
        x: 500,
        y: 600,
        placeholder: true,
      },
    ],
    unassignedDevices: [],
    selectedElementId: null,
    currentTypeToPlace: null,
    currentUnassignedDeviceIdToPlace: null,
    isMeasuring: false,
  },
  '2': {
    mode: 'planning',
    floorplanImageUrl: 'floorplans/floorplan_2.png',
    imageScale: 1,
    imageRotation: 0,
    scaleRatio: 12,
    devices: [
      {
        id: 'placeholder-hub-1',
        type: 'hub',
        name: 'Hub',
        x: 300,
        y: 400,
        placeholder: true,
      },
      {
        id: 'placeholder-desk-1',
        type: 'desk_occupancy',
        name: 'Desk Occupancy',
        x: 500,
        y: 600,
        placeholder: true,
      },
    ],
    unassignedDevices: [],
    selectedElementId: null,
    currentTypeToPlace: null,
    currentUnassignedDeviceIdToPlace: null,
    isMeasuring: false,
  },
  '3': {
    mode: 'view',
    floorplanImageUrl: 'floorplans/floorplan_1.png',
    imageScale: 1,
    imageRotation: 0,
    scaleRatio: 12,
    devices: [
      {
        id: 'device-1',
        type: 'hub',
        name: 'Hub',
        x: 300,
        y: 400,
        placeholder: false,
        assigned: true,
        uuid: 'HUB-0001',
        label: '300239',
        active: true,
        mountingHeight: 12,
        mountingLocation: 'INSIDE',
        battery: 92,
        capacity: 1,
        powerType: 'Battery',
      },
      {
        id: 'device-2',
        type: 'eec',
        name: 'Exit/Entry Counter',
        x: 500,
        y: 200,
        placeholder: false,
        assigned: true,
        uuid: 'EEC-0002',
        label: '300240',
        active: false,
        mountingHeight: 8,
        mountingLocation: 'OUTSIDE',
        battery: 55,
        capacity: 1,
        powerType: 'Battery',
      },
    ],
    unassignedDevices: [],
    selectedElementId: null,
    currentTypeToPlace: null,
    currentUnassignedDeviceIdToPlace: null,
    isMeasuring: false,
  },
};

// Helper function to get floorplan data by ID
export const getFloorplanById = (id: string): FloorplanAppState | null => {
  return mockFloorplans[id] || null;
};

// Initial empty state for new floorplans
export const INITIAL_APP_STATE: FloorplanAppState = {
  mode: 'planning',
  floorplanImageUrl: null,
  imageScale: 1,
  imageRotation: 0,
  scaleRatio: 50,
  devices: [],
  unassignedDevices: [],
  selectedElementId: null,
  currentTypeToPlace: null,
  currentUnassignedDeviceIdToPlace: null,
  isMeasuring: false,
};
