import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import { TipoActivo } from '../../types';
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

  // Modales
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [estadoDevolucion, setEstadoDevolucion] = useState<'Excelente' | 'Bueno' | 'Con Novedad'>('Excelente');
  const [observacionesFinal, setObservacionesFinal] = useState('');
  const [finalizedSuccess, setFinalizedSuccess] = useState(false);

  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [motivoCambio, setMotivoCambio] = useState('Equipo no enciende / Problema de hardware');

  // Notificaciones Toast
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

  const myChangeRequest = solicitudesCambio.find(
    s => s.aprendizDoc === studentDoc && s.claseId === activeClassId
  );
  const wasAuthorizedRecently = myChangeRequest?.estado === 'Autorizado' && studentRegistrations.length === 0;

  const requiredSlots: { type: TipoActivo; label: string; icon: React.ReactNode }[] = [
    {
      type: activeAmbiente?.tipoEquipamiento === 'All_in_One' ? 'Todo-en-Uno' : 'Monitor',
      label: activeAmbiente?.tipoEquipamiento === 'All_in_One' ? 'Computador Todo-en-Uno (AIO)' : 'Monitor Principal',
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
      label: 'Torre CPU',
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
    setTimeout(() => setScanToast(null), 4500);
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

  const pastRegistrations = registros.filter(r => r.id_usuario === studentDoc);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Toast Notification */}
      {scanToast && (
        <div
          className={`p-4 rounded-xl border shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 ${
            scanToast.success
              ? 'bg-white border-emerald-500 text-emerald-800'
              : 'bg-white border-red-500 text-red-800'
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
          <button onClick={() => setScanToast(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700 ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Banner de Autorización de Cambio */}
      {wasAuthorizedRecently && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-md border border-emerald-500 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h4 className="font-bold text-sm">¡Cambio de Puesto Autorizado!</h4>
              <p className="text-xs text-emerald-100">
                Procede a escanear los códigos QR de tu nueva estación de trabajo.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenScanner(requiredSlots[0].type)}
            className="px-4 py-2 bg-white text-emerald-700 rounded-lg text-xs font-bold shadow-md hover:bg-slate-100 transition-colors"
          >
            Escanear Nuevo Puesto
          </button>
        </div>
      )}

      {/* Banner Superior de la Clase Activa */}
      {activeClass && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-md uppercase text-[10px]">
                  Sesión en Curso
                </span>
                <span className="text-slate-500">Ficha: {activeClass.fichaId} (ADSO)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activeClass.tema}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{activeAmbiente?.nombre.split('-')[0]} • {activeSede?.nombre.split('(')[0]}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{activeClass.fecha} | {activeClass.hora_inicio} - {activeClass.hora_fin}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instructor: {instructor ? `${instructor.nombre} ${instructor.apellido}` : 'Carlos Ramírez'}</span>
                </div>
              </div>
            </div>

            {/* Cápsula de estado del puesto */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[200px] shrink-0">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-1">
                Estado del Puesto
              </span>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="font-bold text-sm text-slate-900">
                  {isComplete ? 'Puesto Completo' : `${completedCount} de ${totalRequired} Activos`}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs de Navegación */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('registro')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'registro'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Registro de Puesto Actual</span>
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'historial'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Mi Historial de Activos</span>
          </button>
        </div>

        <button
          onClick={() => {
            setReportTargetQr('');
            setReportModalOpen(true);
          }}
          className="flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl font-semibold transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Reportar Novedad</span>
        </button>
      </div>

      {/* TAB 1: REGISTRO DE PUESTO */}
      {activeTab === 'registro' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <QrCode className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="leading-relaxed">
                <strong>Instrucciones:</strong> Escanea el codigo QR adherido a cada uno de los elementos de tu puesto de trabajo. Todos los activos son obligatorios para habilitar el inicio de sesión.
              </span>
            </div>
            <span className="shrink-0 flex items-center justify-center min-w-[52px] font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {completedCount} / {totalRequired}
            </span>
          </div>

          {/* Grid de slots de activos */}
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
                  className={`rounded-2xl border transition-all p-5 flex flex-col justify-between bg-white shadow-sm ${
                    isRegistered ? 'border-emerald-300' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {isRegistered ? '✓ Registrado' : '● Pendiente'}
                    </span>

                    {isRegistered && (
                      <button
                        onClick={() => eliminarRegistroActivo(reg.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      {slot.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{slot.label}</h3>
                      <p className="text-[11px] text-slate-500">Requerido</p>
                    </div>
                  </div>

                  <div className="my-2 py-3 border-y border-slate-100 min-h-[65px] text-xs">
                    {isRegistered && assetDetails ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-500">Código QR:</span>
                          <button
                            type="button"
                            onClick={() => setSelectedBadgeAsset(assetDetails)}
                            className="font-mono font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <span>{reg.id_activo}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-500">Marca:</span>
                          <span className="font-semibold text-slate-800">{assetDetails.marca}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-red-500 h-full text-xs font-semibold">
                        Pendiente por registrar
                      </div>
                    )}
                  </div>

                  <div className="mt-2 pt-1">
                    {isRegistered ? (
                      <button
                        type="button"
                        onClick={() => handleOpenScanner(slot.type)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Re-escanear</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenScanner(slot.type)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Escanear QR</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Acciones de pie de página */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Acciones de Sesión del Aprendiz</h4>
              <p className="text-xs text-slate-500">
                {isComplete ? 'Todos tus activos están validados. Puedes trabajar normalmente en tu puesto.' : 'Escanea los elementos pendientes para habilitar el puesto.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowChangeRequestModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
               <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> 
               <span> Solicitud de Cambio de Puesto de Trabajo </span>
              </button>

              <button
                type="button"
                disabled={!isComplete}
                onClick={() => setShowFinalizeModal(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isComplete
                    ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Finalizar y Entregar Puesto</span>
              </button>

              <button
                type="button"
                disabled={!isComplete}
                onClick={() => {
                  setScanToast({
                    success: true,
                    message: '¡Puesto de trabajo verificado con éxito!'
                  });
                  setTimeout(() => setScanToast(null), 4000);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isComplete
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isComplete ? 'Puesto Verificado y Activo' : 'Puesto Incompleto'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL */}
      {activeTab === 'historial' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Historial de Registros</h3>
          <p className="text-xs text-slate-500 mb-4">Registro histórico de tus escaneos de equipo.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Clase / Fecha</th>
                  <th className="py-3 px-4">Activo</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      Clase #{reg.id_clase}
                      <div className="text-[10px] text-slate-400">{reg.fecha_hora_registro.split('T')[0]}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">{reg.id_activo}</td>
                    <td className="py-3 px-4 text-slate-600">{reg.tipo_activo}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {reg.estado_entrega}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIO DE PUESTO */}
      {showChangeRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-slate-100 shadow-xl space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Solicitud de Cambio de Puesto de Trabajo</h3>
              <p className="text-xs text-slate-500 mt-1.5">
               Esta solicitud será enviada al panel del instructor (Carlos) para su autorización en vivo 
              </p>
             </div> 

              <form onSubmit={handleSendChangeRequest} className="space-y-4 text-xs">
              <div>
               <label className="block font-bold text-slate-800 mb-2">Motivo del Cambio</label>
                <select
                  value={motivoCambio}
                  onChange={e => setMotivoCambio(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Equipo no enciende / Problema de hardware">Equipo no enciende / Problema de hardware</option>
                  <option value="Monitor parpadea o sin señal">Monitor parpadea o sin señal</option>
                  <option value="Periféricos (teclado/mouse) averiados">Periféricos (teclado/mouse) averiados</option>
                  <option value="Reubicación por requerimiento del instructor">Reubicación por requerimiento del instructor</option>
                  <option value="Otro motivo de ergonomía o conectividad">Otro motivo de ergonomía o conectividad</option>
                </select>
              </div>

              {/* Banner de advertencia amarillo */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
                <span className="text-amber-600 text-sm">⚠️</span>
                <p className="text-[11px] font-semibold text-amber-800/90 leading-relaxed">
                  Al ser autorizado, tus activos actuales serán desvinculados para que puedas escanear los del nuevo puesto.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChangeRequestModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#009b63] hover:bg-[#008756] text-white rounded-2xl font-bold shadow-sm cursor-pointer transition-colors"
                >
                  Enviar Solicitud al Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          

      {/* MODAL: FINALIZAR SESIÓN */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Finalización de Sesión y Devolución de Activos</h3>
            <form onSubmit={handleFinalizeSessionSubmit} className="space-y-4 text-xs">
              <p className="text-xs text-slate-500 mt-1">
                Confirma el estado en el que dejas los {studentRegistrations.length || 4} activos de tu estación de trabajo.
              </p>
            <div>
                <label className="block font-bold text-slate-700 mb-2">Estado de Devolución</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Excelente', 'Bueno', 'Con Novedad'] as const).map(est => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => setEstadoDevolucion(est)}
                      className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                        estadoDevolucion === est
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-100/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {est}
                    </button>
                  ))}
                </div>
              </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Observaciones de Entrega <span className="font-normal text-slate-400">(Opcional)</span>
              </label>
              <textarea
                rows={3}
                value={observacionesFinal}
                onChange={(e: any) => setObservacionesFinal(e.target.value)}
                placeholder="Ejemplo: Computador apagado, puesto organizado, mouse y teclado limpios."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFinalizeModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Confirmar Entrega del puesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALES EXTERNOS */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        targetType={targetType}
        onScanned={handleScannedResult}
      />
      <QRBadgeModal activo={selectedBadgeAsset} onClose={() => setSelectedBadgeAsset(null)} />
      <ReportNovedadModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultQr={reportTargetQr}
        defaultClaseId={activeClassId}
      />
    </div>
  );
};