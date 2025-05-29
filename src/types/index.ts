export type Mode = 'planning' | 'view' | 'edit';

export type DeviceType =
  | 'hub'
  | 'eec' // exit/entry counter
  | 'counter' // area counter
  | 'desk_occupancy'
  | 'room_occupancy'
  | 'iaq';

export const GRID_SIZES = [0.5, 1, 2, 5, 10] as const;
export type GridSize = (typeof GRID_SIZES)[number];

export interface DeviceBase {
  id: string;
  type: DeviceType;
  name: string; // "Hub", "Exit/Entry Counter", etc.
  x: number;
  y: number;
}

export interface PlaceholderDevice extends DeviceBase {
  placeholder: true;
}

export interface Device extends DeviceBase {
  placeholder: false;
  assigned: boolean;
  uuid: string;
  label: string;
  active: boolean;
  mountingHeight: number;
  mountingLocation: 'INSIDE' | 'OUTSIDE';
  battery: number;
  capacity: number;
  powerType: 'Battery' | 'Wired';
}

export type DeviceOrPlaceholder = PlaceholderDevice | Device;

export interface FloorplanAppState {
  mode: Mode;
  floorplanImageUrl: string | null;
  imageScale: number; // Scale of the floorplan image
  imageRotation: number; // Rotation of the floorplan image in degrees
  scaleRatio: number; // Pixels per foot ratio
  devices: DeviceOrPlaceholder[];
  unassignedDevices: Device[];
  selectedElementId: string | null;
  currentTypeToPlace: DeviceType | null;
  currentUnassignedDeviceIdToPlace: string | null;
  isMeasuring: boolean;
  isCalibrating: boolean;
  editSnapshot?: {
    devices: DeviceOrPlaceholder[];
    unassignedDevices: Device[];
  };
}

export interface AppUIState {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  zoomLevel: number; // UI zoom level, resets to 1 on app restart
  imageLocked: boolean;
  isCalibrating: boolean;
  gridSizeIndex: number; // Index into GRID_SIZES array
}
