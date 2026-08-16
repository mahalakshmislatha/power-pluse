import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import LiveMap from './components/LiveMap.jsx';
import DistrictSearch from './components/DistrictSearch.jsx';
import ScheduledShutdowns from './components/ScheduledShutdowns.jsx';
import EbServices from './components/EbServices.jsx';
import ComplaintAndCompensation from './components/ComplaintAndCompensation.jsx';
import ReportButtons from './components/ReportButtons.jsx';
import ReportModal from './components/ReportModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import UserProfileModal from './components/UserProfileModal.jsx';
import { getCoordinates, getAreaName } from './utils/geo.js';

const SOCKET_SERVER = window.location.origin.includes('5173') 
  ? 'http://localhost:5000' 
  : window.location.origin;

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('powerpulse_lang') || 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('powerpulse_theme');
    return saved ? saved === 'dark' : false; // Default to Unique Light Mode
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('powerpulse_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Mahalakshmi',
      email: 'mahalakshmi@powerpulse.tn',
      phone: '+91 98765 43210',
      district: 'Chennai',
      town: 'T. Nagar',
      ebConsumerNo: '011245982012',
      isLoggedIn: true
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [reports, setReports] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [pendingReport, setPendingReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('powerpulse_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('powerpulse_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('powerpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('powerpulse_user');
    }
  }, [user]);

  useEffect(() => {
    // Fetch initial reports via REST API
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch(err => console.error('Error fetching reports:', err));

    // Connect to Socket.io for live updates
    const socket = io(SOCKET_SERVER);

    socket.on('initial_data', (data) => {
      setReports(data);
    });

    socket.on('new_report', (newReport) => {
      setReports(prev => [newReport, ...prev.filter(r => r.id !== newReport.id)]);
      showToast(`New ${newReport.type === 'cut' ? 'Power Cut' : 'Restoration'} reported in ${newReport.area}`);
    });

    socket.on('update_report', (updatedReport) => {
      setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    });

    return () => socket.disconnect();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
    showToast('Profile settings updated successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileModalOpen(false);
    showToast('Logged out successfully.');
  };

  const handleTriggerReport = async (type) => {
    setIsLocating(true);
    try {
      const coords = await getCoordinates();
      const locationInfo = await getAreaName(coords.lat, coords.lng);
      
      setPendingReport({
        type,
        coords,
        locationInfo
      });
    } catch (err) {
      console.error('Location error:', err);
      showToast('Could not detect location. Please check location permissions.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmitReport = async (reportData) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      
      if (response.ok) {
        const savedReport = await response.json();
        setReports(prev => [savedReport, ...prev.filter(r => r.id !== savedReport.id)]);
        setPendingReport(null);
        showToast(`Report logged for ${savedReport.area}!`);
      } else {
        showToast('Failed to submit report.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Server error while submitting report.');
    }
  };

  const handleConfirmReport = async (reportId) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/confirm`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
        showToast('Confirmation recorded! Thank you.');
      }
    } catch (err) {
      console.error('Confirm error:', err);
    }
  };

  const activeCutsCount = reports.filter(r => r.type === 'cut' && r.status === 'active').length;

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Header
        activeOutagesCount={activeCutsCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        lang={lang}
        setLang={setLang}
      />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        lang={lang}
      />

      {toastMessage && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 text-xs px-4 py-2 rounded-full shadow-lg border animate-bounce ${
          isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900 shadow-md'
        }`}>
          {toastMessage}
        </div>
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === 'map' && (
          <LiveMap 
            reports={reports} 
            onConfirmReport={handleConfirmReport}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'districts' && (
          <DistrictSearch
            reports={reports}
            onConfirmReport={handleConfirmReport}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        )}

        {activeTab === 'shutdowns' && (
          <ScheduledShutdowns isDarkMode={isDarkMode} lang={lang} />
        )}

        {activeTab === 'eb-services' && (
          <EbServices isDarkMode={isDarkMode} lang={lang} />
        )}

        {activeTab === 'complaint' && (
          <ComplaintAndCompensation isDarkMode={isDarkMode} lang={lang} />
        )}
      </main>

      {activeTab === 'map' && (
        <ReportButtons 
          onTriggerReport={handleTriggerReport} 
          isLocating={isLocating}
          isDarkMode={isDarkMode}
          lang={lang}
        />
      )}

      <ReportModal
        pendingReport={pendingReport}
        onClose={() => setPendingReport(null)}
        onSubmit={handleSubmitReport}
        isDarkMode={isDarkMode}
        lang={lang}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
        lang={lang}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        lang={lang}
      />
    </div>
  );
}
