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
  HistorialAuditoria
} from '../types';

export const INITIAL_SEDES: Sede[] = [
  {
    id: 'sede-cgmlti',
    nombre: 'Sede CGMLTI (Centro de Gestión y Tecnologías)',
    ciudad: 'Bogotá D.C.',
    direccion: 'Calle 52 No. 13 - 65, Chapinero'
  },
  {
    id: 'sede-unigermana',
    nombre: 'Sede Unigermana (Convenio Tecnológico)',
    ciudad: 'Bogotá D.C.',
    direccion: 'Carrera 16 No. 37 - 28, Teusaquillo'
  }
];

export const INITIAL_AMBIENTES: Ambiente[] = [
  {
    id: 'amb-101',
    nombre: 'Ambiente 101 - Laboratorio de Desarrollo',
    sedeId: 'sede-cgmlti',
    tipoEquipamiento: 'Torre_y_Perifericos',
    capacidadPuestos: 20,
    descripcion: 'Equipado con CPU torre independiente, monitor 24", teclado y mouse ergonómico.',
    piso: 'Piso 1, Ala Norte'
  },
  {
    id: 'amb-102',
    nombre: 'Ambiente 102 - Sala Multimedia Todo-en-Uno',
    sedeId: 'sede-unigermana',
    tipoEquipamiento: 'All_in_One',
    capacidadPuestos: 15,
    descripcion: 'Equipado con computadores Todo-en-Uno (AIO), sin torre independiente.',
    piso: 'Piso 2, Módulo B'
  },
  {
    id: 'amb-204',
    nombre: 'Ambiente 204 - Redes y Ciberseguridad',
    sedeId: 'sede-cgmlti',
    tipoEquipamiento: 'Torre_y_Perifericos',
    capacidadPuestos: 25,
    descripcion: 'Laboratorio de alto rendimiento con puestos duales para infraestructura.',
    piso: 'Piso 2, Ala Sur'
  }
];

export const INITIAL_FICHAS: Ficha[] = [
  {
    id: '123456',
    nombrePrograma: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    sedeId: 'sede-cgmlti',
    instructorLiderDoc: '1001',
    totalAprendices: 18
  },
  {
    id: '654321',
    nombrePrograma: 'Técnico en Infraestructura de Redes y Telecomunicaciones',
    jornada: 'Nocturna',
    sedeId: 'sede-unigermana',
    instructorLiderDoc: '1007',
    totalAprendices: 14
  }
];

export const INITIAL_USERS: User[] = [
  {
    documento: '1001',
    nombre: 'Carlos',
    apellido: 'Ramírez Moreno',
    email: 'carlos.ramirez@instituto.edu.co',
    rol: 'Instructor',
    telefono: '310 456 7890'
  },
  {
    documento: '1002',
    nombre: 'Juan',
    apellido: 'Pérez Silva',
    email: 'juan.perez@aprendiz.edu.co',
    rol: 'Aprendiz',
    fichaId: '123456',
    telefono: '315 111 2233'
  },
  {
    documento: '1003',
    nombre: 'María',
    apellido: 'Gómez Cárdenas',
    email: 'maria.gomez@aprendiz.edu.co',
    rol: 'Aprendiz',
    fichaId: '123456',
    telefono: '316 444 5566'
  },
  {
    documento: '1004',
    nombre: 'Roberto',
    apellido: 'Admin Morales',
    email: 'admin.sigea@instituto.edu.co',
    rol: 'Administrador',
    telefono: '300 888 9900'
  },
  {
    documento: '1005',
    nombre: 'Laura',
    apellido: 'Restrepo Valle',
    email: 'laura.restrepo@aprendiz.edu.co',
    rol: 'Aprendiz',
    fichaId: '123456',
    telefono: '318 777 6655'
  },
  {
    documento: '1006',
    nombre: 'Andrés',
    apellido: 'Morales Benítez',
    email: 'andres.morales@aprendiz.edu.co',
    rol: 'Aprendiz',
    fichaId: '123456',
    telefono: '320 333 4455'
  },
  {
    documento: '1007',
    nombre: 'Diana',
    apellido: 'Castro Rincón',
    email: 'diana.castro@instituto.edu.co',
    rol: 'Instructor',
    telefono: '312 999 1122'
  }
];

