import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import EmployeeList from './components/employees/EmployeeList';
import TeamList from './components/teams/TeamList';
import ShiftTypeConfig from './components/config/ShiftTypeConfig';
import RuleConfig from './components/config/RuleConfig';
import PlanningGrid from './components/planning/PlanningGrid';
import AbsenceList from './components/absences/AbsenceList';
import ReportsDashboard from './components/reports/ReportsDashboard';
import Login from './pages/Login';
import { Users, Calendar, BarChart, ShieldAlert, UserX, Layers, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from './store';

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

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useStore();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout: React.FC = () => {
  const { logout } = useStore();
  return (
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
        <div className="p-4 border-t border-gray-800">
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white w-full">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
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
  );
};

const App: React.FC = () => {
  const { fetchAll, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
        fetchAll();
    }
  }, [fetchAll, isAuthenticated]);

  return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
                <PrivateRoute>
                    <AppLayout />
                </PrivateRoute>
            } />
        </Routes>
    </Router>
  );
};

export default App;
