import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import { User, ChecklistFinalizacion } from '../../types';
import { QRBadgeModal } from '../common/QRBadgeModal';
import { ReportNovedadModal } from '../common/ReportNovedadModal';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  RotateCcw,
  CheckSquare,
  ShieldAlert,
  Calendar,
  Search,
  Monitor,
  Keyboard,
  Mouse,
  Cpu
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const {
    currentUser,
    getActiveClass,
    getAmbiente,
    getSede,
    users,
    activos,
    registros,
    solicitudesCambio,
    novedades,
    autorizarCambioPuesto,
    finalizarClaseInstructor,
    isStudentWorkstationComplete,
    activeClassId
  } = useSigea();

  const [activeTab, setActiveTab] = useState<'monitoreo' | 'solicitudes' | 'clases' | 'novedades'>('monitoreo');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadgeAsset, setSelectedBadgeAsset] = useState<any | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetQr, setReportTargetQr] = useState<string | undefined>(undefined);

  // Finalize Class Modal
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistFinalizacion>({
    equiposApagados: true,
    perifericosCompletos: true,
    puestosOrdenados: true,
    novedadesReportadas: true,
    llavesEntregadas: false
  });
  const [observacionesCierre, setObservacionesCierre] = useState('');
  const [instructorToast, setInstructorToast] = useState<{ success: boolean; message: string } | null>(null);

  const activeClass = getActiveClass();
  const activeAmbiente = activeClass ? getAmbiente(activeClass.ambienteId) : undefined;
  const activeSede = activeClass ? getSede(activeClass.sedeId) : undefined;

  // Filter students in the active class ficha
  const classStudents = users.filter(u => u.rol === 'Aprendiz' && u.fichaId === (activeClass?.fichaId || '123456'));

  const filteredStudents = classStudents.filter(
    s =>
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.documento.includes(searchTerm)
  );

  const totalStudents = classStudents.length;
  const completedStudents = classStudents.filter(s => isStudentWorkstationComplete(s.documento, activeClassId)).length;
  const inProgressStudents = classStudents.filter(s => {
    const regs = registros.filter(r => r.id_usuario === s.documento && r.id_clase === activeClassId && !r.liberadoPorCambio);
    return regs.length > 0 && !isStudentWorkstationComplete(s.documento, activeClassId);
  }).length;
  const pendingStudents = totalStudents - completedStudents - inProgressStudents;

  const handleAuthorizeChange = (studentDoc: string) => {
    const res = autorizarCambioPuesto(studentDoc, activeClassId);
    setInstructorToast(res);
    setTimeout(() => setInstructorToast(null), 4000);
  };

  const handleFinalizeClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass) return;
    const res = finalizarClaseInstructor(activeClass.id, checklist, observacionesCierre);
    setShowFinalizeModal(false);
    setInstructorToast(res);
    setTimeout(() => setInstructorToast(null), 5000);
  };

  const pendingRequests = solicitudesCambio.filter(
    s => s.claseId === activeClassId && s.estado === 'Pendiente'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-slate-100 min-h-screen">
      {/* Toast Notification */}
      {instructorToast && (
        <div
          className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200 ${
            instructorToast.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            {instructorToast.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-xs font-semibold">{instructorToast.message}</span>
          </div>
          <button
            onClick={() => setInstructorToast(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Instructor Active Class Control Center */}
      {activeClass && (
        <div className="bg-[#003B46] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                  Panel de Control del Instructor
                </span>
                <span className="text-emerald-200">Ficha: {activeClass.fichaId} (ADSO)</span>
                <span className="text-emerald-400">•</span>
                <span className="text-emerald-200">Clase #{activeClass.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeClass.estado === 'Finalizada' ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'}`}>
                  {activeClass.estado}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeClass.tema}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-emerald-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>
                    {activeAmbiente?.nombre.split('-')[0]} • {activeSede?.nombre.split('(')[0]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>
                    {activeClass.fecha} | {activeClass.hora_inicio} - {activeClass.hora_fin}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{totalStudents} Aprendices Matriculados</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-center min-w-[110px]">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">Verificados</span>
                <span className="text-2xl font-black text-white">{completedStudents}</span>
                <span className="text-[10px] text-emerald-200">Puestos 100%</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-center min-w-[110px]">
                <span className="text-[10px] text-amber-300 font-bold uppercase block">En Escaneo</span>
                <span className="text-2xl font-black text-white">{inProgressStudents}</span>
                <span className="text-[10px] text-emerald-200">Parciales</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-center min-w-[110px]">
                <span className="text-[10px] text-red-300 font-bold uppercase block">Sin Registro</span>
                <span className="text-2xl font-black text-white">{pendingStudents}</span>
                <span className="text-[10px] text-emerald-200">Pendientes</span>
              </div>

              {/* Finalize Class Action Button */}
              {activeClass.estado !== 'Finalizada' && (
                <button
                  type="button"
                  onClick={() => setShowFinalizeModal(true)}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer ml-auto sm:ml-0"
                >
                  <CheckSquare className="w-4 h-4 text-white" />
                  <span>Finalizar Sesión de Clase</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-2 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('monitoreo')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'monitoreo'
                ? 'bg-[#003B46] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Monitoreo de Aprendices</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full ml-1">
              {totalStudents}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'solicitudes'
                ? 'bg-[#003B46] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Solicitudes de Cambio</span>
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full animate-bounce">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('clases')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'clases'
                ? 'bg-[#003B46] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Historial de Clases</span>
          </button>

          <button
            onClick={() => setActiveTab('novedades')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'novedades'
                ? 'bg-[#003B46] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Novedades del Aula</span>
          </button>
        </div>

        <button
          onClick={() => {
            setReportTargetQr('');
            setReportModalOpen(true);
          }}
          className="flex items-center space-x-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl font-bold transition-colors shadow-xs"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Reportar Daño / Falla</span>
        </button>
      </div>

      {/* TAB 1: LIVE ROSTER & ASSET MONITORING */}
      {activeTab === 'monitoreo' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar aprendiz por nombre o documento..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Leyenda:</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Completo
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> En Registro
              </span>
              <span className="flex items-center gap-1 text-red-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Sin Registro
              </span>
            </div>
          </div>

          {/* Student Roster Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map(student => {
              const studentRegs = registros.filter(
                r => r.id_usuario === student.documento && r.id_clase === activeClassId && !r.liberadoPorCambio
              );
              const isComplete = isStudentWorkstationComplete(student.documento, activeClassId);
              const hasSome = studentRegs.length > 0;

              const hasMonitor = studentRegs.find(r => r.tipo_activo === 'Monitor' || r.tipo_activo === 'Todo-en-Uno');
              const hasKeyboard = studentRegs.find(r => r.tipo_activo === 'Teclado');
              const hasMouse = studentRegs.find(r => r.tipo_activo === 'Ratón');
              const hasTower = studentRegs.find(r => r.tipo_activo === 'Torre');

              const isAIO = activeAmbiente?.tipoEquipamiento === 'All_in_One';
              const requiredCount = isAIO ? 3 : 4;

              return (
                <div
                  key={student.documento}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                    isComplete
                      ? 'border-emerald-300'
                      : hasSome
                      ? 'border-amber-300'
                      : 'border-red-200'
                  }`}
                >
                  {/* Top: Student Profile Header */}
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                            isComplete
                              ? 'bg-emerald-600'
                              : hasSome
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {student.nombre[0]}
                          {student.apellido[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {student.nombre} {student.apellido}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Doc: {student.documento} • Tel: {student.telefono || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          isComplete
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : hasSome
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        {isComplete
                          ? '🟢 Puesto Completo'
                          : hasSome
                          ? `🟡 Parcial (${studentRegs.length}/${requiredCount})`
                          : '🔴 Sin Registro'}
                      </span>
                    </div>

                    {/* Asset Checklist Status Matrix */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                      {/* Slot 1: Monitor / AIO */}
                      <div
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          hasMonitor ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-red-50/50 border-red-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Monitor className="w-4 h-4" />
                          <span className="font-semibold text-[11px]">
                            {isAIO ? 'Todo-en-Uno' : 'Monitor'}
                          </span>
                        </div>
                        {hasMonitor ? (
                          <button
                            onClick={() => {
                              const a = activos.find(x => x.codigo_qr === hasMonitor.id_activo);
                              if (a) setSelectedBadgeAsset(a);
                            }}
                            className="font-mono font-bold text-[10px] text-emerald-700 hover:underline"
                          >
                            {hasMonitor.id_activo}
                          </button>
                        ) : (
                          <span className="text-[10px] text-red-600 font-bold">Pendiente</span>
                        )}
                      </div>

                      {/* Slot 2: Teclado */}
                      <div
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          hasKeyboard ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-red-50/50 border-red-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Keyboard className="w-4 h-4" />
                          <span className="font-semibold text-[11px]">Teclado</span>
                        </div>
                        {hasKeyboard ? (
                          <button
                            onClick={() => {
                              const a = activos.find(x => x.codigo_qr === hasKeyboard.id_activo);
                              if (a) setSelectedBadgeAsset(a);
                            }}
                            className="font-mono font-bold text-[10px] text-emerald-700 hover:underline"
                          >
                            {hasKeyboard.id_activo}
                          </button>
                        ) : (
                          <span className="text-[10px] text-red-600 font-bold">Pendiente</span>
                        )}
                      </div>

                      {/* Slot 3: Ratón */}
                      <div
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          hasMouse ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-red-50/50 border-red-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Mouse className="w-4 h-4" />
                          <span className="font-semibold text-[11px]">Ratón</span>
                        </div>
                        {hasMouse ? (
                          <button
                            onClick={() => {
                              const a = activos.find(x => x.codigo_qr === hasMouse.id_activo);
                              if (a) setSelectedBadgeAsset(a);
                            }}
                            className="font-mono font-bold text-[10px] text-emerald-700 hover:underline"
                          >
                            {hasMouse.id_activo}
                          </button>
                        ) : (
                          <span className="text-[10px] text-red-600 font-bold">Pendiente</span>
                        )}
                      </div>

                      {/* Slot 4: Torre (if applicable) */}
                      {!isAIO && (
                        <div
                          className={`p-2 rounded-xl border flex items-center justify-between ${
                            hasTower ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-red-50/50 border-red-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Cpu className="w-4 h-4" />
                            <span className="font-semibold text-[11px]">Torre CPU</span>
                          </div>
                          {hasTower ? (
                            <button
                              onClick={() => {
                                const a = activos.find(x => x.codigo_qr === hasTower.id_activo);
                                if (a) setSelectedBadgeAsset(a);
                              }}
                              className="font-mono font-bold text-[10px] text-emerald-700 hover:underline"
                            >
                              {hasTower.id_activo}
                            </button>
                          ) : (
                            <span className="text-[10px] text-red-600 font-bold">Pendiente</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Instructor on this student */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
                      {studentRegs.length > 0
                        ? `Último registro: ${studentRegs[studentRegs.length - 1].fecha_hora_registro.split('T')[1]?.substring(0, 5)}`
                        : 'Sin actividad en sesión'}
                    </span>

                    {/* Authorize Change Button */}
                    <button
                      type="button"
                      onClick={() => handleAuthorizeChange(student.documento)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                      title="Desvincular activos y permitir al aprendiz escanear una nueva estación"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      <span>Autorizar Cambio</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PENDING WORKSTATION CHANGE REQUESTS */}
      {activeTab === 'solicitudes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Solicitudes de Cambio de Puesto de Trabajo
          </h3>
          <p className="text-xs text-slate-500">
            Permite autorizar a aprendices con problemas de hardware o reubicaciones para que registren un nuevo puesto de trabajo.
          </p>

          {solicitudesCambio.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <RotateCcw className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No hay solicitudes registradas en este momento.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {solicitudesCambio.map(sol => {
                const student = users.find(u => u.documento === sol.aprendizDoc);
                return (
                  <div key={sol.id} className="py-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {student?.nombre} {student?.apellido} (Doc: {sol.aprendizDoc})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sol.estado === 'Pendiente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sol.estado}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        <strong>Motivo:</strong> {sol.motivo}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Fecha: {sol.fechaSolicitud} • Clase #{sol.claseId}
                      </p>
                    </div>

                    {sol.estado === 'Pendiente' && (
                      <button
                        type="button"
                        onClick={() => handleAuthorizeChange(sol.aprendizDoc)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                      >
                        Autorizar Cambio Ahora
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CLASSES HISTORY */}
      {activeTab === 'clases' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Historial de Sesiones de Formación
          </h3>
          <p className="text-xs text-slate-500">
            Registro de actas de entrega, verificación de periféricos y auditorías de cierre de aula.
          </p>

          <div className="space-y-3">
            {/* Class 2 Finalized Demo */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  Clase #2: Bases de Datos Relacionales y Normalización
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Finalizada ✓
                </span>
              </div>
              <div className="text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span>Fecha: 2026-08-19 (08:00 - 12:00)</span>
                <span>Ambiente: Ambiente 101 - CGMLTI</span>
                <span>Ficha: 123456 (ADSO)</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <p className="font-bold text-[#003B46]">Acta de Cierre y Verificación:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <span className="text-emerald-700 font-semibold">✓ Equipos apagados</span>
                  <span className="text-emerald-700 font-semibold">✓ Periféricos completos</span>
                  <span className="text-emerald-700 font-semibold">✓ Puestos ordenados</span>
                  <span className="text-emerald-700 font-semibold">✓ Llaves entregadas</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  <em>"Sesión finalizada a tiempo. 18 aprendices presentes. Todos los equipos entregados en orden."</em> — Firmado: Carlos Ramírez
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROOM NOVEDADES & INCIDENTS */}
      {activeTab === 'novedades' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Novedades y Averías Reportadas en el Ambiente
              </h3>
              <p className="text-xs text-slate-500">
                Reportes técnicos de teclados, ratones, pantallas y cables que requieren atención.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setReportTargetQr('');
                setReportModalOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              + Nuevo Reporte
            </button>
          </div>

          <div className="space-y-2">
            {novedades.map(nov => (
              <div key={nov.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#003B46]">{nov.codigo_qr}</span>
                    <span className="font-bold text-slate-800">{nov.tipoNovedad}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      nov.prioridad === 'Crítica' || nov.prioridad === 'Alta'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Prioridad {nov.prioridad}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{nov.descripcion}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Reportado: {nov.fecha} por Doc: {nov.reportadoPorDoc} ({nov.rolReportante})
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                  {nov.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: FINALIZAR CLASE INSTRUCTOR CON AUDITORIA CHECKLIST */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#003B46]">
                <CheckSquare className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Acta de Cierre y Finalización de Clase</h3>
              </div>
              <button
                onClick={() => setShowFinalizeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 my-3">
              Completa la lista de verificación del ambiente de formación para liberar los activos y registrar el acta oficial de entrega.
            </p>

            <form onSubmit={handleFinalizeClassSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">Lista de Verificación de Aula:</span>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.equiposApagados}
                    onChange={e => setChecklist({ ...checklist, equiposApagados: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">1. Todos los computadores y pantallas apagados correctamente</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.perifericosCompletos}
                    onChange={e => setChecklist({ ...checklist, perifericosCompletos: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">2. Teclados, ratones y cables verificados completos y en su sitio</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.puestosOrdenados}
                    onChange={e => setChecklist({ ...checklist, puestosOrdenados: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">3. Puestos limpios, sillas organizadas y sin residuos</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.novedadesReportadas}
                    onChange={e => setChecklist({ ...checklist, novedadesReportadas: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">4. Novedades técnicas reportadas en el sistema SIGEA</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.llavesEntregadas}
                    onChange={e => setChecklist({ ...checklist, llavesEntregadas: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">5. Salón cerrado y llaves listas para entrega en Coordinación</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones Finales del Cierre
                </label>
                <textarea
                  rows={2}
                  value={observacionesCierre}
                  onChange={e => setObservacionesCierre(e.target.value)}
                  placeholder="Comentarios adicionales sobre la jornada, aprendices ausentes o condiciones del aula..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none text-xs"
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
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-md"
                >
                  Firmar y Finalizar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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