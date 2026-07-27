# Design Brief: Egg AI Readiness Diagnostic

Basado en los tokens reales de egg.live (extraídos del CSS de producción).

## Brand Identity

Egg es una marca clara, cálida y profesional. Su personalidad combina:
- **Cálidez**: beige background, coral accent (#ff647c), gradientes suaves
- **Precisión**: Space Grotesk para datos, Plus Jakarta Sans para texto
- **Confianza**: near-black (#1b1b1b) para texto, estructura limpia

## Paleta Exacta (de Egg)

| Token | Hex | Uso en el diagnóstico |
|-------|-----|---------------------|
| `--color-bg` | `#f7f5f2` | Fondo general (beige cálido) |
| `--color-bg-panel` | `#ece7e6` | Cards, inputs, elevaciones |
| `--color-black-base` | `#1b1b1b` | Headlines, texto principal |
| `--color-beige-04` | `#8d877c` | Texto secundario, labels |
| `--color-rose` | `#ff647c` | CTAs, acentos, hover |
| `--color-grey-01` | `#d2d2d2` | Bordes, separadores |
| `--color-grey-03` | `#353434` | Hover surfaces |
| `--color-white` | `#ffffff` | Cards sobre fondo beige |
| `--color-yellow` | `#ffcd00` | Badges, scores altos |
| `--gradient-accent` | `linear-gradient(6deg, #1b1b1b 14%, #ff647c 50%, #ffcd00 87%)` | Gradiente signature de Egg |

## Tipografía

| Uso | Font | Size | Weight |
|-----|------|------|--------|
| H1 diagnóstico | Plus Jakarta Sans | 50px | 600 |
| H2 secciones | Plus Jakarta Sans | 24px | 600 |
| Body | Plus Jakarta Sans | 17px | 400 |
| Labels/Botones | Space Grotesk | 14px | 500, tracking 0.07em |
| Scores grandes | Space Grotesk | 50px | 300 |
| Tags/Badges | Space Grotesk | 12px | 600, tracking 0.1em |

## Spacing (de Egg)

- Container: 1240px max-width
- Section padding: 110px top/bottom, 100px sides (desktop)
- Card radius: 30px (cards), 16px (cards small), 999px (pills)
- Espaciado base: 4px grid

## Screens a diseñar (misma estructura)

1. **Intro** — Hero cálido con gradiente signature, CTA coral, badge yellow
2. **Quiz step** — Progreso, pregunta, Likert pills, navegación
3. **Lead capture** — Formulario limpio, CTA coral
4. **Report** — Score con Space Grotesk, barras por dimensión, recs

## Anti-patterns de Egg (de impeccable + taste)

- Sin em dashes (usar -)
- Sin side-stripe borders
- Sin gradient text decorativo (usar sólido)
- Una pregunta por pantalla (densidad visual baja)
- Coral como único CTA (consistencia)
