import React, { useState } from 'react';
import { SigeaProvider, useSigea } from './context/SigeaContext';
import { Header } from './components/common/Header';
import { ResetModal } from './components/common/ResetModal';
import { LoginView } from './components/auth/LoginView';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Database, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, resetAllData } = useSigea();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleConfirmReset = () => {
    resetAllData();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
        <LoginView />
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          <p>© 2026 SIGEA - Sistema Integral de Gestión de Entornos y Activos.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Institutional Header */}
      <Header onOpenResetModal={() => setResetModalOpen(true)} />

      {/* Main Dynamic Role Content */}
      <main className="flex-1 pb-12">
        {currentUser.rol === 'Aprendiz' && <StudentDashboard />}
        {currentUser.rol === 'Instructor' && <InstructorDashboard />}
        {currentUser.rol === 'Administrador' && <AdminDashboard />}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-2 text-center">
          
          {/* Copyright Centrado */}
          <p className="font-semibold text-slate-700">
            © 2026 SIGEA - Sistema Integral de Gestión de Entornos y Activos.
          </p>

          {/* Estado de LocalStorage y Botón de Reset */}
          <div className="flex items-center space-x-4 text-[11px] text-slate-600 mt-1">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Almacenamiento Local Activo (LocalStorage)
            </span>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setResetModalOpen(true)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-emerald-600" />
              Restablecer Datos de Demostración
            </button>
          </div>

        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default function App() {
  return (
    <SigeaProvider>
      <AppContent />
    </SigeaProvider>
  );
}