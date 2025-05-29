import React from 'react';
import { FloorplanAppState } from '../../types';

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
  onZoom: (delta: number) => void;
};

const ViewControls: React.FC<Props> = ({ onZoom }) => {
  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={() => onZoom(0.2)} 
        className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
      >
        +
      </button>
      <button 
        onClick={() => onZoom(-0.2)} 
        className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
      >
        -
      </button>
      <button 
        onClick={() => document.documentElement.requestFullscreen()} 
        className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
      >
        Fullscreen
      </button>
    </div>
  );
};

export default ViewControls; 