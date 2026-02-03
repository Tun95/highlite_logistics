import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Loading from "./utilities/global loadingmsg/loading/Loading";
import ErrorBoundary from "./utilities/error boundary/ErrorBoundary";

import DashboardScreen from "./screens/dashboardscreen/DashboardScreen";
import CryptoListScreen from "./screens/cryptolistscreen/CryptoListScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster expand visibleToasts={1} />
      <Routes>
        <Route path="*" element={<ErrorBoundary />} />
        {/* Admin Routes */}
        <Route path="/" element={<DashboardScreen />} />

        <Route path="/crypto" element={<CryptoListScreen />} />
      </Routes>
    </div>
  );
}

export default App;
