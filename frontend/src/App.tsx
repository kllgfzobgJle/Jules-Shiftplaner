import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EmployeeList from './components/employees/EmployeeList';
import TeamList from './components/teams/TeamList';
import ShiftTypeConfig from './components/config/ShiftTypeConfig';
import RuleConfig from './components/config/RuleConfig';
import PlanningGrid from './components/planning/PlanningGrid';
import AbsenceList from './components/absences/AbsenceList';
import ReportsDashboard from './components/reports/ReportsDashboard';
import { Users, Calendar, BarChart, ShieldAlert, UserX, Layers } from 'lucide-react';
import { clsx } from 'clsx';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-wider">SHIFT PLANNER</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavLink to="/" icon={<Calendar size={20} />} label="Planning" />
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Management
            </div>
            <NavLink to="/employees" icon={<Users size={20} />} label="Employees" />
            <NavLink to="/teams" icon={<Users size={20} />} label="Teams" />
            <NavLink to="/absences" icon={<UserX size={20} />} label="Absences" />
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Configuration
            </div>
            <NavLink to="/config/shifts" icon={<Layers size={20} />} label="Shift Types" />
            <NavLink to="/config/rules" icon={<ShieldAlert size={20} />} label="Rules" />
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Analysis
            </div>
            <NavLink to="/reports" icon={<BarChart size={20} />} label="Reports" />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow p-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            {/* Add user profile or settings here if needed */}
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<PlanningGrid />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/teams" element={<TeamList />} />
              <Route path="/absences" element={<AbsenceList />} />
              <Route path="/config/shifts" element={<ShiftTypeConfig />} />
              <Route path="/config/rules" element={<RuleConfig />} />
              <Route path="/reports" element={<ReportsDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
