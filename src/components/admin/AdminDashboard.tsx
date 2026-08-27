import React, { useState } from 'react';
import { useSigea } from '../../context/SigeaContext';
import { TipoActivo, EstadoActivo, Activo } from '../../types';
import { QRBadgeModal } from '../common/QRBadgeModal';
import {
  Shield,
  UploadCloud,
  FileSpreadsheet,
  Calendar,
  History,
  Database,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  QrCode,
  Tag,
  Laptop,
  Users,
  Layers,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Edit,
  SlidersHorizontal
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activos,
    users,
    clases,
    sedes,
    ambientes,
    fichas,
    auditoria,
    importarCsv,
    generarClasesTrimestre,
    crearActivo,
    actualizarEstadoActivo
  } = useSigea();

  const [activeTab, setActiveTab] = useState<'auditoria' | 'csv' | 'generador' | 'activos' | 'ambientes'>('auditoria');
  const [selectedBadgeAsset, setSelectedBadgeAsset] = useState<Activo | null>(null);

  // Filter States for Global History / Audit
  const [auditSearchQr, setAuditSearchQr] = useState('');
  const [auditSearchDoc, setAuditSearchDoc] = useState('');
  const [auditSearchAction, setAuditSearchAction] = useState('ALL');

  // Asset Inventory Filters
  const [assetSearch, setAssetSearch] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('ALL');
  const [assetStateFilter, setAssetStateFilter] = useState<string>('ALL');

  // CSV Importer State
  const [csvEntity, setCsvEntity] = useState<'activos' | 'usuarios'>('activos');
  const [csvContent, setCsvContent] = useState('');
  const [csvResult, setCsvResult] = useState<{ success: boolean; message: string } | null>(null);

  // New Asset Modal
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAsset, setNewAsset] = useState<{
    codigo_qr: string;
    tipo: TipoActivo;
    marca: string;
    modelo: string;
    serial: string;
    sedeId: string;
    ambienteId: string;
    puestoNumero?: number;
    estado: EstadoActivo;
  }>({
    codigo_qr: 'QR-MON-009',
    tipo: 'Monitor',
    marca: 'Dell UltraSharp 24"',
    modelo: 'U2419H',
    serial: `SN-${Date.now().toString().slice(-6)}`,
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 5,
    estado: 'Disponible'
  });

  // Class Generator State
  const [genFicha, setGenFicha] = useState('123456');
  const [genInstructor, setGenInstructor] = useState('1001');
  const [genAmbiente, setGenAmbiente] = useState('amb-101');
  const [genDays, setGenDays] = useState<string[]>(['Lunes', 'Miércoles']);
  const [genStartDate, setGenStartDate] = useState('2026-08-25');
  const [genWeeks, setGenWeeks] = useState(8);
  const [genStartTime, setGenStartTime] = useState('10:00');
  const [genEndTime, setGenEndTime] = useState('12:00');
  const [genTema, setGenTema] = useState('Desarrollo de Software y Arquitecturas Cloud');
  const [genToast, setGenToast] = useState<string | null>(null);

  // Global KPIs
  const totalActivos = activos.length;
  const activosEnUso = activos.filter(a => a.estado === 'En Uso').length;
  const activosDisponibles = activos.filter(a => a.estado === 'Disponible').length;
  const activosMantenimiento = activos.filter(a => a.estado === 'En Mantenimiento').length;
  const totalAprendices = users.filter(u => u.rol === 'Aprendiz').length;

  // Filtered Audit Log
  const filteredAudit = auditoria.filter(item => {
    const matchesQr = !auditSearchQr || (item.codigo_qr && item.codigo_qr.toLowerCase().includes(auditSearchQr.toLowerCase()));
    const matchesDoc = !auditSearchDoc || item.usuarioDoc.includes(auditSearchDoc) || item.usuarioNombre.toLowerCase().includes(auditSearchDoc.toLowerCase());
    const matchesAction = auditSearchAction === 'ALL' || item.accion === auditSearchAction;
    return matchesQr && matchesDoc && matchesAction;
  });

  // Filtered Assets
  const filteredAssets = activos.filter(a => {
    const matchesSearch =
      a.codigo_qr.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.marca.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.serial.toLowerCase().includes(assetSearch.toLowerCase());
    const matchesType = assetTypeFilter === 'ALL' || a.tipo === assetTypeFilter;
    const matchesState = assetStateFilter === 'ALL' || a.estado === assetStateFilter;
    return matchesSearch && matchesType && matchesState;
  });

  // Sample CSV Templates
  const sampleActivosCsv = `codigo_qr,tipo,marca,serial,sedeId,ambienteId,puestoNumero,estado
QR-MON-050,Monitor,Dell 24 Full HD,SN-DELL-5501,sede-cgmlti,amb-101,11,Disponible
QR-TEC-050,Teclado,Logitech K120 USB,SN-LOG-5502,sede-cgmlti,amb-101,11,Disponible
QR-RAT-050,Ratón,Logitech B100,SN-LOG-5503,sede-cgmlti,amb-101,11,Disponible
QR-TOR-050,Torre,HP ProDesk Core i7,SN-HP-5504,sede-cgmlti,amb-101,11,Disponible
QR-AIO-020,Todo-en-Uno,HP Pavilion 24 AIO,SN-HP-2201,sede-unigermana,amb-102,6,Disponible`;

  const sampleUsuariosCsv = `documento,nombre,apellido,rol,email,fichaId
1010,Sofia,Valencia,Aprendiz,sofia.valencia@aprendiz.edu.co,123456
1011,Diego,Mendoza,Aprendiz,diego.mendoza@aprendiz.edu.co,123456
1012,Carolina,Ospina,Aprendiz,carolina.ospina@aprendiz.edu.co,123456
1013,Fernando,Guerrero,Instructor,fernando.guerrero@instituto.edu.co,`;

  const handleLoadSampleCsv = () => {
    if (csvEntity === 'activos') {
      setCsvContent(sampleActivosCsv);
    } else {
      setCsvContent(sampleUsuariosCsv);
    }
  };

  const handleProcessCsv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;
    const res = importarCsv(csvContent, csvEntity);
    setCsvResult(res);
    if (res.success) {
      setCsvContent('');
    }
  };

  const handleGenerateClassesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generarClasesTrimestre(
      genFicha,
      genInstructor,
      genAmbiente,
      genDays,
      genStartDate,
      genWeeks,
      genStartTime,
      genEndTime,
      genTema
    );
    setGenToast(`¡Éxito! Se generaron ${res.count} sesiones programadas en el calendario.`);
    setTimeout(() => setGenToast(null), 4500);
  };

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = crearActivo(newAsset);
    if (res.success) {
      setShowAddAssetModal(false);
      setGenToast(res.message);
      setTimeout(() => setGenToast(null), 4000);
    } else {
      alert(res.message);
    }
  };

  const exportAuditToCsv = () => {
    const headers = 'ID,Fecha,Accion,UsuarioDoc,UsuarioNombre,Rol,Detalle,CodigoQR,ClaseId\n';
    const rows = filteredAudit
      .map(
        a =>
          `"${a.id}","${a.fecha}","${a.accion}","${a.usuarioDoc}","${a.usuarioNombre}","${a.rol}","${a.detalle.replace(/"/g, '""')}","${a.codigo_qr || ''}","${a.claseId || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SIGEA_Auditoria_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {genToast && (
        <div className="p-4 rounded-2xl border shadow-lg bg-emerald-50 border-emerald-300 text-emerald-900 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">{genToast}</span>
          </div>
          <button onClick={() => setGenToast(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
      )}

      {/* Admin KPI Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Activos</span>
          <span className="text-2xl font-black text-[#004481]">{totalActivos}</span>
          <span className="text-[10px] text-slate-500 block">Monitores, Torres, Periféricos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-emerald-600 block">En Uso Actual</span>
          <span className="text-2xl font-black text-emerald-700">{activosEnUso}</span>
          <span className="text-[10px] text-emerald-600 block">Asignados en clases activas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-blue-600 block">Disponibles</span>
          <span className="text-2xl font-black text-blue-700">{activosDisponibles}</span>
          <span className="text-[10px] text-blue-600 block">Listos para escaneo</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-amber-600 block">En Mantenimiento</span>
          <span className="text-2xl font-black text-amber-700">{activosMantenimiento}</span>
          <span className="text-[10px] text-amber-600 block">Reportados con novedad</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Aprendices</span>
          <span className="text-2xl font-black text-slate-800">{totalAprendices}</span>
          <span className="text-[10px] text-slate-500 block">En Fichas 123456 / 654321</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('auditoria')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'auditoria' ? 'bg-[#004481] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4 text-[#F9A800]" />
            <span>Historial Global y Auditoría</span>
          </button>

          <button
            onClick={() => setActiveTab('activos')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'activos' ? 'bg-[#004481] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-[#F9A800]" />
            <span>Inventario de Activos ({totalActivos})</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'csv' ? 'bg-[#004481] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#F9A800]" />
            <span>Importación CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('generador')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generador' ? 'bg-[#004481] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#F9A800]" />
            <span>Generador de Clases</span>
          </button>

          <button
            onClick={() => setActiveTab('ambientes')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ambientes' ? 'bg-[#004481] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#F9A800]" />
            <span>Sedes y Ambientes</span>
          </button>
        </div>

        {activeTab === 'activos' && (
          <button
            onClick={() => setShowAddAssetModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Activo QR</span>
          </button>
        )}
      </div>

      {/* TAB 1: GLOBAL AUDIT AND TRACEABILITY */}
      {activeTab === 'auditoria' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Auditoría Global y Trazabilidad de Eventos
              </h3>
              <p className="text-xs text-slate-500">
                Registro inmutable de escaneos QR, autorizaciones de instructor, actas de cierre y altas de inventario.
              </p>
            </div>

            <button
              onClick={exportAuditToCsv}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#004481]" />
              <span>Exportar Reporte CSV</span>
            </button>
          </div>

          {/* Multi-Filter Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Filtrar por Código QR</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej. QR-MON-001"
                  value={auditSearchQr}
                  onChange={e => setAuditSearchQr(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Filtrar por Usuario o Documento</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej. 1001, Carlos, Juan"
                  value={auditSearchDoc}
                  onChange={e => setAuditSearchDoc(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Tipo de Acción</label>
              <select
                value={auditSearchAction}
                onChange={e => setAuditSearchAction(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="ALL">Todas las acciones</option>
                <option value="REGISTRO_ACTIVO">REGISTRO_ACTIVO</option>
                <option value="AUTORIZACION_CAMBIO_PUESTO">AUTORIZACION_CAMBIO_PUESTO</option>
                <option value="FINALIZACION_CLASE">FINALIZACION_CLASE</option>
                <option value="REPORTE_NOVEDAD">REPORTE_NOVEDAD</option>
                <option value="IMPORTACION_CSV_ACTIVOS">IMPORTACION_CSV</option>
                <option value="INICIO_SESION">INICIO_SESION</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Usuario Responsable</th>
                  <th className="py-2.5 px-3">Rol</th>
                  <th className="py-2.5 px-3">Activo QR</th>
                  <th className="py-2.5 px-3">Detalle del Evento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAudit.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {item.fecha}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-[#004481] px-2 py-0.5 rounded border border-slate-200">
                        {item.accion}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div>{item.usuarioNombre}</div>
                      <div className="text-[10px] text-slate-400">Doc: {item.usuarioDoc}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.rol === 'Instructor'
                            ? 'bg-amber-100 text-amber-800'
                            : item.rol === 'Administrador'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.rol}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.codigo_qr ? (
                        <button
                          onClick={() => {
                            const a = activos.find(x => x.codigo_qr === item.codigo_qr);
                            if (a) setSelectedBadgeAsset(a);
                          }}
                          className="font-mono font-bold text-[#004481] hover:underline"
                        >
                          {item.codigo_qr}
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={item.detalle}>
                      {item.detalle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'activos' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inventario Tecnológico de Activos con QR
              </h3>
              <p className="text-xs text-slate-500">
                Listado de computadores, pantallas y periféricos con estado en tiempo real.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-semibold">{filteredAssets.length} activos</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Buscar por QR o Serial</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={assetSearch}
                  onChange={e => setAssetSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Tipo de Activo</label>
              <select
                value={assetTypeFilter}
                onChange={e => setAssetTypeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="Monitor">Monitores</option>
                <option value="Teclado">Teclados</option>
                <option value="Ratón">Ratones</option>
                <option value="Torre">Torres CPU</option>
                <option value="Todo-en-Uno">Todo-en-Uno (AIO)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Estado de Disponibilidad</label>
              <select
                value={assetStateFilter}
                onChange={e => setAssetStateFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="ALL">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="En Uso">En Uso</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
                <option value="De Baja">De Baja</option>
              </select>
            </div>
          </div>

          {/* Asset Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Código QR</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Marca / Modelo</th>
                  <th className="py-2.5 px-3">Serial</th>
                  <th className="py-2.5 px-3">Ambiente Asignado</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map(asset => {
                  const amb = ambientes.find(a => a.id === asset.ambienteId);
                  return (
                    <tr key={asset.codigo_qr} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#004481]">
                        <button
                          onClick={() => setSelectedBadgeAsset(asset)}
                          className="hover:underline flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slate-400" />
                          <span>{asset.codigo_qr}</span>
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{asset.tipo}</td>
                      <td className="py-2.5 px-3 text-slate-700">{asset.marca}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{asset.serial}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {amb ? amb.nombre.split('-')[0] : asset.ambienteId}
                        {asset.puestoNumero && ` (Puesto ${asset.puestoNumero})`}
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={asset.estado}
                          onChange={e => actualizarEstadoActivo(asset.codigo_qr, e.target.value as EstadoActivo)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                            asset.estado === 'Disponible'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : asset.estado === 'En Uso'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : asset.estado === 'En Mantenimiento'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="En Uso">En Uso</option>
                          <option value="En Mantenimiento">En Mantenimiento</option>
                          <option value="De Baja">De Baja</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedBadgeAsset(asset)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#004481] rounded-lg transition-colors"
                          title="Ver e Imprimir Etiqueta QR"
                        >
                          <Tag className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CSV IMPORTER */}
      {activeTab === 'csv' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Importación Masiva de Datos mediante Archivo CSV
            </h3>
            <p className="text-xs text-slate-500">
              Carga lotes masivos de inventario de activos o listas de aprendices matriculados en formato CSV estándar.
            </p>
          </div>

          {/* Feedback */}
          {csvResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                csvResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                {csvResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                <span>{csvResult.message}</span>
              </div>
              <button onClick={() => setCsvResult(null)} className="font-bold text-slate-400">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <label className="text-xs font-bold text-slate-700">Tipo de Contenido CSV:</label>
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCsvEntity('activos')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      csvEntity === 'activos' ? 'bg-white text-[#004481] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Inventario de Activos
                  </button>
                  <button
                    type="button"
                    onClick={() => setCsvEntity('usuarios')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      csvEntity === 'usuarios' ? 'bg-white text-[#004481] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Usuarios / Aprendices
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Contenido CSV (Pega o escribe las filas con comas):
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleCsv}
                    className="text-xs font-bold text-[#004481] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F9A800]" />
                    <span>Cargar Plantilla de Ejemplo</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={csvContent}
                  onChange={e => setCsvContent(e.target.value)}
                  placeholder={
                    csvEntity === 'activos'
                      ? 'codigo_qr,tipo,marca,serial,sedeId,ambienteId,puestoNumero,estado\nQR-MON-050,Monitor,Dell 24,SN-5501,sede-cgmlti,amb-101,11,Disponible'
                      : 'documento,nombre,apellido,rol,email,fichaId\n1010,Sofia,Valencia,Aprendiz,sofia@aprendiz.edu.co,123456'
                  }
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004481] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCsvContent('')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={handleProcessCsv}
                  className="px-5 py-2 bg-[#004481] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center space-x-2"
                >
                  <UploadCloud className="w-4 h-4 text-[#F9A800]" />
                  <span>Procesar e Importar al Sistema</span>
                </button>
              </div>
            </div>

            {/* Helper Sidebar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#004481]" />
                <span>Formato de Columnas Requerido</span>
              </h4>
              {csvEntity === 'activos' ? (
                <div className="space-y-2 text-slate-600">
                  <p>Encabezados obligatorios para Activos:</p>
                  <code className="block p-2 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-800">
                    codigo_qr,tipo,marca,serial,sedeId,ambienteId,puestoNumero,estado
                  </code>
                  <p className="text-[11px] text-slate-500">
                    Tipos admitidos: <code>Monitor, Teclado, Ratón, Torre, Todo-en-Uno</code>
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-slate-600">
                  <p>Encabezados obligatorios para Usuarios:</p>
                  <code className="block p-2 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-800">
                    documento,nombre,apellido,rol,email,fichaId
                  </code>
                  <p className="text-[11px] text-slate-500">
                    Roles admitidos: <code>Aprendiz, Instructor, Administrador</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRIMESTRAL CLASS GENERATOR */}
      {activeTab === 'generador' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Generador Automatizado de Clases para el Trimestre
            </h3>
            <p className="text-xs text-slate-500">
              Crea automáticamente las sesiones de formación programadas en el calendario según ficha, horario y ambiente.
            </p>
          </div>

          <form onSubmit={handleGenerateClassesSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ficha de Formación</label>
              <select
                value={genFicha}
                onChange={e => setGenFicha(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                {fichas.map(f => (
                  <option key={f.id} value={f.id}>
                    Ficha {f.id} - {f.nombrePrograma.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instructor Titular</label>
              <select
                value={genInstructor}
                onChange={e => setGenInstructor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                {users.filter(u => u.rol === 'Instructor').map(u => (
                  <option key={u.documento} value={u.documento}>
                    {u.nombre} {u.apellido} (Doc: {u.documento})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ambiente de Formación</label>
              <select
                value={genAmbiente}
                onChange={e => setGenAmbiente(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                {ambientes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fecha de Inicio</label>
              <input
                type="date"
                value={genStartDate}
                onChange={e => setGenStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Semanas del Trimestre</label>
              <input
                type="number"
                min={1}
                max={16}
                value={genWeeks}
                onChange={e => setGenWeeks(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hora Inicio</label>
                <input
                  type="time"
                  value={genStartTime}
                  onChange={e => setGenStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hora Fin</label>
                <input
                  type="time"
                  value={genEndTime}
                  onChange={e => setGenEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Tema Base del Módulo</label>
              <input
                type="text"
                value={genTema}
                onChange={e => setGenTema(e.target.value)}
                placeholder="Ejemplo: Desarrollo de Software, Bases de Datos..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#004481] hover:bg-blue-900 text-white rounded-xl font-bold shadow-md transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4 text-[#F9A800]" />
                <span>Generar Calendario de Clases</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: SEDES & AMBIENTES */}
      {activeTab === 'ambientes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Sedes Institucionales y Ambientes de Formación
            </h3>
            <p className="text-xs text-slate-500">
              Configuración de tipología de puestos (Ambiente 101 con Torres independientes vs Ambiente 102 con Todo-en-Uno).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ambientes.map(amb => {
              const sede = sedes.find(s => s.id === amb.sedeId);
              const roomAssets = activos.filter(a => a.ambienteId === amb.id);
              const usedAssets = roomAssets.filter(a => a.estado === 'En Uso');

              return (
                <div key={amb.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{amb.nombre}</h4>
                      <p className="text-[11px] text-slate-500">{sede?.nombre}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        amb.tipoEquipamiento === 'All_in_One'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {amb.tipoEquipamiento === 'All_in_One' ? 'Todo-en-Uno (AIO)' : 'Torre + Periféricos'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{amb.descripcion}</p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Capacidad</span>
                      <span className="font-bold text-slate-800">{amb.capacidadPuestos} Puestos</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Activos QR</span>
                      <span className="font-bold text-[#004481]">{roomAssets.length} Total</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">En Uso</span>
                      <span className="font-bold text-emerald-700">{usedAssets.length} Activos</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ASSET */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Dar de Alta Nuevo Activo Tecnológico
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Genera una nueva etiqueta QR institucional para asociar a un puesto de trabajo.
            </p>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código QR Único</label>
                <input
                  type="text"
                  required
                  value={newAsset.codigo_qr}
                  onChange={e => setNewAsset({ ...newAsset, codigo_qr: e.target.value.toUpperCase() })}
                  placeholder="Ej. QR-MON-020"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Activo</label>
                  <select
                    value={newAsset.tipo}
                    onChange={e => setNewAsset({ ...newAsset, tipo: e.target.value as TipoActivo })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Monitor">Monitor</option>
                    <option value="Teclado">Teclado</option>
                    <option value="Ratón">Ratón</option>
                    <option value="Torre">Torre CPU</option>
                    <option value="Todo-en-Uno">Todo-en-Uno (AIO)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ambiente</label>
                  <select
                    value={newAsset.ambienteId}
                    onChange={e => setNewAsset({ ...newAsset, ambienteId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {ambientes.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nombre.split('-')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    value={newAsset.marca}
                    onChange={e => setNewAsset({ ...newAsset, marca: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Serial</label>
                  <input
                    type="text"
                    required
                    value={newAsset.serial}
                    onChange={e => setNewAsset({ ...newAsset, serial: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004481] hover:bg-blue-900 text-white rounded-xl font-bold shadow-sm"
                >
                  Guardar y Generar QR
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
    </div>
  );
};
