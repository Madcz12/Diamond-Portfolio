# Portfolio — Miguel Diamond · Especificaciones de Diseño y Desarrollo

## Visión general

Portfolio personal para **Miguel Diamond**, Ingeniero en Informática. La experiencia está diseñada como un **anuncio de revelación de producto estilo TV** (referencia: lanzamientos Apple), donde el diamante negro es el protagonista visual y cada sección del sitio representa una faceta del mismo.

---

## Identidad visual

- **Nombre:** Miguel Diamond
- **Cargo:** Ingeniero en Informática
- **CTA principal:** "Creando software brillante como el diamante"
- **Paleta:** Dark luxury — negro, blanco, plata (`#000`, `#fff`, `#c0c0c0`, `#e8e8e8`)
- **Tipografía:** Helvetica Neue / Helvetica / Arial — pesos 200 (light) y 700 (bold)
- **Imagen hero:** diamante negro 3D sobre fondo oscuro (proporcionada por el cliente)

---

## Stack tecnológico

| Herramienta | Rol |
|---|---|
| React | Framework principal |
| Framer Motion | Animaciones de la sección Hero |
| React Three Fiber | Diamante 3D interactivo (opcional, para versión avanzada) |
| GSAP + ScrollTrigger | Navegación lateral tipo Prezi y transiciones entre secciones |

---

## Sección Hero — Revelación cinematográfica

La primera pantalla simula un anuncio de producto de televisión. La secuencia de animación es la siguiente:

1. Fondo oscuro con viñeta radial se ilumina suavemente
2. El diamante negro aparece escalando desde `0.4` a `1.0` con ligera rotación inicial, duración 2 s, ease `power4.out`
3. Glow ambiental alrededor del diamante hace fade in
4. Nombre **"Miguel Diamond"** emerge desde abajo, opacidad 0 → 1, duración 1 s
5. Subtítulo **"Ingeniero en Informática"** aparece con delay de 0.4 s
6. CTA **"Creando software brillante como el diamante"** + botón "Explorar facetas →" aparecen con delay adicional
7. Indicador de scroll aparece al final de la secuencia
8. El diamante entra en animación de flotación continua (yoyo, repeat infinito)

### Elementos del Hero

```
┌─────────────────────────────────────────┐
│              [diamante negro]            │
│                                         │
│          MIGUEL  DIAMOND                │
│        INGENIERO EN INFORMÁTICA         │
│                                         │
│  creando software brillante como el     │
│             diamante                    │
│         [ Explorar facetas → ]          │
│                                         │
│               ↓ Scroll                  │
└─────────────────────────────────────────┘
```

---

## Navegación — Scroll horizontal tipo Prezi

El usuario navega **lateralmente** entre secciones. Cada sección representa una faceta del diamante.

### Métodos de navegación soportados

- **Scroll** (wheel vertical o horizontal) — umbral de 30px para disparar cambio de panel
- **Teclado** — teclas `←` `→` `↑` `↓`
- **Touch / swipe** — umbral de 50px en eje X o Y
- **Botones de flecha** — UI fija en esquina inferior derecha
- **Indicador lateral de facetas** — puntos clickeables en lado derecho
- **Navbar superior** — links directos a cada sección (visible desde panel 1 en adelante)

### Transición entre paneles

- Propiedad animada: `translateX` del contenedor principal
- Duración: `1.2 s`
- Ease: `power3.inOut`
- Bloqueo durante animación: sí (`isAnimating` flag)
- Cooldown en wheel: `800 ms`

---

## Estructura de secciones (facetas)

### Panel 0 — Hero
Ver descripción completa arriba.

---

### Panel 1 — Sobre mí

**Label:** `01 · Sobre mí`  
**Título:** "Ingeniería con precisión de diamante"

Contenido en grid de dos columnas:

**Columna izquierda — Biografía**
- Texto en prosa, color `#666`, line-height `1.9`
- Menciona el apellido Diamond como metáfora de la filosofía de trabajo

**Columna derecha — Estadísticas**
- 5+ años de experiencia
- 20+ proyectos entregados
- ∞ líneas de código
- Diseño: número grande (peso 200) + label pequeño en versalitas

**Timeline de experiencia** (debajo del grid, 3 ítems):
- Año + Empresa + Cargo + Descripción breve
- Separador de 1 columna de 120px para el año

---

### Panel 2 — Tecnologías

**Label:** `02 · Tecnologías`  
**Título:** "Stack afilado al extremo"

Grid de 3 columnas, separadas por líneas de 1px en `#111`:

| Frontend | Backend | DevOps / Cloud |
|---|---|---|
| React / Next.js | Node.js | Docker / K8s |
| TypeScript | Python / FastAPI | AWS |
| Tailwind CSS | PostgreSQL | CI/CD |
| Framer Motion | MongoDB | Terraform |
| Vue.js | Redis | Linux |