export const INITIAL_ACTIVOS: Activo[] = [
  // Ambiente 101 (Torre y perifericos) - Puestos 1 al 10
  {
    codigo_qr: 'QR-MON-001',
    tipo: 'Monitor',
    marca: 'Dell UltraSharp 24"',
    modelo: 'U2419H',
    serial: 'SN-DELL-MON-89101',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TEC-001',
    tipo: 'Teclado',
    marca: 'Logitech USB Español',
    modelo: 'K120',
    serial: 'SN-LOG-TEC-44511',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-RAT-001',
    tipo: 'Ratón',
    marca: 'Logitech Óptico USB',
    modelo: 'B100',
    serial: 'SN-LOG-RAT-77123',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TOR-001',
    tipo: 'Torre',
    marca: 'HP ProDesk Core i7',
    modelo: 'G5 400',
    serial: 'SN-HP-TOR-99014',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },

  // Puesto 2 (Ambiente 101) - Pre-assigned to Maria Gómez for rich active dashboard demo
  {
    codigo_qr: 'QR-MON-002',
    tipo: 'Monitor',
    marca: 'Dell UltraSharp 24"',
    modelo: 'U2419H',
    serial: 'SN-DELL-MON-89102',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 2,
    estado: 'En Uso',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TEC-002',
    tipo: 'Teclado',
    marca: 'Logitech USB Español',
    modelo: 'K120',
    serial: 'SN-LOG-TEC-44512',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 2,
    estado: 'En Uso',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-RAT-002',
    tipo: 'Ratón',
    marca: 'Logitech Óptico USB',
    modelo: 'B100',
    serial: 'SN-LOG-RAT-77124',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 2,
    estado: 'En Uso',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TOR-002',
    tipo: 'Torre',
    marca: 'HP ProDesk Core i7',
    modelo: 'G5 400',
    serial: 'SN-HP-TOR-99015',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 2,
    estado: 'En Uso',
    fechaRegistro: '2026-01-15'
  },

  // Puesto 3 (Ambiente 101)
  {
    codigo_qr: 'QR-MON-003',
    tipo: 'Monitor',
    marca: 'LG IPS 24"',
    modelo: '24MK600M',
    serial: 'SN-LG-MON-30113',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 3,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TEC-003',
    tipo: 'Teclado',
    marca: 'Genius Smart USB',
    modelo: 'KB-100',
    serial: 'SN-GEN-TEC-11003',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 3,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-RAT-003',
    tipo: 'Ratón',
    marca: 'Genius DX-120',
    modelo: 'DX-120',
    serial: 'SN-GEN-RAT-22003',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 3,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TOR-003',
    tipo: 'Torre',
    marca: 'Lenovo ThinkCentre M720t',
    modelo: 'M720t Core i5',
    serial: 'SN-LEN-TOR-55003',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 3,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },

  // Puesto 4 (Ambiente 101)
  {
    codigo_qr: 'QR-MON-004',
    tipo: 'Monitor',
    marca: 'Samsung Curvo 24"',
    modelo: 'CR50',
    serial: 'SN-SAM-MON-77004',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 4,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TEC-004',
    tipo: 'Teclado',
    marca: 'Logitech USB',
    modelo: 'K120',
    serial: 'SN-LOG-TEC-44514',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 4,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-RAT-004',
    tipo: 'Ratón',
    marca: 'Logitech USB',
    modelo: 'B100',
    serial: 'SN-LOG-RAT-77126',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 4,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },
  {
    codigo_qr: 'QR-TOR-004',
    tipo: 'Torre',
    marca: 'HP ProDesk Core i7',
    modelo: 'G5 400',
    serial: 'SN-HP-TOR-99017',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    puestoNumero: 4,
    estado: 'Disponible',
    fechaRegistro: '2026-01-15'
  },

  // Ambiente 102 (Unigermana - Todo-en-Uno All-in-One)
  {
    codigo_qr: 'QR-AIO-001',
    tipo: 'Todo-en-Uno',
    marca: 'HP Pavilion 24 All-in-One i7',
    modelo: '24-df1000la',
    serial: 'SN-HP-AIO-1001',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-02-01'
  },
  {
    codigo_qr: 'QR-TEC-101',
    tipo: 'Teclado',
    marca: 'HP Wireless Slim',
    modelo: 'K2500',
    serial: 'SN-HP-TEC-101',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-02-01'
  },
  {
    codigo_qr: 'QR-RAT-101',
    tipo: 'Ratón',
    marca: 'HP Wireless Mouse',
    modelo: 'X3000',
    serial: 'SN-HP-RAT-101',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    puestoNumero: 1,
    estado: 'Disponible',
    fechaRegistro: '2026-02-01'
  },
  {
    codigo_qr: 'QR-AIO-002',
    tipo: 'Todo-en-Uno',
    marca: 'HP Pavilion 24 All-in-One i7',
    modelo: '24-df1000la',
    serial: 'SN-HP-AIO-1002',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    puestoNumero: 2,
    estado: 'Disponible',
    fechaRegistro: '2026-02-01'
  },
  {
    codigo_qr: 'QR-TEC-102',
    tipo: 'Teclado',
    marca: 'HP Wireless Slim',
    modelo: 'K2500',
    serial: 'SN-HP-TEC-102',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    puestoNumero: 2,
    estado: 'Disponible',
    fechaRegistro: '2026-02-01'
  },
  {
    codigo_qr: 'QR-RAT-102',
    tipo: 'Ratón',
    marca: 'HP Wireless Mouse',
    modelo: 'X3000',
    serial: 'SN-HP-RAT-102',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    puestoNumero: 2,
    estado: 'Disponible',
    fechaRegistro: '2026-02-01'
  }
];

