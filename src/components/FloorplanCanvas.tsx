import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Text } from 'react-konva';
import useImage from 'use-image';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';
import { GRID_SIZES, DeviceOrPlaceholder, AVAILABLE_DEVICES } from '../types';
import { useFloorplan } from '../context/useFloorplan';
import { createDeviceComponent } from './devices/DeviceFactory';
import LoadingOverlay from './LoadingOverlay';

// Custom hook for stable image loading
const useStableImage = (url: string) => {
  const [image, status] = useImage(url, 'anonymous');
  return [image, status] as const;
};

const FloorplanCanvas: React.FC = () => {
  const {
    appState,
    setAppState,
    uiState,
    setUIState,
    handleImageScale,
    handleImageRotation,
    handleCalibrationComplete,
  } = useFloorplan();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Memoize the image URL
  const imageUrl = useMemo(() => appState?.floorplanImageUrl || '', [appState?.floorplanImageUrl]);
  const [floorplanImage, status] = useStableImage(imageUrl);

  // Calculate the image's actual dimensions and position
  const imageDimensions = useMemo(() => {
    if (!floorplanImage) return { width: 0, height: 0, x: 0, y: 0 };

    const scale = appState?.imageScale || 1;
    const width = floorplanImage.width * scale;
    const height = floorplanImage.height * scale;

    // Calculate the image's position to keep it centered
    const x = (dimensions.width - width) / 2;
    const y = (dimensions.height - height) / 2;

    return { width, height, x, y };
  }, [floorplanImage, dimensions, appState?.imageScale]);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle keyboard shortcuts for calibration
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (uiState.isCalibrating) {
        switch (e.key) {
          case '+':
          case '=':
            handleImageScale(0.1);
            break;
          case '-':
            handleImageScale(-0.1);
            break;
          case 'r':
            handleImageRotation(90);
            break;
          case 'Enter':
            handleCalibrationComplete();
            break;
          case 'Escape':
            setUIState(prev => ({ ...prev, isCalibrating: false }));
            break;
        }
      } else if (e.key === 'Escape') {
        // Deselect current device type when Escape is pressed
        setAppState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            currentTypeToPlace: null,
          };
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    uiState.isCalibrating,
    handleImageScale,
    handleImageRotation,
    handleCalibrationComplete,
    setUIState,
    setAppState,
  ]);

  // Calculate grid size in pixels based on scale ratio and grid size
  const getGridSizeInPixels = () => {
    const baseGridSize = appState?.scaleRatio || 50;
    return baseGridSize * GRID_SIZES[uiState.gridSizeIndex];
  };

  // Calculate grid dimensions based on floorplan image size
  const getGridDimensions = () => {
    if (!floorplanImage) return { width: dimensions.width * 2, height: dimensions.height * 2 };

    const imageWidth = floorplanImage.width * (appState?.imageScale || 1);
    const imageHeight = floorplanImage.height * (appState?.imageScale || 1);

    // Add 30% padding to both dimensions
    return {
      width: imageWidth * 1.3,
      height: imageHeight * 1.3,
    };
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // If we clicked on a device, don't handle the click here
    const target = e.target;
    if (target.getParent()?.attrs.name === 'device') return;

    // If we're placing a new device
    if (appState?.currentTypeToPlace) {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      // Get the stage scale
      const stageScale = stage.scaleX(); // Both scaleX and scaleY should be the same

      // Calculate position relative to the image, accounting for stage scale and position
      const imageX = (pointerPosition.x - position.x) / stageScale - imageDimensions.x;
      const imageY = (pointerPosition.y - position.y) / stageScale - imageDimensions.y;

      // Only place device if click is within image bounds
      if (
        imageX >= 0 &&
        imageX <= imageDimensions.width &&
        imageY >= 0 &&
        imageY <= imageDimensions.height
      ) {
        // Create a new placeholder device
        const newDevice: DeviceOrPlaceholder = {
          id: `placeholder-${appState.currentTypeToPlace}-${Date.now()}`,
          type: appState.currentTypeToPlace,
          name: AVAILABLE_DEVICES.find(d => d.type === appState.currentTypeToPlace)?.name || '',
          x: imageX,
          y: imageY,
          placeholder: true,
        };

        // Add the new device to the state
        setAppState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            devices: [...prev.devices, newDevice],
          };
        });
      }
    } else {
      // If we clicked on empty space and not placing a device, deselect current device
      setAppState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          selectedElementId: null,
        };
      });
    }
  };

  const renderContent = () => {
    // If there's no image URL, show the empty state
    if (!imageUrl) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="mb-4 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-600">No floorplan loaded</p>
            <p className="mt-2 text-sm text-gray-500">Please upload a floorplan image</p>
          </div>
        </div>
      );
    }

    if (status === 'loading') {
      return <LoadingOverlay message="Loading floorplan..." />;
    }

    if (status === 'failed') {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="mb-4 h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium text-red-600">Failed to load floorplan</p>
            <p className="mt-2 text-sm text-gray-500">
              Something went wrong, please try to reload the page.
            </p>
          </div>
        </div>
      );
    }

    return (
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={uiState.zoomLevel}
        scaleY={uiState.zoomLevel}
        x={position.x}
        y={position.y}
        draggable
        onDragMove={e => setPosition(e.target.position())}
        onClick={handleStageClick}
        onTap={handleStageClick}
        className="touch-none bg-white"
      >
        <Layer>
          {floorplanImage && (
            <KonvaImage
              image={floorplanImage}
              scale={{ x: appState?.imageScale || 1, y: appState?.imageScale || 1 }}
              rotation={appState?.imageRotation || 0}
              x={imageDimensions.x}
              y={imageDimensions.y}
            />
          )}
        </Layer>
        <Layer>
          {/* Grid lines */}
          {(() => {
            const gridSize = getGridSizeInPixels();
            const { width, height } = getGridDimensions();

            // Calculate the number of grid lines needed
            const numVerticalLines = Math.ceil(width / gridSize);
            const numHorizontalLines = Math.ceil(height / gridSize);

            // Calculate the starting positions to center the grid
            const startX = imageDimensions.x - (width - imageDimensions.width) / 2;
            const startY = imageDimensions.y - (height - imageDimensions.height) / 2;

            return (
              <>
                {/* Vertical lines */}
                {Array.from({ length: numVerticalLines }).map((_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[0, 0, 0, height]}
                    x={startX + i * gridSize}
                    y={startY}
                    stroke="#ddd"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                ))}
                {/* Horizontal lines */}
                {Array.from({ length: numHorizontalLines }).map((_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[0, 0, width, 0]}
                    x={startX}
                    y={startY + i * gridSize}
                    stroke="#ddd"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                ))}
              </>
            );
          })()}
        </Layer>

        {/* Devices Layer */}
        <Layer>
          {appState?.devices.map(device => {
            const DeviceComponent = createDeviceComponent(device.type);
            return (
              <DeviceComponent
                key={device.id}
                device={{
                  ...device,
                  x: device.x + imageDimensions.x,
                  y: device.y + imageDimensions.y,
                }}
                isSelected={appState.selectedElementId === device.id}
                scale={appState.scaleRatio}
                onSelect={deviceId => {
                  setAppState(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      selectedElementId: deviceId,
                    };
                  });
                }}
              />
            );
          })}
        </Layer>

        <Layer>
          {floorplanImage && (
            <Text
              x={imageDimensions.x}
              y={imageDimensions.y - 100}
              text={`Image Size: ${appState?.imageScale?.toFixed(1)}x
Grid Scale: ${appState?.scaleRatio || 50} px/ft
Grid Size: ${GRID_SIZES[uiState.gridSizeIndex]} ft
Zoom: ${(uiState.zoomLevel * 100).toFixed(0)}%`}
              fontSize={14}
              fill="black"
              padding={10}
              background="#ffffff80"
              listening={false}
              perfectDrawEnabled={false}
              transformsEnabled="position"
            />
          )}
        </Layer>
      </Stage>
    );
  };

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default FloorplanCanvas;