Cada tecnología incluye una barra de nivel visual (1px de alto, color `#2a2a2a` sobre fondo `#111`).

---

### Panel 3 — Proyectos

**Label:** `03 · Proyectos`  
**Título:** "Obras talladas con código"

Grid de 2×2 tarjetas, separadas por líneas de 1px en `#111`:

| Proyecto | Tipo | Stack |
|---|---|---|
| Plataforma de Analytics en Tiempo Real | SaaS · Full Stack | Next.js, Python, PostgreSQL, Redis |
| App de Gestión Financiera Personal | Mobile · API | React Native, Node.js, OpenAI |
| Sistema de Inventario Distribuido | E-commerce · Microservices | Docker, Kafka, MongoDB, AWS |
| CLI de Automatización de Deployments | DevTool · CLI | Python, Terraform, GitHub Actions |

Cada tarjeta incluye: tag de categoría, título, descripción breve, stack como pills con borde.

---

### Panel 4 — Contacto

**Label:** `04 · Contacto`  
**Título:** "Construyamos algo brillante juntos."

Layout de dos columnas:

**Columna izquierda**
- Título en peso 200
- Indicador de disponibilidad animado (dot verde pulsante)

**Columna derecha — Links**
- Email: `miguel@diamond.dev`
- LinkedIn: `linkedin.com/in/migueldiamonddev`
- GitHub: `github.com/migueldiamonddev`
- Descarga de CV

**Footer interno:**
- Izquierda: "Miguel Diamond · Ingeniero en Informática"
- Derecha: "Software brillante como el diamante ◆"

---

## Componentes de UI globales

### Cursor personalizado
- Punto sólido de 8px, centrado, blanco
- Anillo exterior de 32px, borde 1px semitransparente
- El anillo sigue al cursor con lerp (`factor 0.12`) para efecto lag suave

### Navbar superior
- Invisible en el Hero, aparece con fade desde panel 1
- Logo "M · Diamond" (vuelve al Hero al hacer click)
- Links: Sobre mí / Tecnologías / Proyectos / Contacto
- Item activo con indicador subrayado animado

### Indicador lateral de facetas
- 5 dots verticales en lado derecho
- Dot activo se expande a rectángulo vertical (3×20px)
- Tooltip con nombre de sección al hover
- Invisible en Hero, visible desde panel 1

### Barra de progreso
- Línea horizontal de 1px en borde inferior
- Ancho = `(panelActual / (total - 1)) * 100%`
- Color: `rgba(255,255,255,0.15)`

### Fondo geométrico por sección
- SVG inline con wireframe de polígono tipo diamante
- Opacidad `3%`, `stroke="white"`, `stroke-width` entre 0.2 y 0.5
- Variación de forma en cada sección para distinguir la "faceta"

---

## Animaciones de entrada por sección

Al llegar a cada panel, los elementos con clase `.reveal-up` se animan:

```
opacity: 0 → 1
translateY: 40px → 0
duration: 0.8 s
stagger: 0.12 s entre elementos
ease: power2.out
```

---

## Consideraciones para la versión React con R3F

Para una versión más avanzada con React Three Fiber, el diamante del Hero puede reemplazarse por una geometría 3D interactiva:

- Usar `IcosahedronGeometry` o `OctahedronGeometry` con múltiples subdivisiones
- Material: `MeshPhysicalMaterial` con `roughness: 0`, `transmission: 0.9`, `ior: 2.4` (índice de refracción del diamante)
- Luz puntual blanca para simular el destello de la imagen original
- Al hacer scroll entre paneles, rotar el diamante 3D hacia la faceta correspondiente
- Implementar `useSpring` de `react-spring` o `useFrame` para interpolación suave

---

## Entregables y despliegue

- **Framework:** Create React App o Vite + React
- **Deploy recomendado:** Vercel (zero-config con React)
- **Estructura de archivos sugerida:**

```
src/
├── components/
│   ├── Hero/
│   ├── sections/
│   │   ├── About.jsx
│   │   ├── Tech.jsx
│   │   ├── Projects.jsx
│   │   └── Contact.jsx
│   ├── ui/
│   │   ├── Cursor.jsx
│   │   ├── Nav.jsx
│   │   ├── FacetIndicator.jsx
│   │   └── ProgressBar.jsx
│   └── DiamondCanvas.jsx  ← R3F (opcional)
├── hooks/
│   └── usePanelNavigation.js
├── styles/
│   └── globals.css
└── App.jsx
```

---

*Especificaciones generadas a partir del brief de Miguel Diamond — Mayo 2026*
