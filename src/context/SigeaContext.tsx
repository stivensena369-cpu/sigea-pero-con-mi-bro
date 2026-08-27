import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Activo,
  Sede,
  Ambiente,
  Ficha,
  ClaseFormacion,
  RegistroActivo,
  SolicitudCambioPuesto,
  NovedadActivo,
  HistorialAuditoria,
  TipoActivo,
  EstadoActivo,
  ChecklistFinalizacion
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SEDES,
  INITIAL_AMBIENTES,
  INITIAL_FICHAS,
  INITIAL_ACTIVOS,
  INITIAL_CLASES,
  INITIAL_REGISTROS,
  INITIAL_SOLICITUDES_CAMBIO,
  INITIAL_NOVEDADES,
  INITIAL_AUDITORIA
} from '../data/mockData';

interface SigeaContextType {
  currentUser: User | null;
  users: User[];
  sedes: Sede[];
  ambientes: Ambiente[];
  fichas: Ficha[];
  activos: Activo[];
  clases: ClaseFormacion[];
  registros: RegistroActivo[];
  solicitudesCambio: SolicitudCambioPuesto[];
  novedades: NovedadActivo[];
  auditoria: HistorialAuditoria[];
  activeClassId: number;
  setActiveClassId: (id: number) => void;
  
