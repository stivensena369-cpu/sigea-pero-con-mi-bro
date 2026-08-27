import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900">Restablecer Datos de Demostración</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-sm text-slate-600">
          <p>
            Esta acción restablecerá todas las tablas en <strong>localStorage</strong> a sus valores predeterminados de fábrica:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <li>Usuarios originales (Carlos Instructor, Juan Aprendiz, María, Admin)</li>
            <li>Ambientes 101 (Torres) y 102 (Todo-en-Uno)</li>
            <li>Inventario de códigos QR (Monitores, Teclados, Ratones, Torres)</li>
            <li>Historial de auditoría y registros activos de clase</li>
          </ul>
          <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Útil para reiniciar demostraciones o probar el flujo de escaneo desde cero.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sí, Restablecer Todo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
