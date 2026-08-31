import React from 'react';
import { Activo } from '../../types';
import { QrCode, Printer, X, Tag, Cpu, ShieldCheck } from 'lucide-react';

interface QRBadgeModalProps {
  activo: Activo | null;
  onClose: () => void;
}

export const QRBadgeModal: React.FC<QRBadgeModalProps> = ({ activo, onClose }) => {
  if (!activo) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-brand-900">
            <Tag className="w-5 h-5" />
            <h3 className="font-bold text-slate-900">Etiqueta Institucional de Activo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div id="printable-qr-badge" className="my-5 p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center flex flex-col items-center">
          {/* Header Tag */}
          <div className="flex items-center justify-between w-full px-2 pb-3 border-b border-slate-200 text-xs">
            <span className="font-black text-brand-900 tracking-wider">SIGEA • INSTITUTO</span>
            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              Inventario Activo
            </span>
          </div>

          {/* SVG QR Code Simulation with visual matrix pattern */}
          <div className="my-4 p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-36 h-36 text-slate-900 fill-current">
              {/* Corner 1 */}
              <rect x="5" y="5" width="30" height="30" rx="4" />
              <rect x="10" y="10" width="20" height="20" fill="white" />
              <rect x="15" y="15" width="10" height="10" />

              {/* Corner 2 */}
              <rect x="65" y="5" width="30" height="30" rx="4" />
              <rect x="70" y="10" width="20" height="20" fill="white" />
              <rect x="75" y="15" width="10" height="10" />

              {/* Corner 3 */}
              <rect x="5" y="65" width="30" height="30" rx="4" />
              <rect x="10" y="70" width="20" height="20" fill="white" />
              <rect x="15" y="75" width="10" height="10" />

              {/* Data Blocks Pattern */}
              <rect x="42" y="10" width="6" height="6" />
              <rect x="50" y="18" width="6" height="6" />
              <rect x="42" y="26" width="6" height="6" />
              
              <rect x="10" y="42" width="6" height="6" />
              <rect x="22" y="50" width="6" height="6" />
              <rect x="30" y="42" width="6" height="6" />

              <rect x="42" y="42" width="16" height="16" rx="2" fill="#13223B" />
              <rect x="46" y="46" width="8" height="8" fill="#468F7B" />

              <rect x="65" y="42" width="6" height="6" />
              <rect x="75" y="50" width="6" height="6" />
              <rect x="85" y="42" width="6" height="6" />

              <rect x="42" y="65" width="6" height="6" />
              <rect x="50" y="75" width="6" height="6" />
              <rect x="42" y="85" width="6" height="6" />

              <rect x="65" y="65" width="10" height="10" />
              <rect x="80" y="80" width="12" height="12" />
            </svg>
            <span className="font-mono font-black text-sm text-brand-900 tracking-widest mt-2">
              {activo.codigo_qr}
            </span>
          </div>

          {/* Details */}
          <div className="w-full text-left bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Tipo:</span>
              <span className="font-bold text-slate-800">{activo.tipo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Marca / Modelo:</span>
              <span className="font-semibold text-slate-800">{activo.marca}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Serial:</span>
              <span className="font-mono text-slate-700">{activo.serial}</span>
            </div>
            {activo.puestoNumero && (
              <div className="flex justify-between border-t border-slate-100 pt-1">
                <span className="text-slate-500 font-medium">Puesto Sugerido:</span>
                <span className="font-bold text-brand-900">Puesto {activo.puestoNumero}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Válido para lectura en SIGEA App
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-brand-900 hover:bg-brand-800 text-white rounded-lg transition-colors font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-brand-400" />
              <span>Imprimir Etiqueta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};