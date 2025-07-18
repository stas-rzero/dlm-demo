import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFloorplan } from '../context/useFloorplan';
import LoadingOverlay from './LoadingOverlay';

const FloorplanUpload: React.FC = () => {
  const { handleImageUpload } = useFloorplan();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsLoading(true);
        setError(null);
        try {
          await handleImageUpload(acceptedFiles[0]);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to upload floorplan');
        } finally {
          setIsLoading(false);
        }
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
        {isLoading ? (
          <LoadingOverlay message="Uploading floorplan..." />
        ) : error ? (
          <>
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
            <p className="text-lg font-medium text-red-600">{error}</p>
            <p className="mt-2 text-sm text-gray-500">Please try again</p>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default FloorplanUpload;
