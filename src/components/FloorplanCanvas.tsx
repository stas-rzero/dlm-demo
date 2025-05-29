import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Text } from 'react-konva';
import useImage from 'use-image';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { GRID_SIZES } from '../types';
import { useFloorplan } from '../context/useFloorplan';

const FloorplanCanvas: React.FC = () => {
  const {
    appState,
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
  console.log({ appState, uiState });

  const [floorplanImage] = useImage(appState?.floorplanImageUrl || '');

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
      if (!uiState.isCalibrating) return;

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
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    uiState.isCalibrating,
    handleImageScale,
    handleImageRotation,
    handleCalibrationComplete,
    setUIState,
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

  return (
    <div ref={containerRef} className="h-full w-full">
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
        className="bg-white"
      >
        <Layer>
          {floorplanImage && (
            <KonvaImage
              image={floorplanImage}
              scale={{ x: appState?.imageScale || 1, y: appState?.imageScale || 1 }}
              rotation={appState?.imageRotation || 0}
              x={dimensions.width / 2}
              y={dimensions.height / 2}
              offsetX={floorplanImage.width / 2}
              offsetY={floorplanImage.height / 2}
            />
          )}
        </Layer>
        <Layer>
          {/* Grid lines */}
          {(() => {
            const gridSize = getGridSizeInPixels();
            const { width, height } = getGridDimensions();

            return (
              <>
                {Array.from({ length: Math.ceil(width / gridSize) }).map((_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[i * gridSize, -height / 2, i * gridSize, height / 2]}
                    x={dimensions.width / 2 - width / 2}
                    y={dimensions.height / 2}
                    stroke="#ddd"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                ))}
                {Array.from({ length: Math.ceil(height / gridSize) }).map((_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[-width / 2, i * gridSize, width / 2, i * gridSize]}
                    x={dimensions.width / 2}
                    y={dimensions.height / 2 - height / 2}
                    stroke="#ddd"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                ))}
              </>
            );
          })()}
        </Layer>

        <Layer>
          {floorplanImage && (
            <Text
              x={dimensions.width / 2 - (floorplanImage.width * (appState?.imageScale || 1)) / 2}
              y={
                dimensions.height / 2 -
                (floorplanImage.height * (appState?.imageScale || 1)) / 2 -
                100
              }
              text={`Image Size: ${appState?.imageScale?.toFixed(1)}x
Grid Scale: ${appState?.scaleRatio || 50} px/ft
Grid Size: ${GRID_SIZES[uiState.gridSizeIndex]} ft
Zoom: ${(uiState.zoomLevel * 100).toFixed(0)}%
(1 grid square = 1 foot)`}
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
    </div>
  );
};

export default FloorplanCanvas;
