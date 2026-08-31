import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import { AlertTriangle, X, Send, ShieldAlert } from 'lucide-react';

interface ReportNovedadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQr?: string;
  defaultClaseId?: number;
}

export const ReportNovedadModal: React.FC<ReportNovedadModalProps> = ({
  isOpen,
  onClose,
  defaultQr,
  defaultClaseId
}) => {
  const { currentUser, activos, reportarNovedad, activeClassId } = useSigea();
  const [codigoQr, setCodigoQr] = useState(defaultQr || '');
  const [tipoNovedad, setTipoNovedad] = useState<'Fallo Físico' | 'Fallo Eléctrico' | 'Falta Accesorio' | 'Desgaste' | 'Otro'>('Fallo Físico');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta' | 'Crítica'>('Media');
  const [descripcion, setDescripcion] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoQr.trim() || !descripcion.trim()) return;

    reportarNovedad({
      codigo_qr: codigoQr.trim().toUpperCase(),
      reportadoPorDoc: currentUser ? currentUser.documento : '1002',
      rolReportante: currentUser ? currentUser.rol : 'Aprendiz',
      claseId: defaultClaseId || activeClassId,
      tipoNovedad,
      descripcion,
      prioridad
    });

    setSuccessMsg('Novedad reportada correctamente al equipo técnico e instructor.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900">Reportar Novedad o Daño en Activo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Código QR del Activo Afectado
              </label>
              <input
                type="text"
                required
                value={codigoQr}
                onChange={e => setCodigoQr(e.target.value.toUpperCase())}
                placeholder="Ejemplo: QR-MON-001 o QR-TEC-002"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Novedad</label>
                <select
                  value={tipoNovedad}
                  onChange={e => setTipoNovedad(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none"
                >
                  <option value="Fallo Físico">Fallo Físico (Rotura/Golpe)</option>
                  <option value="Fallo Eléctrico">Fallo Eléctrico / No Enciende</option>
                  <option value="Falta Accesorio">Falta Cable / Accesorio</option>
                  <option value="Desgaste">Desgaste o Mal Contacto</option>
                  <option value="Otro">Otro Motivo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nivel de Prioridad</label>
                <select
                  value={prioridad}
                  onChange={e => setPrioridad(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Baja">Baja (Funciona con detalle)</option>
                  <option value="Media">Media (Afecta ergonomía)</option>
                  <option value="Alta">Alta (No utilizable)</option>
                  <option value="Crítica">Crítica (Riesgo eléctrico/daño)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Descripción Detallada del Problema
              </label>
              <textarea
                required
                rows={3}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Indica qué ocurre con el equipo (ej. la pantalla parpadea, no reconoce clic derecho, tecla trabada...)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Reporte</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};