export const INITIAL_CLASES: ClaseFormacion[] = [
  {
    id: 1,
    fecha: '2026-08-20',
    hora_inicio: '10:00',
    hora_fin: '12:00',
    fichaId: '123456',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    instructorDoc: '1001',
    tema: 'Desarrollo de Servicios Web y Trazabilidad de Activos',
    estado: 'En Curso'
  },
  {
    id: 2,
    fecha: '2026-08-19',
    hora_inicio: '08:00',
    hora_fin: '12:00',
    fichaId: '123456',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    instructorDoc: '1001',
    tema: 'Bases de Datos Relacionales y Normalización',
    estado: 'Finalizada',
    observacionesCierre: 'Sesión finalizada a tiempo. 18 aprendices presentes. Todos los equipos entregados en orden.',
    checklistCierre: {
      equiposApagados: true,
      perifericosCompletos: true,
      puestosOrdenados: true,
      novedadesReportadas: false,
      llavesEntregadas: true,
      firmaInstructor: 'Carlos Ramírez'
    }
  },
  {
    id: 3,
    fecha: '2026-08-21',
    hora_inicio: '10:00',
    hora_fin: '12:00',
    fichaId: '123456',
    sedeId: 'sede-cgmlti',
    ambienteId: 'amb-101',
    instructorDoc: '1001',
    tema: 'Pruebas Unitarias y Despliegue en Servidores',
    estado: 'Programada'
  },
  {
    id: 4,
    fecha: '2026-08-20',
    hora_inicio: '18:00',
    hora_fin: '22:00',
    fichaId: '654321',
    sedeId: 'sede-unigermana',
    ambienteId: 'amb-102',
    instructorDoc: '1007',
    tema: 'Configuración de VLANs y Seguridad Perimetral',
    estado: 'Programada'
  }
];

