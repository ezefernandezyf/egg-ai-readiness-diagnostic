# UI Design Spec: Egg AI Readiness Diagnostic

> Especificación visual para el MVP demo. No es arquitectura técnica.

## Paleta de Colores (OKLCH)

| Token | Hex | OKLCH | Uso |
|-------|-----|-------|-----|
| `--bg-primary` | `#0D0D0D` | oklch(12% 0.01 260) | Fondo principal (dark mode) |
| `--bg-surface` | `#1A1A1A` | oklch(20% 0.01 260) | Cards, inputs, elevación |
| `--bg-elevated` | `#242424` | oklch(26% 0.01 260) | Hover, surface elevado |
| `--text-primary` | `#F5F5F0` | oklch(95% 0.005 90) | Texto principal |
| `--text-secondary` | `#A0A09C` | oklch(70% 0.01 90) | Texto secundario |
| `--accent-amber` | `#D4A017` | oklch(72% 0.15 80) | CTAs, acentos (herencia Egg) |
| `--accent-teal` | `#2E8B8B` | oklch(55% 0.12 200) | Scores, radar, progreso (identidad propia) |
| `--success` | `#22C55E` | oklch(65% 0.18 150) | Scores altos |
| `--warning` | `#EAB308` | oklch(75% 0.18 90) | Scores medios |
| `--error` | `#EF4444` | oklch(55% 0.20 30) | Scores bajos |

Light mode: invertir bg/text, mantener accent-amber y accent-teal.

## Tipografía

| Token | Familia | Tamaño | Peso | Uso |
|-------|---------|--------|------|-----|
| Display | Geist | 48px | 700 | Headline intro |
| Heading | Geist | 24px | 600 | Títulos de sección |
| Body | Geist | 16px | 400 | Texto general |
| Caption | Geist | 14px | 400 | Descripciones |
| Score | Geist Mono | 48px | 700 | Números de score |
| Label | Geist | 12px | 600 | Labels de formulario |

## Espaciado (Grid 4px)

`--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`, `--space-10: 40px`, `--space-16: 64px`, `--space-20: 80px`

## Componentes

### Botón Primario
- bg: `--accent-amber`, text: `#0D0D0D` (weight 600), padding: 14px 32px, radius: 8px
- Hover: brightness 1.1, Active: scale 0.98

### Botón Secundario
- bg: transparent, border: 1px solid `--text-secondary`, text: `--text-primary`
- Hover: bg `--bg-surface`

### Input
- bg: `--bg-surface`, border: 1px solid transparent, focus: border `--accent-teal`
- Text: `--text-primary`, placeholder: `--text-secondary`
- Label arriba, error abajo (rojo)

### Progress Bar
- Track: `--bg-surface`, Fill: `--accent-teal` con gradiente sutil
- Altura: 4px, radius: 2px

### Likert Scale (1-5)
- Pills circulares, `--bg-surface` default, `--accent-teal` selected
- Hover: bg `--bg-elevated`

## Layouts

### Screen 1 — Intro
```
[Logo][                    ][Login]
[                                  ]
[  DIAGNÓSTICO DE TRANSFORMACIÓN   ]
[  ¿Tu equipo está listo           ]
[  para la era IA?                 ]
[                                  ]
[  Respondé 15 preguntas y         ]
[  recibí un reporte instantáneo   ]
[  con recomendaciones.            ]
[                                  ]
[  ┌──────────────────────────┐    ]
[  │   Comenzar diagnóstico   │    ]
[  └──────────────────────────┘    ]
[                                  ]
[  Sin registro · 5 min · Reporte  ]
```

### Screen 2 — Quiz (1 dimensión por paso)
```
[       ○○○○○○○○○○○  30%          ]
[                                  ]
[  ESTRATEGIA                      ]
[  ¿Cómo evalúa tu empresa         ]
[  el impacto de la IA?            ]
[                                  ]
[  1  2  ●  4  5                   ]
[  Poco preparado                  ]
[                                  ]
[  [Anterior]         [Siguiente]  ]
```

### Screen 3 — Lead Capture
```
[       ○○○○○○○○○○○  100%         ]
[                                  ]
[  ¡Casi listo!                    ]
[  Ingresá tu email para           ]
[  recibir el reporte              ]
[                                  ]
[  Email                          ]
[  ┌──────────────────────────┐    ]
[  │  tu@email.com            │    ]
[  └──────────────────────────┘    ]
[  Empresa                        ]
[  ┌──────────────────────────┐    ]
[  │  Nombre de tu empresa    │    ]
[  └──────────────────────────┘    ]
[                                  ]
[  ┌──────────────────────────┐    ]
[  │   Ver mi reporte         │    ]
[  └──────────────────────────┘    ]
```

### Screen 4 — Reporte
```
[  Score General: 72               ]
[  ╱──╲   Medium                   ]
[  ╲──╱                            ]
[                                  ]
[  Estrategia   Talento   Proc.   ]
[     82         45       68      ]
[  Tecnología   Cultura            ]
[     71         55                ]
[                                  ]
[  Recomendaciones:                ]
[  ⚡ Fortalecer capacitación...   ]
[  ⚡ Definir roadmap de IA...     ]
[  ⚡ Establecer métricas...       ]
[                                  ]
[  [Descargar PDF] [Enviar email]  ]
```
