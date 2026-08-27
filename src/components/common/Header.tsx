import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import {
  Laptop,
  Users,
  Shield,
  GraduationCap,
  RotateCcw,
  LogOut,
  ChevronDown,
  Sparkles,
  QrCode,
  Calendar
} from 'lucide-react';

interface HeaderProps {
  onOpenResetModal: () => void;
  onOpenQrModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenResetModal, onOpenQrModal }) => {
  const { currentUser, logout, switchUser, users, clases, activeClassId, setActiveClassId, getAmbiente, getSede } = useSigea();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);

  const activeClass = clases.find(c => c.id === activeClassId);
  const activeAmbiente = activeClass ? getAmbiente(activeClass.ambienteId) : undefined;
  const activeSede = activeClass ? getSede(activeClass.sedeId) : undefined;

  const getRoleIcon = (rol?: string) => {
    switch (rol) {
      case 'Instructor':
        return <GraduationCap className="w-4 h-4 text-amber-500" />;
      case 'Administrador':
        return <Shield className="w-4 h-4 text-emerald-500" />;
      default:
        return <Users className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRoleBadgeStyle = (rol?: string) => {
    switch (rol) {
      case 'Instructor':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Administrador':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  return (
    <header className="bg-[#004481] text-white shadow-md sticky top-0 z-40">
      {/* Top Banner / Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-inner text-[#004481] font-black text-xl tracking-tighter">
              <span className="text-[#004481]">S</span>
              <span className="text-[#F9A800]">I</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SIGEA</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#F9A800] text-slate-900 px-2 py-0.5 rounded-full">
                  Prototipo MVP
                </span>
              </div>
              <p className="text-xs text-blue-200 hidden sm:block">
                Sistema Integral de Gestión de Entornos y Activos
              </p>
            </div>
          </div>

          {/* Center Info: Active Session Pill */}
          {currentUser && activeClass && (
            <div className="hidden md:flex items-center space-x-2 bg-[#003366] px-3 py-1.5 rounded-lg border border-blue-400/20 text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#F9A800]" />
              <div className="text-left">
                <div className="text-blue-200 text-[11px] font-medium flex items-center gap-1.5">
                  <span>Clase #{activeClass.id}:</span>
                  <span className="text-white font-semibold">{activeClass.tema.substring(0, 32)}...</span>
                </div>
                <div className="text-blue-300 text-[10px]">
                  {activeAmbiente?.nombre.split('-')[0]} • {activeClass.hora_inicio} - {activeClass.hora_fin}
                </div>
              </div>
            </div>
          )}

          {/* Right Controls: Quick Switcher, Reset, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Reset Data Button */}
            <button
              id="header-reset-data-btn"
              onClick={onOpenResetModal}
              title="Restablecer datos de prueba a valores iniciales"
              className="flex items-center space-x-1.5 text-xs bg-blue-900/60 hover:bg-blue-900 text-blue-100 px-2.5 py-1.5 rounded-md border border-blue-400/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F9A800]" />
              <span className="hidden lg:inline">Restablecer Datos</span>
            </button>

            {/* Quick Role Switcher */}
            {currentUser && (
              <div className="relative">
                <button
                  id="header-quick-role-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md border border-white/20 transition-all text-xs font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F9A800]" />
                  <span className="hidden sm:inline">Cambiar Rol Demo:</span>
                  <span className="font-semibold text-[#F9A800]">{currentUser.rol}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 z-20 border border-slate-200 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Seleccionar Perfil de Demostración
                        </p>
                      </div>
                      <div className="p-1 space-y-1 max-h-80 overflow-y-auto">
                        {users.map(user => {
                          const isSelected = currentUser.documento === user.documento;
                          return (
                            <button
                              key={user.documento}
                              onClick={() => {
                                switchUser(user.documento);
                                setShowUserMenu(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 border border-blue-200 font-semibold text-blue-900'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <div className="p-1 rounded bg-slate-100 text-slate-600">
                                  {getRoleIcon(user.rol)}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">
                                    {user.nombre} {user.apellido}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Doc: {user.documento} {user.fichaId ? `• Ficha ${user.fichaId}` : ''}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                                  user.rol
                                )}`}
                              >
                                {user.rol}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Logout Button */}
            {currentUser && (
              <button
                id="header-logout-btn"
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Bar for Mobile & Role Context */}
      {currentUser && (
        <div className="bg-[#00386c] border-t border-blue-500/20 px-4 py-1.5 text-xs text-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-blue-300">Sesión iniciada como:</span>
            <span className="font-semibold text-white">
              {currentUser.nombre} {currentUser.apellido}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${getRoleBadgeStyle(currentUser.rol)}`}>
              {currentUser.rol}
            </span>
          </div>

          <div className="text-[11px] text-blue-200 flex items-center space-x-2">
            <span className="hidden sm:inline">Ambiente:</span>
            <span className="font-medium text-white">{activeAmbiente ? activeAmbiente.nombre.split('-')[0] : 'Sistemas'}</span>
            <span>•</span>
            <span className="text-[#F9A800] font-semibold">Bogotá D.C.</span>
          </div>
        </div>
      )}
    </header>
  );
};
