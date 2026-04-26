import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ComplaintProvider } from './context/ComplaintContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import MapViewPage from './pages/MapViewPage';
import Track from './pages/Track';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <ComplaintProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="report" element={<ReportIssue />} />
            <Route path="map" element={<MapViewPage />} />
            <Route path="track" element={<Track />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ComplaintProvider>
  );
}

export default App;
