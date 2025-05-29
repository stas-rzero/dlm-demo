import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Circle, Text } from "react-konva";
import useImage from "use-image";
import { Stage as KonvaStage } from "konva/lib/Stage";
import { FloorplanAppState } from "../types";

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
  imageScale: number;
  setImageScale: (scale: number) => void;
  imageLocked: boolean;
  setImageLocked: (locked: boolean) => void;
  isCalibrating: boolean;
  setIsCalibrating: (calibrating: boolean) => void;
};

const FloorplanCanvas: React.FC<Props> = ({
  state,
  onStateChange,
  imageScale,
  setImageScale,
  imageLocked,
  setImageLocked,
  isCalibrating,
  setIsCalibrating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [calibrationPoints, setCalibrationPoints] = useState<[number, number][]>([]);

  const [floorplanImage] = useImage(state.floorplanImageUrl || "");

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

  const handleStageClick = () => {
    if (!isCalibrating) return;

    const stage = stageRef.current;
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const newPoints = [...calibrationPoints, [pointerPos.x, pointerPos.y]];

    if (newPoints.length === 2) {
      // Compute pixel distance
      const [a, b] = newPoints;
      const pixelDist = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);

      const feet = parseFloat(prompt(`Pixel distance: ${pixelDist.toFixed(1)}. Enter distance in feet:`) || "");
      if (!isNaN(feet) && feet > 0) {
        const newScaleRatio = feet / pixelDist;
        onStateChange({
          ...state,
          scaleRatio: newScaleRatio,
        });
      }

      setCalibrationPoints([]);
      setIsCalibrating(false);
    } else {
      setCalibrationPoints(newPoints as [number, number][]);
    }
  };

  // Escape key to exit calibration mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCalibrationPoints([]);
        setIsCalibrating(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setIsCalibrating]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onDragMove={(e) => setPosition(e.target.position())}
        onClick={handleStageClick}
        className="bg-white"
      >
        <Layer>
          {floorplanImage && (
            <KonvaImage image={floorplanImage} scale={{ x: imageScale, y: imageScale }} />
          )}
        </Layer>
        <Layer>
          {/* Vertical lines */}
          {Array.from({ length: Math.ceil((dimensions.width * 2) / 50) }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * 50 - dimensions.width/2, -dimensions.height/2, i * 50 - dimensions.width/2, dimensions.height * 1.5]}
              stroke="#ddd"
              strokeWidth={1}
              dash={[5, 5]}
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: Math.ceil((dimensions.height * 2) / 50) }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[-dimensions.width/2, i * 50 - dimensions.height/2, dimensions.width * 1.5, i * 50 - dimensions.height/2]}
              stroke="#ddd"
              strokeWidth={1}
              dash={[5, 5]}
            />
          ))}
        </Layer>

        {calibrationPoints.length > 0 && (
          <Layer>
            {calibrationPoints.map((pt, i) => (
              <Circle key={i} x={pt[0]} y={pt[1]} radius={5} fill="red" />
            ))}
            {calibrationPoints.length === 2 && (
              <>
                <Line
                  points={[
                    calibrationPoints[0][0], calibrationPoints[0][1],
                    calibrationPoints[1][0], calibrationPoints[1][1],
                  ]}
                  stroke="black"
                  strokeWidth={2}
                />
                <Text
                  x={(calibrationPoints[0][0] + calibrationPoints[1][0]) / 2}
                  y={(calibrationPoints[0][1] + calibrationPoints[1][1]) / 2 - 20}
                  text={`Distance: ${Math.sqrt(
                    (calibrationPoints[1][0] - calibrationPoints[0][0]) ** 2 +
                    (calibrationPoints[1][1] - calibrationPoints[0][1]) ** 2
                  ).toFixed(1)} px`}
                  fontSize={14}
                  fill="black"
                />
              </>
            )}
          </Layer>
        )}
      </Stage>
    </div>
  );
};

export default FloorplanCanvas;
