// src/App.tsx
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/homescreen/HomeScreen";
import ErrorBoundary from "./utils/error boundary/ErrorBoundary";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<ErrorBoundary />} />
        {/* Admin Routes */}
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </>
  );
}

export default App;
