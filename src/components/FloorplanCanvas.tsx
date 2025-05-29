import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Circle, Text, Grid } from "react-konva";
import useImage from "use-image";

type Props = {
  width?: number;
  height?: number;
};

const FloorplanCanvas: React.FC<Props> = ({ width = 1024, height = 768 }) => {
  const stageRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [imageLocked, setImageLocked] = useState(false);

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<[number, number][]>([]);
  const [scaleRatio, setScaleRatio] = useState<number | null>(null);

  const [floorplanImage] = useImage(imageUrl || "");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setImageScale(1);
      setImageLocked(false);
      setCalibrationPoints([]);
      setScaleRatio(null);
    };
    reader.readAsDataURL(file);
  };

  const handleZoom = (delta: number) => {
    const newScale = Math.min(Math.max(scale + delta, 0.5), 2.5);
    setScale(newScale);
  };

  const handleImageResize = (delta: number) => {
    if (imageLocked) return;
    const newImageScale = Math.min(Math.max(imageScale + delta, 0.1), 3);
    setImageScale(newImageScale);
  };

  const handleLockImage = () => {
    setImageLocked(true);
  };

  const handleStageClick = (e: any) => {
    if (!isCalibrating) return;

    const stage = stageRef.current;
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
        setScaleRatio(newScaleRatio);
        console.log("Calibration scaleRatio:", newScaleRatio);
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
  }, []);

  return (
    <div className="relative">
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm" />
        <button onClick={() => handleZoom(0.2)} className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-sm hover:shadow transition-shadow text-sm">+</button>
        <button onClick={() => handleZoom(-0.2)} className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-sm hover:shadow transition-shadow text-sm">-</button>
        {!imageLocked && (
          <>
            <button onClick={() => handleImageResize(0.2)} className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-sm hover:shadow transition-shadow text-sm">Image +</button>
            <button onClick={() => handleImageResize(-0.2)} className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-sm hover:shadow transition-shadow text-sm">Image -</button>
            <button onClick={handleLockImage} className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-sm hover:shadow transition-shadow text-sm">Fix Image Size</button>
          </>
        )}
        {imageLocked && (
          <button onClick={() => setIsCalibrating(true)} className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-sm hover:shadow transition-shadow text-sm">Calibrate</button>
        )}
      </div>

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onDragMove={(e) => setPosition(e.target.position())}
        onClick={handleStageClick}
        className="border shadow bg-white"
      >
        <Layer>
          {floorplanImage && (
            <KonvaImage image={floorplanImage} scale={{ x: imageScale, y: imageScale }} />
          )}
        </Layer>
        <Layer>
          {/* Vertical lines */}
          {Array.from({ length: Math.ceil((width * 2) / 50) }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * 50 - width/2, -height/2, i * 50 - width/2, height * 1.5]}
              stroke="#ddd"
              strokeWidth={1}
              dash={[5, 5]}
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: Math.ceil((height * 2) / 50) }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[-width/2, i * 50 - height/2, width * 1.5, i * 50 - height/2]}
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
