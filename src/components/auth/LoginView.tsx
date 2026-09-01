import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useSigea();
  const [documento, setDocumento] = useState('1002');
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-2 mb-2">
          <img src="/logo_transparente.png" alt="SIGEA Logo" className="h-16 w-auto object-contain" />
        </div>
        <h1 className="text-2xl font-black text-[#002D5A] tracking-tight">
          SIGEA
        </h1>
        <p className="text-xs font-bold text-emerald-600 tracking-wide uppercase mt-0.5">
          Sistema Integral de Gestión de Entornos y Activos
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Control de sesiones de formación y trazabilidad de activos tecnológicos por código QR
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          
          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002D5A] focus:border-transparent focus:bg-white transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002D5A] focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Para el prototipo de prueba, cualquier contraseña es aceptada.
              </p>
            </div>

            {/* Main Action Button - Navy Brand Color */}
            <button
              type="submit"
              id="login-submit-btn"
              className="w-full py-3 bg-[#002D5A] hover:bg-[#001f3f] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>
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