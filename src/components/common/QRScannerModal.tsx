import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import { TipoActivo, Activo } from '../../types';
import {
  QrCode,
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Search,
  Zap,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: TipoActivo;
  onScanned: (codigoQr: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  targetType,
  onScanned
}) => {
  const { activos, getActiveClass, getAmbiente, registros, activeClassId } = useSigea();
  const [manualCode, setManualCode] = useState('');
  const [activeTab, setActiveTab] = useState<'simulador' | 'camara' | 'manual'>('simulador');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const activeClass = getActiveClass();
  const activeAmbiente = activeClass ? getAmbiente(activeClass.ambienteId) : undefined;

  const relevantActivos = activos.filter(a => {
    const matchesType =
      a.tipo === targetType ||
      (targetType === 'Monitor' && a.tipo === 'Todo-en-Uno') ||
      (targetType === 'Todo-en-Uno' && a.tipo === 'Monitor');
    return matchesType;
  });

  const filteredActivos = relevantActivos.filter(
    a =>
      a.codigo_qr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.puestoNumero && `Puesto ${a.puestoNumero}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSimulateScan = (qrCode: string) => {
    setIsScanning(true);
    setFeedback(null);

    setTimeout(() => {
      setIsScanning(false);
      onScanned(qrCode);
    }, 450);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setFeedback({ type: 'error', message: 'Por favor ingresa un código QR.' });
      return;
    }
    handleSimulateScan(manualCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900/10 text-brand-900 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Escanear Código QR de Activo</h3>
              <p className="text-xs text-slate-500">
                Slot de Registro:{' '}
                <span className="font-bold text-brand-900 bg-brand-900/5 px-2 py-0.5 rounded border border-brand-700/30">
                  {targetType}
                </span>{' '}
                • {activeAmbiente ? activeAmbiente.nombre.split('-')[0] : 'Ambiente Activo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('simulador')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'simulador'
                ? 'bg-white text-brand-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Lista de QR Disponibles (Simulación)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('camara')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'camara'
                ? 'bg-white text-brand-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Escáner Láser Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-brand-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Entrada Manual</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-3 p-3 rounded-xl flex items-center space-x-2 text-xs ${
              feedback.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {/* TAB 1: Fast Simulator list */}
          {activeTab === 'simulador' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Buscar QR de ${targetType}, marca o puesto...`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between items-center px-1">
                <span>Haz clic en un código QR para simular su escaneo inmediato:</span>
                <span className="font-semibold text-slate-700">{filteredActivos.length} activos encontrados</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
                {filteredActivos.map(item => {
                  const isRegisteredInThisClass = registros.some(
                    r => r.id_activo.toUpperCase() === item.codigo_qr.toUpperCase() && r.id_clase === activeClassId && !r.liberadoPorCambio
                  );
                  const isAvailable = item.estado === 'Disponible' && !isRegisteredInThisClass;

                  return (
                    <button
                      key={item.codigo_qr}
                      type="button"
                      disabled={isScanning}
                      onClick={() => handleSimulateScan(item.codigo_qr)}
                      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                        isAvailable
                          ? 'border-slate-200 hover:border-brand-700 hover:bg-brand-900/5 bg-white shadow-xs cursor-pointer'
                          : 'border-slate-200 bg-slate-50/80 text-slate-400 cursor-pointer hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-xs text-brand-900">
                            {item.codigo_qr}
                          </span>
                          {item.puestoNumero && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                              Puesto {item.puestoNumero}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isAvailable ? 'Disponible' : isRegisteredInThisClass ? 'En uso en clase' : item.estado}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 font-medium truncate">
                        {item.marca}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100">
                        <span className="truncate">{item.serial}</span>
                        <span className="text-brand-900 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Escanear <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Demo test: Scannning wrong asset to show validation */}
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-900 font-semibold">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>¿Quieres probar la validación de error?</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Prueba escanear un activo incorrecto (ej. un teclado en slot de monitor) para comprobar el validador estricto.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateScan('QR-INEXISTENTE-999')}
                    className="text-[10px] bg-white text-red-700 px-2 py-1 rounded border border-red-300 font-medium hover:bg-red-50"
                  >
                    Probar QR Inexistente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateScan(targetType === 'Monitor' ? 'QR-TEC-001' : 'QR-MON-001')}
                    className="text-[10px] bg-white text-amber-800 px-2 py-1 rounded border border-amber-300 font-medium hover:bg-amber-100"
                  >
                    Probar Tipo Opuesto ({targetType === 'Monitor' ? 'Teclado' : 'Monitor'})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Visual Laser Viewfinder */}
          {activeTab === 'camara' && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-64 h-64 bg-slate-950 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-700 flex items-center justify-center">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-lg" />

                <div className="absolute inset-x-4 top-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce" />

                <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl text-center border border-white/20">
                  <QrCode className="w-16 h-16 text-white mx-auto opacity-80 animate-pulse" />
                  <p className="text-[11px] text-white/70 mt-2 font-mono font-bold">
                    [Apuntando a Activo {targetType}]
                  </p>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-emerald-400 font-bold text-xs space-y-2">
                    <CheckCircle2 className="w-8 h-8 animate-spin" />
                    <span>Decodificando Código QR...</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Encuadra el código QR impreso en el {targetType}. Selecciona un QR sugerido abajo para capturarlo:
              </p>

              {filteredActivos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {filteredActivos.slice(0, 3).map(a => (
                    <button
                      key={a.codigo_qr}
                      type="button"
                      onClick={() => handleSimulateScan(a.codigo_qr)}
                      className="px-3 py-1.5 bg-brand-900 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5 text-brand-400" />
                      <span>Capturar {a.codigo_qr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Manual Code input */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código QR o Serial del Activo ({targetType})
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value)}
                    placeholder="Ejemplo: QR-MON-001 o QR-TEC-001"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-semibold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                  {manualCode && (
                    <button
                      type="button"
                      onClick={() => setManualCode('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ingresa manualmente el código alfanumérico visible bajo la etiqueta QR.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-semibold text-slate-700">Códigos rápidos de prueba para {targetType}:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {filteredActivos.slice(0, 4).map(a => (
                    <button
                      key={a.codigo_qr}
                      type="button"
                      onClick={() => setManualCode(a.codigo_qr)}
                      className="px-2 py-1 bg-white border border-slate-300 text-slate-800 rounded font-mono text-[10px] hover:border-brand-700 hover:text-brand-900"
                    >
                      {a.codigo_qr}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Confirmar y Validar Activo</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};