// ── Quiz question definitions ─────────────────────────────────────
export interface QuizQuestion {
  key: string;
  text: string;
}

export interface QuizDimension {
  id: string;
  label: string;
  questions: QuizQuestion[];
}

// ── Answer tracking ──────────────────────────────────────────────
export interface QuizAnswer {
  dimensionId: string;
  questionKey: string;
  score: number;
}

// ── All dimensions with questions ────────────────────────────────
export const QUIZ_DIMENSIONS: QuizDimension[] = [
  {
    id: 'Estrategia',
    label: 'Estrategia',
    questions: [
      { key: 'est_1', text: 'Nuestra empresa tiene una estrategia de IA documentada' },
      { key: 'est_2', text: 'La IA es parte de las conversaciones en la direccion' },
      { key: 'est_3', text: 'Tenemos presupuesto asignado para iniciativas de IA' },
    ],
  },
  {
    id: 'Talento',
    label: 'Talento',
    questions: [
      { key: 'tal_1', text: 'Contamos con personas capacitadas en IA en el equipo' },
      { key: 'tal_2', text: 'Ofrecemos formacion en IA a nuestros colaboradores' },
      { key: 'tal_3', text: 'Buscamos activamente perfiles con habilidades en IA' },
    ],
  },
  {
    id: 'Procesos',
    label: 'Procesos',
    questions: [
      { key: 'pro_1', text: 'Identificamos procesos que podrian beneficiarse de IA' },
      { key: 'pro_2', text: 'Ya implementamos automatizacion en algun proceso' },
      { key: 'pro_3', text: 'Medimos el impacto de la IA en nuestra operacion' },
    ],
  },
  {
    id: 'Tecnologia',
    label: 'Tecnologia',
    questions: [
      { key: 'tec_1', text: 'Nuestra infraestructura soporta soluciones de IA' },
      { key: 'tec_2', text: 'Tenemos acceso a datos de calidad para entrenar modelos' },
      { key: 'tec_3', text: 'Usamos herramientas cloud que facilitan adopcion de IA' },
    ],
  },
  {
    id: 'Cultura',
    label: 'Cultura',
    questions: [
      { key: 'cul_1', text: 'El equipo esta abierto a adoptar herramientas de IA' },
      { key: 'cul_2', text: 'Fomentamos la experimentacion con nuevas tecnologias' },
      { key: 'cul_3', text: 'La direccion impulsa activamente la transformacion digital' },
    ],
  },
];
