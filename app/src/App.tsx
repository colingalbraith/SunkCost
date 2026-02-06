import { useState } from 'react';
import { useSessionTracker, useIntentions, useSettings } from './hooks';
import { Timer } from './components/Timer';
import { Dashboard } from './components/Dashboard';
import { Intentions } from './components/Intentions';
import { SessionHistory } from './components/SessionHistory';
import { Settings } from './components/Settings';
import logo from './assets/logo.png';
import './App.css';

type Tab = 'timer' | 'dashboard' | 'intentions' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');

  const {
    isTracking,
    elapsedTime,
    sessions,
    clearSessions,
    todayTotal,
    weekTotal,
    allTimeTotal,
  } = useSessionTracker();

  const { intentions, addIntention, removeIntention } = useIntentions();
  const { settings, updateSettings } = useSettings();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timer', label: 'Track' },
    { id: 'dashboard', label: 'Truth' },
    { id: 'intentions', label: 'Lies' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="container" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="SunkCost" style={{ height: '2.5rem', width: 'auto' }} />
          <h1 style={{ margin: 0 }}>SunkCost</h1>
        </div>
      </header>

      {/* Navigation - centered, no scroll */}
      <div className="container" style={{ paddingTop: '1rem', paddingBottom: 0 }}>
        <nav className="nav" style={{ justifyContent: 'center' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: '0 0 auto', padding: '0.75rem 1rem' }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="container fade-in" key={activeTab}>
        {activeTab === 'timer' && (
          <Timer
            isTracking={isTracking}
            elapsedTime={elapsedTime}
            todayTotal={todayTotal}
            sessions={sessions}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            todayTotal={todayTotal}
            weekTotal={weekTotal}
            allTimeTotal={allTimeTotal}
            birthYear={settings.birth_year}
            lifeExpectancy={settings.life_expectancy}
            sessions={sessions}
            currentSessionTime={isTracking ? elapsedTime : 0}
          />
        )}

        {activeTab === 'intentions' && (
          <Intentions
            intentions={intentions}
            todayTotal={todayTotal}
            onAddIntention={addIntention}
            onRemoveIntention={removeIntention}
          />
        )}

        {activeTab === 'history' && (
          <SessionHistory
            sessions={sessions}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            birthYear={settings.birth_year}
            lifeExpectancy={settings.life_expectancy}
            onUpdate={updateSettings}
            onClearHistory={clearSessions}
          />
        )}
      </main>
    </div>
  );
}

export default App;
