// src/App.tsx
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/homescreen/HomeScreen";
import ErrorBoundary from "./utils/error boundary/ErrorBoundary";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="*" element={<ErrorBoundary />} />
        {/* Admin Routes */}
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </div>
  );
}

export default App;