export const INITIAL_REGISTROS: RegistroActivo[] = [
  // Maria Gómez (1003) already registered her workstation 2 in active class 1
  {
    id: 'reg-001',
    id_usuario: '1003',
    id_clase: 1,
    id_activo: 'QR-MON-002',
    tipo_activo: 'Monitor',
    fecha_hora_registro: '2026-08-20T10:05:00',
    estado_entrega: 'Excelente'
  },
  {
    id: 'reg-002',
    id_usuario: '1003',
    id_clase: 1,
    id_activo: 'QR-TEC-002',
    tipo_activo: 'Teclado',
    fecha_hora_registro: '2026-08-20T10:05:22',
    estado_entrega: 'Excelente'
  },
  {
    id: 'reg-003',
    id_usuario: '1003',
    id_clase: 1,
    id_activo: 'QR-RAT-002',
    tipo_activo: 'Ratón',
    fecha_hora_registro: '2026-08-20T10:05:40',
    estado_entrega: 'Excelente'
  },
  {
    id: 'reg-004',
    id_usuario: '1003',
    id_clase: 1,
    id_activo: 'QR-TOR-002',
    tipo_activo: 'Torre',
    fecha_hora_registro: '2026-08-20T10:06:05',
    estado_entrega: 'Excelente'
  },

  // Past registrations for Juan in Class 2
  {
    id: 'reg-past-001',
    id_usuario: '1002',
    id_clase: 2,
    id_activo: 'QR-MON-001',
    tipo_activo: 'Monitor',
    fecha_hora_registro: '2026-08-19T08:02:11',
    estado_entrega: 'Excelente',
    estado_devolucion: 'Excelente',
    observaciones_devolucion: 'Entregado en perfecto estado funcional.'
  },
  {
    id: 'reg-past-002',
    id_usuario: '1002',
    id_clase: 2,
    id_activo: 'QR-TEC-001',
    tipo_activo: 'Teclado',
    fecha_hora_registro: '2026-08-19T08:02:40',
    estado_entrega: 'Excelente',
    estado_devolucion: 'Excelente'
  },
  {
    id: 'reg-past-003',
    id_usuario: '1002',
    id_clase: 2,
    id_activo: 'QR-RAT-001',
    tipo_activo: 'Ratón',
    fecha_hora_registro: '2026-08-19T08:03:00',
    estado_entrega: 'Bueno',
    estado_devolucion: 'Bueno'
  },
  {
    id: 'reg-past-004',
    id_usuario: '1002',
    id_clase: 2,
    id_activo: 'QR-TOR-001',
    tipo_activo: 'Torre',
    fecha_hora_registro: '2026-08-19T08:03:25',
    estado_entrega: 'Excelente',
    estado_devolucion: 'Excelente'
  }
];

export const INITIAL_SOLICITUDES_CAMBIO: SolicitudCambioPuesto[] = [];

export const INITIAL_NOVEDADES: NovedadActivo[] = [
  {
    id: 'nov-001',
    codigo_qr: 'QR-TEC-003',
    reportadoPorDoc: '1001',
    rolReportante: 'Instructor',
    claseId: 2,
    fecha: '2026-08-19 11:30',
    tipoNovedad: 'Fallo Físico',
    descripcion: 'La tecla espaciadora presenta resistencia al presionar.',
    prioridad: 'Baja',
    estado: 'En Revisión'
  }
];

export const INITIAL_AUDITORIA: HistorialAuditoria[] = [
  {
    id: 'aud-001',
    fecha: '2026-08-20 10:00',
    accion: 'INICIO_CLASE',
    usuarioDoc: '1001',
    usuarioNombre: 'Carlos Ramírez',
    rol: 'Instructor',
    detalle: 'Inició sesión de formación para Ficha 123456 en Ambiente 101.',
    claseId: 1
  },
  {
    id: 'aud-002',
    fecha: '2026-08-20 10:06',
    accion: 'REGISTRO_PUESTO_COMPLETO',
    usuarioDoc: '1003',
    usuarioNombre: 'María Gómez',
    rol: 'Aprendiz',
    detalle: 'Completó registro de 4 activos (Puesto 2) en Clase #1.',
    claseId: 1
  }
];
