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
      if (!appState?.isCalibrating) return;

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
    appState?.isCalibrating,
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
          {Array.from({ length: Math.ceil((dimensions.width * 2) / getGridSizeInPixels()) }).map(
            (_, i) => (
              <Line
                key={`v-${i}`}
                points={[
                  i * getGridSizeInPixels() - dimensions.width / 2,
                  -dimensions.height / 2,
                  i * getGridSizeInPixels() - dimensions.width / 2,
                  dimensions.height * 1.5,
                ]}
                stroke="#ddd"
                strokeWidth={1}
                dash={[5, 5]}
              />
            )
          )}
          {Array.from({ length: Math.ceil((dimensions.height * 2) / getGridSizeInPixels()) }).map(
            (_, i) => (
              <Line
                key={`h-${i}`}
                points={[
                  -dimensions.width / 2,
                  i * getGridSizeInPixels() - dimensions.height / 2,
                  dimensions.width * 1.5,
                  i * getGridSizeInPixels() - dimensions.height / 2,
                ]}
                stroke="#ddd"
                strokeWidth={1}
                dash={[5, 5]}
              />
            )
          )}
        </Layer>

        <Layer>
          <Text
            x={20}
            y={20}
            text={`Image Scale: ${appState?.imageScale?.toFixed(1)}x
Grid Scale: ${appState?.scaleRatio || 50} px/ft
Grid Size: ${GRID_SIZES[uiState.gridSizeIndex]} ft
(1 grid square = 1 foot)`}
            fontSize={14}
            fill="black"
            padding={10}
            background="#ffffff80"
            listening={false}
            perfectDrawEnabled={false}
            transformsEnabled="position"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default FloorplanCanvas;
