import React from 'react';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import i18n config
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PolicyPage from './pages/PolicyPage';
import TermsPage from './pages/TermsPage';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
