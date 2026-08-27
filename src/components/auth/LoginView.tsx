import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import {
  Shield,
  GraduationCap,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  QrCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, users } = useSigea();
  const [documento, setDocumento] = useState('1002'); // Defaults to Juan (Student)
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(documento, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (doc: string) => {
    setDocumento(doc);
    setErrorMsg('');
    login(doc, '123456');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative Top Pattern */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#004481] shadow-xl text-white font-black text-2xl tracking-tighter mb-3 border-2 border-white/20">
          <span className="text-white">S</span>
          <span className="text-[#F9A800]">I</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          SIGEA
        </h1>
        <p className="text-xs font-semibold text-[#004481] tracking-wide uppercase mt-0.5">
          Sistema Integral de Gestión de Entornos y Activos
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Control de sesiones de formación y trazabilidad de activos tecnológicos por código QR
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número de Documento (Identificación)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  id="login-doc-input"
                  value={documento}
                  onChange={e => setDocumento(e.target.value)}
                  placeholder="Ej. 1001, 1002, 1003, 1004"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004481]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña Institucional
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  id="login-password-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004481]"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Para el prototipo de prueba, cualquier contraseña es aceptada.
              </p>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full py-3 bg-[#004481] hover:bg-[#003366] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4 text-[#F9A800]" />
            </button>
          </form>

          {/* Quick Access Demo Profiles */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-3">
              <Sparkles className="w-4 h-4 text-[#F9A800]" />
              <span>Accesos Rápidos de Prueba (Haz clic para ingresar):</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('1002')}
                className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    JP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                      Juan Pérez (Aprendiz)
                    </div>
                    <div className="text-[10px] text-slate-500">Doc: 1002 • Ficha 123456 (ADSO)</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
                  Escanear Activos
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('1001')}
                className="w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-left flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                    CR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                      Carlos Ramírez (Instructor)
                    </div>
                    <div className="text-[10px] text-slate-500">Doc: 1001 • Control de Aula 101</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Autorizar & Monitorear
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('1003')}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    MG
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      María Gómez (Aprendiz)
                    </div>
                    <div className="text-[10px] text-slate-500">Doc: 1003 • (Ya tiene puesto registrado)</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Puesto Listo
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('1004')}
                className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-left flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    AD
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                      Roberto Admin (Administrador)
                    </div>
                    <div className="text-[10px] text-slate-500">Doc: 1004 • CSV, Auditoría & Clases</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Panel Completo
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Scope Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Persistencia local en el navegador (LocalStorage)</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Sedes activas: CGMLTI (Ambiente 101 con Torres) • Unigermana (Ambiente 102 Todo-en-Uno)
          </p>
        </div>
      </div>
    </div>
  );
};
