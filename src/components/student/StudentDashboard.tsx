import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import { TipoActivo, RegistroActivo } from '../../types';
import { QRScannerModal } from '../common/QRScannerModal';
import { QRBadgeModal } from '../common/QRBadgeModal';
import { ReportNovedadModal } from '../common/ReportNovedadModal';
import {
  Monitor,
  Keyboard,
  Mouse,
  Cpu,
  Tv,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  UserCheck,
  RotateCcw,
  Sparkles,
  History,
  CheckSquare,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Trash2
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    getActiveClass,
    getAmbiente,
    getSede,
    getUser,
    activos,
    registros,
    solicitudesCambio,
    registrarActivo,
    eliminarRegistroActivo,
    solicitarCambioPuesto,
    finalizarSesionAprendiz,
    isStudentWorkstationComplete,
    activeClassId
  } = useSigea();

  const [activeTab, setActiveTab] = useState<'registro' | 'historial'>('registro');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [targetType, setTargetType] = useState<TipoActivo>('Monitor');
  const [selectedBadgeAsset, setSelectedBadgeAsset] = useState<any | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetQr, setReportTargetQr] = useState<string | undefined>(undefined);

  // Finalize Class Modal
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [estadoDevolucion, setEstadoDevolucion] = useState<'Excelente' | 'Bueno' | 'Con Novedad'>('Excelente');
  const [observacionesFinal, setObservacionesFinal] = useState('');
  const [finalizedSuccess, setFinalizedSuccess] = useState(false);

  // Change Workstation Request Modal
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [motivoCambio, setMotivoCambio] = useState('Equipo no enciende / Problema de hardware');

  // Scanner alert toast
  const [scanToast, setScanToast] = useState<{ success: boolean; message: string } | null>(null);

  const activeClass = getActiveClass();
  const activeAmbiente = activeClass ? getAmbiente(activeClass.ambienteId) : undefined;
  const activeSede = activeClass ? getSede(activeClass.sedeId) : undefined;
  const instructor = activeClass ? getUser(activeClass.instructorDoc) : undefined;

  const studentDoc = currentUser?.documento || '1002';
  const studentRegistrations = registros.filter(
    r => r.id_usuario === studentDoc && r.id_clase === activeClassId && !r.liberadoPorCambio
  );

  const isComplete = isStudentWorkstationComplete(studentDoc, activeClassId);

  // Check if instructor authorized a change
  const myChangeRequest = solicitudesCambio.find(
    s => s.aprendizDoc === studentDoc && s.claseId === activeClassId
  );
  const wasAuthorizedRecently = myChangeRequest?.estado === 'Autorizado' && studentRegistrations.length === 0;

  // Determine required asset slots for current classroom
  const requiredSlots: { type: TipoActivo; label: string; icon: React.ReactNode }[] = [
    {
      type: activeAmbiente?.tipoEquipamiento === 'All_in_One' ? 'Todo-en-Uno' : 'Monitor',
      label: activeAmbiente?.tipoEquipamiento === 'All_in_One' ? 'Computador Todo-en-Uno (AIO)' : 'Monitor Principal (24")',
      icon: activeAmbiente?.tipoEquipamiento === 'All_in_One' ? <Tv className="w-6 h-6" /> : <Monitor className="w-6 h-6" />
    },
    {
      type: 'Teclado',
      label: 'Teclado USB Español',
      icon: <Keyboard className="w-6 h-6" />
    },
    {
      type: 'Ratón',
      label: 'Ratón / Mouse Óptico',
      icon: <Mouse className="w-6 h-6" />
    }
  ];

  if (activeAmbiente?.tipoEquipamiento === 'Torre_y_Perifericos') {
    requiredSlots.push({
      type: 'Torre',
      label: 'Torre CPU / Computador',
      icon: <Cpu className="w-6 h-6" />
    });
  }

  const completedCount = requiredSlots.filter(slot =>
    studentRegistrations.some(r => r.tipo_activo === slot.type || (slot.type === 'Monitor' && r.tipo_activo === 'Todo-en-Uno'))
  ).length;

  const totalRequired = requiredSlots.length;
  const progressPercent = Math.round((completedCount / totalRequired) * 100);

  const handleOpenScanner = (slotType: TipoActivo) => {
    setTargetType(slotType);
    setScannerOpen(true);
  };

  const handleScannedResult = (codigoQr: string) => {
    const res = registrarActivo(studentDoc, activeClassId, codigoQr, targetType);
    setScannerOpen(false);
    setScanToast(res);
    setTimeout(() => {
      setScanToast(null);
    }, 4500);
  };

  const handleSendChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    solicitarCambioPuesto(studentDoc, activeClassId, motivoCambio);
    setShowChangeRequestModal(false);
    setScanToast({
      success: true,
      message: 'Solicitud enviada al instructor. Espera su autorización para liberar tu puesto anterior.'
    });
    setTimeout(() => setScanToast(null), 4000);
  };

  const handleFinalizeSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    finalizarSesionAprendiz(studentDoc, activeClassId, estadoDevolucion, observacionesFinal);
    setShowFinalizeModal(false);
    setFinalizedSuccess(true);
  };

  // Past student registrations history
  const pastRegistrations = registros.filter(r => r.id_usuario === studentDoc);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {scanToast && (
        <div
          className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200 ${
            scanToast.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            {scanToast.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-xs font-semibold">{scanToast.message}</span>
          </div>
          <button
            onClick={() => setScanToast(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Authorized Workstation Change Banner */}
      {wasAuthorizedRecently && (
        <div className="p-4 bg-amber-500 text-slate-950 rounded-2xl shadow-md border-2 border-amber-400 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-slate-950" />
            <div>
              <h4 className="font-bold text-sm">¡Cambio de Puesto Autorizado por el Instructor!</h4>
              <p className="text-xs font-medium text-slate-900">
                Tus activos anteriores fueron liberados. Por favor procede a escanear los códigos QR de tu nueva estación.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenScanner(requiredSlots[0].type)}
            className="px-4 py-2 bg-[#004481] text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-900 transition-colors shrink-0"
          >
            Comenzar Nuevo Escaneo
          </button>
        </div>
      )}

      {/* Top Banner: Active Class Session Card */}
      {activeClass && (
        <div className="bg-gradient-to-r from-[#004481] to-[#002f5a] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-white/5 skew-x-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-[#F9A800] text-slate-900 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                  Sesión en Curso
                </span>
                <span className="text-blue-200">Ficha: {activeClass.fichaId} (ADSO)</span>
                <span className="text-blue-300">•</span>
                <span className="text-blue-200">Clase #{activeClass.id}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeClass.tema}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-blue-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#F9A800]" />
                  <span>
                    {activeAmbiente?.nombre.split('-')[0]} • {activeSede?.nombre.split('(')[0]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#F9A800]" />
                  <span>
                    {activeClass.fecha} | {activeClass.hora_inicio} - {activeClass.hora_fin}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-[#F9A800]" />
                  <span>Instructor: {instructor ? `${instructor.nombre} ${instructor.apellido}` : 'Carlos Ramírez'}</span>
                </div>
              </div>
            </div>

            {/* Right Workstation Status Capsule */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[200px] shrink-0">
              <span className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold block mb-1">
                Estado del Puesto
              </span>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isComplete ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}
                />
                <span className="font-bold text-sm text-white">
                  {isComplete ? 'Puesto Completo (Listo)' : `${completedCount} de ${totalRequired} Activos`}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-blue-950/60 rounded-full h-2 overflow-hidden border border-blue-400/30">
                <div
                  className={`h-full transition-all duration-500 ${
                    isComplete ? 'bg-emerald-400' : 'bg-[#F9A800]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-blue-200 mt-1 block">
                {isComplete ? '100% verificado' : `Faltan ${totalRequired - completedCount} activos por escanear`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs for Student */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('registro')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'registro'
                ? 'bg-[#004481] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-[#F9A800]" />
            <span>Registro de Puesto Actual</span>
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'historial'
                ? 'bg-[#004481] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4 text-[#F9A800]" />
            <span>Mi Historial de Activos y Clases</span>
          </button>
        </div>

        <button
          onClick={() => {
            setReportTargetQr('');
            setReportModalOpen(true);
          }}
          className="flex items-center space-x-1.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl font-semibold transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Reportar Novedad / Daño</span>
        </button>
      </div>

      {/* TAB 1: WORKSTATION ASSET REGISTRATION MATRIX */}
      {activeTab === 'registro' && (
        <div className="space-y-6">
          {/* Instructions bar */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <QrCode className="w-5 h-5 text-[#004481] shrink-0" />
              <span>
                <strong>Instrucciones:</strong> Escanea el código QR adherido a cada uno de los elementos de tu puesto de trabajo. Todos los activos son obligatorios para habilitar el inicio de sesión.
              </span>
            </div>
            <span className="font-bold text-[#004481] bg-white px-2.5 py-1 rounded-lg border border-blue-200 shrink-0 ml-2">
              {completedCount} / {totalRequired}
            </span>
          </div>

          {/* Cards Grid for Asset Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {requiredSlots.map(slot => {
              const reg = studentRegistrations.find(
                r => r.tipo_activo === slot.type || (slot.type === 'Monitor' && r.tipo_activo === 'Todo-en-Uno')
              );
              const assetDetails = reg ? activos.find(a => a.codigo_qr === reg.id_activo) : null;
              const isRegistered = !!reg;

              return (
                <div
                  key={slot.type}
                  className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden bg-white shadow-xs ${
                    isRegistered
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-300 hover:border-blue-400'
                  }`}
                >
                  {/* Status Indicator Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isRegistered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isRegistered ? 'bg-emerald-500' : 'bg-red-500 animate-ping'
                        }`}
                      />
                      <span>{isRegistered ? 'Registrado 🟢' : 'Pendiente 🔴'}</span>
                    </span>

                    {isRegistered && (
                      <button
                        onClick={() => eliminarRegistroActivo(reg.id)}
                        title="Desvincular o re-escanear este activo"
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Icon & Asset Name */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isRegistered
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {slot.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{slot.label}</h3>
                      <p className="text-[11px] text-slate-500">Slot obligatorio</p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="my-2 py-2 border-t border-b border-slate-100 min-h-[70px] text-xs">
                    {isRegistered && assetDetails ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Código QR:</span>
                          <button
                            type="button"
                            onClick={() => setSelectedBadgeAsset(assetDetails)}
                            className="font-mono font-bold text-[#004481] hover:underline flex items-center gap-1"
                          >
                            <span>{reg.id_activo}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Marca:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                            {assetDetails.marca}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Serial:</span>
                          <span className="font-mono text-slate-600 text-[10px] truncate max-w-[130px]">
                            {assetDetails.serial}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Hora de escaneo:</span>
                          <span>{reg.fecha_hora_registro.split('T')[1]?.substring(0, 5) || '10:05'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-1 py-1">
                        <QrCode className="w-6 h-6 text-slate-300" />
                        <span className="text-[11px]">Activo no escaneado</span>
                      </div>
                    )}
                  </div>

                  {/* Scan Button Action */}
                  <div className="mt-2 pt-1">
                    {isRegistered ? (
                      <div className="flex space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenScanner(slot.type)}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-500" />
                          <span>Re-escanear</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReportTargetQr(reg.id_activo);
                            setReportModalOpen(true);
                          }}
                          title="Reportar novedad en este activo"
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenScanner(slot.type)}
                        className="w-full py-2.5 bg-[#004481] hover:bg-[#003366] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 group cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-[#F9A800] group-hover:rotate-12 transition-transform" />
                        <span>Escanear QR</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Center Footer: Start Class / Change Workstation / Finalize Class */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-slate-900 text-sm">Acciones de Sesión del Aprendiz</h4>
              <p className="text-xs text-slate-500">
                {isComplete
                  ? 'Todos tus activos están validados. Puedes trabajar normalmente en tu puesto.'
                  : 'Registra los activos faltantes para desbloquear el inicio completo de la clase.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
              {/* Request Workstation Change Button */}
              <button
                type="button"
                onClick={() => setShowChangeRequestModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#004481]" />
                <span>Solicitar Cambio de Puesto</span>
              </button>

              {/* Finalize Class / Return Workstation */}
              <button
                type="button"
                disabled={!isComplete}
                onClick={() => setShowFinalizeModal(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isComplete
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Finalizar y Entregar Puesto</span>
              </button>

              {/* Start Session Confirmation */}
              <button
                type="button"
                disabled={!isComplete}
                onClick={() => {
                  setScanToast({
                    success: true,
                    message: '¡Puesto de trabajo confirmado! Tu registro quedó asentado en la lista del instructor.'
                  });
                  setTimeout(() => setScanToast(null), 4000);
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 ${
                  isComplete
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{isComplete ? 'Puesto Verificado y Activo' : 'Completar Escaneo para Iniciar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY HISTORY */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Historial de Clases y Activos Registrados
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Trazabilidad de puestos ocupados, fechas, instructores y estado de devolución de activos.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Clase / Fecha</th>
                    <th className="py-3 px-4">Ambiente</th>
                    <th className="py-3 px-4">Activo Escaneado</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Estado Entrega</th>
                    <th className="py-3 px-4">Estado Devolución</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastRegistrations.map(reg => {
                    const act = activos.find(a => a.codigo_qr === reg.id_activo);
                    return (
                      <tr key={reg.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div>Clase #{reg.id_clase}</div>
                          <div className="text-[10px] text-slate-400">{reg.fecha_hora_registro.split('T')[0]}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {activeAmbiente ? activeAmbiente.nombre.split('-')[0] : 'Ambiente 101'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => act && setSelectedBadgeAsset(act)}
                            className="font-mono font-bold text-[#004481] hover:underline"
                          >
                            {reg.id_activo}
                          </button>
                          <div className="text-[10px] text-slate-500">{act?.marca}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{reg.tipo_activo}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {reg.estado_entrega}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              reg.estado_devolucion === 'Excelente'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {reg.estado_devolucion || 'En Curso'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SOLICITAR CAMBIO DE PUESTO */}
      {showChangeRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Solicitud de Cambio de Puesto de Trabajo
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Esta solicitud será enviada al panel del instructor ({instructor?.nombre || 'Carlos Ramírez'}) para su autorización en vivo.
            </p>

            <form onSubmit={handleSendChangeRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo del Cambio</label>
                <select
                  value={motivoCambio}
                  onChange={e => setMotivoCambio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004481] focus:outline-none"
                >
                  <option value="Equipo no enciende / Problema de hardware">
                    Equipo no enciende / Problema de hardware
                  </option>
                  <option value="Monitor parpadea o sin señal">Monitor parpadea o sin señal</option>
                  <option value="Periféricos (teclado/mouse) averiados">
                    Periféricos (teclado/mouse) averiados
                  </option>
                  <option value="Reubicación por requerimiento del instructor">
                    Reubicación por requerimiento del instructor
                  </option>
                  <option value="Otro motivo de ergonomía o conectividad">
                    Otro motivo de ergonomía o conectividad
                  </option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                ⚠️ Al ser autorizado, tus activos actuales serán desvinculados para que puedas escanear los del nuevo puesto.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChangeRequestModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004481] hover:bg-blue-900 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  Enviar Solicitud al Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FINALIZAR CLASE APRENDIZ */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Finalización de Sesión y Devolución de Activos
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Confirma el estado en el que dejas los {completedCount} activos de tu estación de trabajo.
            </p>

            <form onSubmit={handleFinalizeSessionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado de Devolución</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Excelente', 'Bueno', 'Con Novedad'] as const).map(est => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => setEstadoDevolucion(est)}
                      className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                        estadoDevolucion === est
                          ? 'bg-[#004481] text-white border-[#004481]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {est}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones de Entrega (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={observacionesFinal}
                  onChange={e => setObservacionesFinal(e.target.value)}
                  placeholder="Ejemplo: Computador apagado, puesto organizado, mouse y teclado limpios."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004481] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFinalizeModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  Confirmar Entrega de Puesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        targetType={targetType}
        onScanned={handleScannedResult}
      />

      {/* QR BADGE MODAL */}
      <QRBadgeModal
        activo={selectedBadgeAsset}
        onClose={() => setSelectedBadgeAsset(null)}
      />

      {/* REPORT NOVEDAD MODAL */}
      <ReportNovedadModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultQr={reportTargetQr}
        defaultClaseId={activeClassId}
      />
    </div>
  );
};