  // Auth & Session
  login: (documento: string, contrasena?: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
  switchUser: (documento: string) => void;
  resetAllData: () => void;

  // Student Operations
  registrarActivo: (
    aprendizDoc: string,
    claseId: number,
    codigoQr: string,
    tipoActivo: TipoActivo,
    estadoEntrega?: 'Excelente' | 'Bueno' | 'Con Novedad',
    observaciones?: string
  ) => { success: boolean; message: string };
  eliminarRegistroActivo: (registroId: string) => void;
  solicitarCambioPuesto: (aprendizDoc: string, claseId: number, motivo: string) => void;
  finalizarSesionAprendiz: (
    aprendizDoc: string,
    claseId: number,
    estadoDevolucion: 'Excelente' | 'Bueno' | 'Con Novedad',
    observaciones?: string
  ) => void;

  // Instructor Operations
  autorizarCambioPuesto: (aprendizDoc: string, claseId: number) => { success: boolean; message: string };
  finalizarClaseInstructor: (
    claseId: number,
    checklist: ChecklistFinalizacion,
    observaciones?: string
  ) => { success: boolean; message: string };
  reportarNovedad: (novedad: Omit<NovedadActivo, 'id' | 'fecha' | 'estado'>) => void;
  resolverNovedad: (novedadId: string) => void;

  // Admin Operations
  importarCsv: (csvText: string, tipoEntidad: 'activos' | 'usuarios' | 'clases') => { success: boolean; count: number; message: string };
  generarClasesTrimestre: (
    fichaId: string,
    instructorDoc: string,
    ambienteId: string,
    diasSemana: string[],
    fechaInicio: string,
    totalSemanas: number,
    horaInicio: string,
    horaFin: string,
    temaBase: string
  ) => { success: boolean; count: number };
  crearActivo: (activo: Activo) => { success: boolean; message: string };
  actualizarEstadoActivo: (codigoQr: string, nuevoEstado: EstadoActivo, observaciones?: string) => void;
  
  // Helpers
  getActiveClass: () => ClaseFormacion | undefined;
  getAmbiente: (id: string) => Ambiente | undefined;
  getSede: (id: string) => Sede | undefined;
  getFicha: (id: string) => Ficha | undefined;
  getUser: (doc: string) => User | undefined;
  getStudentRegistrationsForClass: (aprendizDoc: string, claseId: number) => RegistroActivo[];
  isStudentWorkstationComplete: (aprendizDoc: string, claseId: number) => boolean;
}

const SigeaContext = createContext<SigeaContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const SigeaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage<User | null>('sigea_current_user', INITIAL_USERS[1]) // Default to Juan (Student 1002) for preview
  );
  const [users, setUsers] = useState<User[]>(() => loadFromStorage<User[]>('sigea_users', INITIAL_USERS));
  const [sedes, setSedes] = useState<Sede[]>(() => loadFromStorage<Sede[]>('sigea_sedes', INITIAL_SEDES));
  const [ambientes, setAmbientes] = useState<Ambiente[]>(() => loadFromStorage<Ambiente[]>('sigea_ambientes', INITIAL_AMBIENTES));
  const [fichas, setFichas] = useState<Ficha[]>(() => loadFromStorage<Ficha[]>('sigea_fichas', INITIAL_FICHAS));
  const [activos, setActivos] = useState<Activo[]>(() => loadFromStorage<Activo[]>('sigea_activos', INITIAL_ACTIVOS));
  const [clases, setClases] = useState<ClaseFormacion[]>(() => loadFromStorage<ClaseFormacion[]>('sigea_clases', INITIAL_CLASES));
  const [registros, setRegistros] = useState<RegistroActivo[]>(() => loadFromStorage<RegistroActivo[]>('sigea_registros', INITIAL_REGISTROS));
  const [solicitudesCambio, setSolicitudesCambio] = useState<SolicitudCambioPuesto[]>(() =>
    loadFromStorage<SolicitudCambioPuesto[]>('sigea_solicitudes', INITIAL_SOLICITUDES_CAMBIO)
  );
  const [novedades, setNovedades] = useState<NovedadActivo[]>(() => loadFromStorage<NovedadActivo[]>('sigea_novedades', INITIAL_NOVEDADES));
  const [auditoria, setAuditoria] = useState<HistorialAuditoria[]>(() => loadFromStorage<HistorialAuditoria[]>('sigea_auditoria', INITIAL_AUDITORIA));
  const [activeClassId, setActiveClassId] = useState<number>(() => loadFromStorage<number>('sigea_active_class_id', 1));

  // Sync to localStorage
  useEffect(() => saveToStorage('sigea_current_user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('sigea_users', users), [users]);
  useEffect(() => saveToStorage('sigea_sedes', sedes), [sedes]);
  useEffect(() => saveToStorage('sigea_ambientes', ambientes), [ambientes]);
  useEffect(() => saveToStorage('sigea_fichas', fichas), [fichas]);
  useEffect(() => saveToStorage('sigea_activos', activos), [activos]);
  useEffect(() => saveToStorage('sigea_clases', clases), [clases]);
  useEffect(() => saveToStorage('sigea_registros', registros), [registros]);
  useEffect(() => saveToStorage('sigea_solicitudes', solicitudesCambio), [solicitudesCambio]);
  useEffect(() => saveToStorage('sigea_novedades', novedades), [novedades]);
  useEffect(() => saveToStorage('sigea_auditoria', auditoria), [auditoria]);
  useEffect(() => saveToStorage('sigea_active_class_id', activeClassId), [activeClassId]);

  const addAuditLog = (
    accion: string,
    detalle: string,
    codigoQr?: string,
    claseId?: number,
    customUser?: User
  ) => {
    const user = customUser || currentUser;
    const newEntry: HistorialAuditoria = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      accion,
      usuarioDoc: user ? user.documento : 'SISTEMA',
      usuarioNombre: user ? `${user.nombre} ${user.apellido}` : 'Sistema SIGEA',
      rol: user ? user.rol : 'Administrador',
      detalle,
      codigo_qr: codigoQr,
      claseId
    };
    setAuditoria(prev => [newEntry, ...prev]);
  };

  const login = (documento: string, _contrasena?: string) => {
    const foundUser = users.find(u => u.documento.trim() === documento.trim());
    if (foundUser) {
      setCurrentUser(foundUser);
      addAuditLog('INICIO_SESION', `Usuario ${foundUser.nombre} (${foundUser.rol}) inició sesión en SIGEA.`, undefined, undefined, foundUser);
      return { success: true, message: `Bienvenido, ${foundUser.nombre} ${foundUser.apellido}`, user: foundUser };
    }
    return { success: false, message: 'Documento no encontrado. Use uno de los usuarios de prueba (1001, 1002, 1003, 1004).' };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('CIERRE_SESION', `Usuario ${currentUser.nombre} cerró sesión.`);
    }
    setCurrentUser(null);
  };

  const switchUser = (documento: string) => {
    const foundUser = users.find(u => u.documento === documento);
    if (foundUser) {
      setCurrentUser(foundUser);
      addAuditLog('CAMBIO_USUARIO_DEMO', `Cambio de perfil activo a ${foundUser.nombre} (${foundUser.rol})`, undefined, undefined, foundUser);
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setSedes(INITIAL_SEDES);
    setAmbientes(INITIAL_AMBIENTES);
    setFichas(INITIAL_FICHAS);
    setActivos(INITIAL_ACTIVOS);
    setClases(INITIAL_CLASES);
    setRegistros(INITIAL_REGISTROS);
    setSolicitudesCambio(INITIAL_SOLICITUDES_CAMBIO);
    setNovedades(INITIAL_NOVEDADES);
    setAuditoria(INITIAL_AUDITORIA);
    setActiveClassId(1);
    setCurrentUser(INITIAL_USERS[1]); // Juan Pérez
  };

  const getActiveClass = () => clases.find(c => c.id === activeClassId);
  const getAmbiente = (id: string) => ambientes.find(a => a.id === id);
  const getSede = (id: string) => sedes.find(s => s.id === id);
  const getFicha = (id: string) => fichas.find(f => f.id === id);
  const getUser = (doc: string) => users.find(u => u.documento === doc);

  const getStudentRegistrationsForClass = (aprendizDoc: string, claseId: number) => {
    return registros.filter(r => r.id_usuario === aprendizDoc && r.id_clase === claseId && !r.liberadoPorCambio);
  };

  const isStudentWorkstationComplete = (aprendizDoc: string, claseId: number) => {
    const cls = clases.find(c => c.id === claseId);
    if (!cls) return false;
    const amb = ambientes.find(a => a.id === cls.ambienteId);
    const regs = getStudentRegistrationsForClass(aprendizDoc, claseId);

    const hasMonitor = regs.some(r => r.tipo_activo === 'Monitor' || r.tipo_activo === 'Todo-en-Uno');
    const hasKeyboard = regs.some(r => r.tipo_activo === 'Teclado');
    const hasMouse = regs.some(r => r.tipo_activo === 'Ratón');
    
    if (amb?.tipoEquipamiento === 'Torre_y_Perifericos') {
      const hasTower = regs.some(r => r.tipo_activo === 'Torre');
      return hasMonitor && hasKeyboard && hasMouse && hasTower;
    } else {
      return hasMonitor && hasKeyboard && hasMouse;
    }
  };

  const registrarActivo = (
    aprendizDoc: string,
    claseId: number,
    codigoQr: string,
    tipoActivo: TipoActivo,
    estadoEntrega: 'Excelente' | 'Bueno' | 'Con Novedad' = 'Excelente',
    observaciones: string = ''
  ): { success: boolean; message: string } => {
    const cleanQr = codigoQr.trim().toUpperCase();
    const activo = activos.find(a => a.codigo_qr.toUpperCase() === cleanQr);

    if (!activo) {
      return {
        success: false,
        message: `El código QR "${cleanQr}" no existe en el inventario institucional.`
      };
    }

    if (activo.estado === 'De Baja' || activo.estado === 'En Mantenimiento') {
      return {
        success: false,
        message: `El activo ${cleanQr} no está disponible para uso (Estado: ${activo.estado}).`
      };
    }

    // Check type match
    // Note: In All-in-One environments, Todo-en-Uno counts for Monitor
    const isMatchingType =
      activo.tipo === tipoActivo ||
      (tipoActivo === 'Monitor' && activo.tipo === 'Todo-en-Uno') ||
      (tipoActivo === 'Todo-en-Uno' && activo.tipo === 'Monitor');

    if (!isMatchingType) {
      return {
        success: false,
        message: `Inconsistencia de tipo: El QR escaneado corresponde a un(a) "${activo.tipo}", pero se esperaba un(a) "${tipoActivo}".`
      };
    }

    // Check if this active QR is already registered by another user in this class
    const duplicateInClass = registros.find(
      r => r.id_clase === claseId && r.id_activo.toUpperCase() === cleanQr && !r.liberadoPorCambio
    );

    if (duplicateInClass) {
      if (duplicateInClass.id_usuario === aprendizDoc) {
        return {
          success: false,
          message: `Ya tienes registrado este activo (${cleanQr}) en tu puesto de trabajo.`
        };
      }
      const otherUser = users.find(u => u.documento === duplicateInClass.id_usuario);
      const name = otherUser ? `${otherUser.nombre} ${otherUser.apellido}` : duplicateInClass.id_usuario;
      return {
        success: false,
        message: `Conflicto de activo: El activo ${cleanQr} ya fue registrado por el aprendiz ${name} en esta sesión.`
      };
    }

    // Check if the student already registered an asset for this exact slot; if so, replace it
    const existingSlotReg = registros.find(
      r => r.id_usuario === aprendizDoc && r.id_clase === claseId && r.tipo_activo === tipoActivo && !r.liberadoPorCambio
    );

    let updatedRegistros = [...registros];
    if (existingSlotReg) {
      // Free the old asset
      setActivos(prev =>
        prev.map(a => (a.codigo_qr === existingSlotReg.id_activo ? { ...a, estado: 'Disponible' } : a))
      );
      // Remove old slot registration
      updatedRegistros = updatedRegistros.filter(r => r.id !== existingSlotReg.id);
    }

    const newRegistro: RegistroActivo = {
      id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      id_usuario: aprendizDoc,
      id_clase: claseId,
      id_activo: cleanQr,
      tipo_activo: tipoActivo,
      fecha_hora_registro: new Date().toISOString(),
      estado_entrega: estadoEntrega,
      observaciones_entrega: observaciones
    };

    setRegistros([...updatedRegistros, newRegistro]);

    // Mark asset as 'En Uso'
    setActivos(prev =>
      prev.map(a => (a.codigo_qr === cleanQr ? { ...a, estado: 'En Uso' } : a))
    );

    const student = users.find(u => u.documento === aprendizDoc);
    addAuditLog(
      'REGISTRO_ACTIVO',
      `Aprendiz ${student?.nombre || aprendizDoc} vinculó activo ${cleanQr} (${tipoActivo} - ${activo.marca}) en Clase #${claseId}.`,
      cleanQr,
      claseId
    );

    return {
      success: true,
      message: `¡Activo ${cleanQr} (${tipoActivo}) registrado con éxito!`
    };
  };

  const eliminarRegistroActivo = (registroId: string) => {
    const reg = registros.find(r => r.id === registroId);
    if (!reg) return;

    setRegistros(prev => prev.filter(r => r.id !== registroId));
    // Free the asset
    setActivos(prev =>
      prev.map(a => (a.codigo_qr === reg.id_activo ? { ...a, estado: 'Disponible' } : a))
    );
    addAuditLog('ELIMINAR_REGISTRO', `Se desvinculó activo ${reg.id_activo} (${reg.tipo_activo}) de la Clase #${reg.id_clase}`, reg.id_activo, reg.id_clase);
  };

  const solicitarCambioPuesto = (aprendizDoc: string, claseId: number, motivo: string) => {
    const newSolicitud: SolicitudCambioPuesto = {
      id: `sol-${Date.now()}`,
      aprendizDoc,
      claseId,
      motivo,
      estado: 'Pendiente',
      fechaSolicitud: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setSolicitudesCambio(prev => [newSolicitud, ...prev]);
    const student = users.find(u => u.documento === aprendizDoc);
    addAuditLog('SOLICITUD_CAMBIO_PUESTO', `Aprendiz ${student?.nombre || aprendizDoc} solicitó autorización para cambio de puesto de trabajo. Motivo: ${motivo}`, undefined, claseId);
  };

  const autorizarCambioPuesto = (aprendizDoc: string, claseId: number): { success: boolean; message: string } => {
    // 1. Get current active registrations for this student in this class
    const studentRegs = registros.filter(r => r.id_usuario === aprendizDoc && r.id_clase === claseId && !r.liberadoPorCambio);
    
    // 2. Free those assets in the inventory
    const releasedQrCodes = studentRegs.map(r => r.id_activo);
    setActivos(prev =>
      prev.map(a => (releasedQrCodes.includes(a.codigo_qr) ? { ...a, estado: 'Disponible' } : a))
    );

    // 3. Mark registrations as released
    setRegistros(prev =>
      prev.map(r =>
        r.id_usuario === aprendizDoc && r.id_clase === claseId && !r.liberadoPorCambio
          ? { ...r, liberadoPorCambio: true }
          : r
      )
    );

    // 4. Update request status if exists
    setSolicitudesCambio(prev =>
      prev.map(s =>
        s.aprendizDoc === aprendizDoc && s.claseId === claseId && s.estado === 'Pendiente'
          ? { ...s, estado: 'Autorizado', fechaRespuesta: new Date().toISOString(), instructorDoc: currentUser?.documento }
          : s
      )
    );

    const student = users.find(u => u.documento === aprendizDoc);
    const studentName = student ? `${student.nombre} ${student.apellido}` : aprendizDoc;
    addAuditLog(
      'AUTORIZACION_CAMBIO_PUESTO',
      `Instructor autorizó cambio de puesto para ${studentName}. Se liberaron ${releasedQrCodes.length} activos (${releasedQrCodes.join(', ') || 'Ninguno previo'}).`,
      undefined,
      claseId
    );

    return {
      success: true,
      message: `Cambio de puesto autorizado para ${studentName}. Sus activos anteriores fueron liberados y ya puede registrar su nuevo puesto.`
    };
  };

  const finalizarSesionAprendiz = (
    aprendizDoc: string,
    claseId: number,
    estadoDevolucion: 'Excelente' | 'Bueno' | 'Con Novedad',
    observaciones: string = ''
  ) => {
    setRegistros(prev =>
      prev.map(r =>
        r.id_usuario === aprendizDoc && r.id_clase === claseId && !r.liberadoPorCambio
          ? { ...r, estado_devolucion: estadoDevolucion, observaciones_devolucion: observaciones }
          : r
      )
    );
    const student = users.find(u => u.documento === aprendizDoc);
    addAuditLog(
      'FINALIZAR_SESION_APRENDIZ',
      `Aprendiz ${student?.nombre || aprendizDoc} reportó estado final de puesto: ${estadoDevolucion}. Observaciones: ${observaciones || 'Sin novedad.'}`,
      undefined,
      claseId
    );
  };

  const finalizarClaseInstructor = (
    claseId: number,
    checklist: ChecklistFinalizacion,
    observaciones: string = ''
  ): { success: boolean; message: string } => {
    setClases(prev =>
      prev.map(c =>
        c.id === claseId
          ? {
              ...c,
              estado: 'Finalizada',
              observacionesCierre: observaciones,
              checklistCierre: { ...checklist, firmaInstructor: currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'Instructor' }
            }
          : c
      )
    );

    // Release all active assets from this class back to 'Disponible'
    const classRegistrations = registros.filter(r => r.id_clase === claseId && !r.liberadoPorCambio);
    const usedQrs = classRegistrations.map(r => r.id_activo);

    setActivos(prev =>
      prev.map(a => (usedQrs.includes(a.codigo_qr) ? { ...a, estado: 'Disponible' } : a))
    );

    addAuditLog(
      'FINALIZACION_CLASE',
      `Instructor finalizó la Clase #${claseId}. Auditoría de aula completada: ${checklist.equiposApagados ? 'Equipos apagados ✓' : 'Faltan equipos por apagar'}. ${observaciones}`,
      undefined,
      claseId
    );

    return {
      success: true,
      message: `Clase #${claseId} finalizada correctamente. Se liberaron los activos y se archivó el acta de entrega.`
    };
  };

  const reportarNovedad = (novedadData: Omit<NovedadActivo, 'id' | 'fecha' | 'estado'>) => {
    const newNov: NovedadActivo = {
      ...novedadData,
      id: `nov-${Date.now()}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estado: 'Abierta'
    };
    setNovedades(prev => [newNov, ...prev]);

    // If critical or high, mark asset under maintenance
    if (novedadData.prioridad === 'Crítica' || novedadData.prioridad === 'Alta') {
      setActivos(prev =>
        prev.map(a => (a.codigo_qr === novedadData.codigo_qr ? { ...a, estado: 'En Mantenimiento' } : a))
      );
    }

    addAuditLog(
      'REPORTE_NOVEDAD',
      `Novedad [${novedadData.prioridad}] reportada sobre ${novedadData.codigo_qr}: ${novedadData.descripcion}`,
      novedadData.codigo_qr,
      novedadData.claseId
    );
  };

  const resolverNovedad = (novedadId: string) => {
    const nov = novedades.find(n => n.id === novedadId);
    if (!nov) return;
    setNovedades(prev => prev.map(n => (n.id === novedadId ? { ...n, estado: 'Resuelta' } : n)));
    // Restore asset state to Disponible
    setActivos(prev => prev.map(a => (a.codigo_qr === nov.codigo_qr ? { ...a, estado: 'Disponible' } : a)));
    addAuditLog('RESOLVER_NOVEDAD', `Se resolvió novedad sobre activo ${nov.codigo_qr}. Activo reincorporado a disponible.`, nov.codigo_qr);
  };

  const importarCsv = (csvText: string, tipoEntidad: 'activos' | 'usuarios' | 'clases') => {
    try {
      const lines = csvText.trim().split('\n').filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        return { success: false, count: 0, message: 'El archivo CSV está vacío o solo contiene encabezados.' };
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      if (tipoEntidad === 'activos') {
        const newActivos: Activo[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (cols.length >= 4) {
            const qr = cols[0];
            const tipo = (cols[1] || 'Monitor') as TipoActivo;
            const marca = cols[2] || 'Generica';
            const serial = cols[3] || `SN-${Date.now()}-${i}`;
            const sedeId = cols[4] || 'sede-cgmlti';
            const ambienteId = cols[5] || 'amb-101';
            const puestoNumero = cols[6] ? parseInt(cols[6], 10) : undefined;
            const estado = (cols[7] || 'Disponible') as EstadoActivo;

            // avoid duplicates
            if (!activos.some(a => a.codigo_qr === qr) && !newActivos.some(a => a.codigo_qr === qr)) {
              newActivos.push({
                codigo_qr: qr,
                tipo,
                marca,
                modelo: 'Importado CSV',
                serial,
                sedeId,
                ambienteId,
                puestoNumero,
                estado,
                fechaRegistro: new Date().toISOString().substring(0, 10)
              });
            }
          }
        }
        if (newActivos.length > 0) {
          setActivos(prev => [...newActivos, ...prev]);
          addAuditLog('IMPORTACION_CSV_ACTIVOS', `Se importaron ${newActivos.length} nuevos activos desde archivo CSV.`);
          return { success: true, count: newActivos.length, message: `Se importaron exitosamente ${newActivos.length} activos al inventario.` };
        }
        return { success: false, count: 0, message: 'No se encontraron nuevos activos válidos o todos ya existen en el sistema.' };
      }

      if (tipoEntidad === 'usuarios') {
        const newUsers: User[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (cols.length >= 4) {
            const doc = cols[0];
            const nombre = cols[1];
            const apellido = cols[2];
            const rol = (cols[3] || 'Aprendiz') as any;
            const email = cols[4] || `${nombre.toLowerCase()}.${apellido.toLowerCase()}@instituto.edu.co`;
            const fichaId = cols[5] || '123456';

            if (!users.some(u => u.documento === doc) && !newUsers.some(u => u.documento === doc)) {
              newUsers.push({
                documento: doc,
                nombre,
                apellido,
                email,
                rol,
                fichaId: rol === 'Aprendiz' ? fichaId : undefined
              });
            }
          }
        }
        if (newUsers.length > 0) {
          setUsers(prev => [...prev, ...newUsers]);
          addAuditLog('IMPORTACION_CSV_USUARIOS', `Se importaron ${newUsers.length} nuevos usuarios desde archivo CSV.`);
          return { success: true, count: newUsers.length, message: `Se importaron exitosamente ${newUsers.length} usuarios.` };
        }
        return { success: false, count: 0, message: 'No se encontraron nuevos usuarios para registrar.' };
      }

      return { success: false, count: 0, message: 'Tipo de entidad no soportado para importación directa.' };
    } catch (e: any) {
      return { success: false, count: 0, message: `Error al procesar el archivo CSV: ${e.message}` };
    }
  };

  const generarClasesTrimestre = (
    fichaId: string,
    instructorDoc: string,
    ambienteId: string,
    diasSemana: string[],
    fechaInicio: string,
    totalSemanas: number,
    horaInicio: string,
    horaFin: string,
    temaBase: string
  ) => {
    const newClasses: ClaseFormacion[] = [];
    const baseDate = new Date(fechaInicio || '2026-08-25');
    const dayMap: { [key: string]: number } = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6
    };

    let nextId = Math.max(...clases.map(c => c.id), 0) + 1;
    const amb = ambientes.find(a => a.id === ambienteId);
    const sedeId = amb ? amb.sedeId : 'sede-cgmlti';

    for (let s = 0; s < totalSemanas; s++) {
      for (const diaName of diasSemana) {
        const targetDayNum = dayMap[diaName] || 1;
        const classDate = new Date(baseDate);
        classDate.setDate(baseDate.getDate() + s * 7 + (targetDayNum - baseDate.getDay()));

        const dateStr = classDate.toISOString().substring(0, 10);
        newClasses.push({
          id: nextId++,
          fecha: dateStr,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          fichaId,
          sedeId,
          ambienteId,
          instructorDoc,
          tema: `${temaBase} - Semana ${s + 1} (${diaName})`,
          estado: 'Programada'
        });
      }
    }

    setClases(prev => [...prev, ...newClasses]);
    addAuditLog('GENERACION_CLASES_TRIMESTRE', `Se generaron ${newClasses.length} sesiones de formación programadas para la Ficha ${fichaId}.`);
    return { success: true, count: newClasses.length };
  };

  const crearActivo = (nuevoActivo: Activo) => {
    if (activos.some(a => a.codigo_qr.toUpperCase() === nuevoActivo.codigo_qr.trim().toUpperCase())) {
      return { success: false, message: `El código QR "${nuevoActivo.codigo_qr}" ya se encuentra registrado.` };
    }
    const clean: Activo = {
      ...nuevoActivo,
      codigo_qr: nuevoActivo.codigo_qr.trim().toUpperCase(),
      fechaRegistro: new Date().toISOString().substring(0, 10)
    };
    setActivos(prev => [clean, ...prev]);
    addAuditLog('CREAR_ACTIVO', `Se dio de alta el activo ${clean.codigo_qr} (${clean.tipo} ${clean.marca}) en ${clean.ambienteId}.`, clean.codigo_qr);
    return { success: true, message: `Activo ${clean.codigo_qr} creado con éxito.` };
  };

  const actualizarEstadoActivo = (codigoQr: string, nuevoEstado: EstadoActivo, observaciones?: string) => {
    setActivos(prev =>
      prev.map(a =>
        a.codigo_qr === codigoQr
          ? { ...a, estado: nuevoEstado, observaciones: observaciones || a.observaciones }
          : a
      )
    );
    addAuditLog('ACTUALIZAR_ESTADO_ACTIVO', `Estado de activo ${codigoQr} cambiado a "${nuevoEstado}". ${observaciones || ''}`, codigoQr);
  };

  const contextValue = useMemo<SigeaContextType>(
    () => ({
      currentUser,
      users,
      sedes,
      ambientes,
      fichas,
      activos,
      clases,
      registros,
      solicitudesCambio,
      novedades,
      auditoria,
      activeClassId,
      setActiveClassId,
      login,
      logout,
      switchUser,
      resetAllData,
      registrarActivo,
      eliminarRegistroActivo,
      solicitarCambioPuesto,
      finalizarSesionAprendiz,
      autorizarCambioPuesto,
      finalizarClaseInstructor,
      reportarNovedad,
      resolverNovedad,
      importarCsv,
      generarClasesTrimestre,
      crearActivo,
      actualizarEstadoActivo,
      getActiveClass,
      getAmbiente,
      getSede,
      getFicha,
      getUser,
      getStudentRegistrationsForClass,
      isStudentWorkstationComplete
    }),
    [
      currentUser,
      users,
      sedes,
      ambientes,
      fichas,
      activos,
      clases,
      registros,
      solicitudesCambio,
      novedades,
      auditoria,
      activeClassId
    ]
  );

  return <SigeaContext.Provider value={contextValue}>{children}</SigeaContext.Provider>;
};

export const useSigea = () => {
  const context = useContext(SigeaContext);
  if (!context) {
    throw new Error('useSigea must be used within a SigeaProvider');
  }
  return context;
};
