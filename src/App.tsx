import React from "react";
import FloorplanCanvas from "./components/FloorplanCanvas";

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <FloorplanCanvas />
    </div>
  );
};

export default App;
