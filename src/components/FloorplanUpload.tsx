import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFloorplan } from '../context/useFloorplan';

const FloorplanUpload: React.FC = () => {
  const { handleImageUpload } = useFloorplan();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0]);
      }
    },
    [handleImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-blue-500 hover:bg-gray-100"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg font-medium text-gray-600">Drop the floorplan image here...</p>
        ) : (
          <>
            <p className="mb-2 text-lg font-medium text-gray-600">Upload your floorplan</p>
            <p className="text-sm text-gray-500">
              Drag and drop your floorplan image here, or click to select a file
            </p>
            <p className="mt-2 text-xs text-gray-400">Supported formats: PNG, JPG, JPEG</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FloorplanUpload;
