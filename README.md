# Diego Alexander Sánchez Henao — Hoja de Vida & Portafolio Interactivo

[![Sitio Web en Vivo](https://img.shields.io/badge/Sitio_Web-Cv__Diego__Sanchez-0d9488?style=for-the-badge)](https://diego-0010619.github.io/Cv_Diego_Sanchez/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Diego_S%C3%A1nchez-2563eb?style=for-the-badge)](https://www.linkedin.com/in/diego-alexander-s%C3%A1nchez-henao-2733401b5/)
[![JSON Resume](https://img.shields.io/badge/CV_Estructurado-cv--data.json-0f172a?style=for-the-badge)](./cv-data.json)

Repositorio público del portafolio y **hoja de vida web interactiva** de **Diego Alexander Sánchez Henao** — *Ingeniero de Datos, Desarrollador de Software y Candidato a Magíster en Ciencia de Datos (UPB)*, con más de 5 años de experiencia optimizando procesos de datos, auditoría interna y prevención de fraude para empresas como **Bancolombia, Nequi, Grupo Familia y GCO**.

🌐 **Acceso directo a la página web interactiva:** [https://diego-0010619.github.io/Cv_Diego_Sanchez/](https://diego-0010619.github.io/Cv_Diego_Sanchez/)

---

## Características de la Página Web Interactiva

- **Diseño editorial limpio con Modo Claro / Oscuro** y red interactiva de nodos de datos en `<canvas>`.
- **Cambio de idioma instantáneo (`ES` / `EN`)** para reclutadores locales e internacionales.
- **Paleta de comandos rápida (`Ctrl + K`)** para buscar empresas (`GCO`, `Nequi`, `Bancolombia`, `Grupo Familia`), habilidades o acciones rápidas.
- **Filtrado cruzado interactivo:** haz clic en cualquier habilidad (`Python`, `AWS Glue`, `SQL Server`, `Machine Learning`, `Dynatrace`, etc.) para filtrar automáticamente los roles donde se aplicó.
- **Arquitecturas de Impacto en Producción:** diagrama interactivo de 3 sistemas reales implementados (ML Fiscal en GCO, Prevención de Fraude 24/7 en Nequi/PersonalSoft y Facturación/Cumplimiento SFC en Grupo Familia/Bancolombia).
- **Radar SVG de Competencias** + versión lista para impresión / exportación limpia a PDF (`Imprimir / Guardar PDF`).
- **CV estructurado en JSON** disponible en [`cv-data.json`](./cv-data.json).

---

## Resumen de Perfil

- **Ubicación:** Medellín, Colombia
- **Correo:** `DiegoUsbMed@gmail.com`
- **Teléfono:** `+57 311 733 93 72`
- **LinkedIn:** [Diego Alexander Sánchez Henao](https://www.linkedin.com/in/diego-alexander-s%C3%A1nchez-henao-2733401b5/)

### Experiencia Profesional

| Empresa | Rol | Periodo | Impacto Clave |
| :--- | :--- | :--- | :--- |
| **GCO** | Ingeniero de Datos | Ago 2025 – Actual | Modelos de Machine Learning para clasificación de gastos no deducibles, optimización de ETLs masivos y alertamientos de auditoría interna. |
| **PersonalSoft** | Software Developer – Ingeniero de Datos | Feb 2023 – Jun 2025 | ETLs y automatizaciones en Python, VBA y AWS Glue (-80 % tiempo manual); dashboards y workflows en tiempo real en Dynatrace (100 % operación app Nequi); CI/CD en Azure DevOps. |
| **Igerencia** | Administrador de BD – Ingeniero de Datos | Ene 2021 – Feb 2023 | Optimización SQL para facturación diaria de Grupo Familia (miles de millones custodiados); ETLs y Power BI para cumplimiento SFC en Bancolombia. |
| **Bancolombia** | Aprendiz de Auditoría Interna | Ene 2021 – Feb 2023 | Reducción de hasta el 90 % de manualidad en procesos diarios de auditoría mediante Python y VBA. |

### Educación

- **Magíster en Ciencia de Datos** — Universidad Pontificia Bolivariana (UPB), Medellín (*Julio 2026 – Cursando*).
- **Ingeniero de Sistemas** — Universidad de San Buenaventura, Medellín (*Marzo 2021* · *Honores: Matrícula de Honor en 8.° semestre*).
- **Especialista en Administración y Seguridad de Bases de Datos** — SENA (*Agosto 2017*).
- **Tecnólogo en Análisis y Desarrollo de Sistemas de Información** — SENA (*Abril 2016*).

---

## Estructura del Repositorio

```text
Cv_Diego_Sanchez/
├── index.html      # Estructura semántica, paleta Ctrl+K y metadatos SEO/OG
├── styles.css      # Sistema visual limpio (Light/Dark + hoja de impresión PDF)
├── data.js         # Contenido bilingüe (ES/EN) de experiencia, arquitecturas y skills
├── app.js          # Motor interactivo (filtros, radar SVG, canvas, Ctrl+K, contadores)
├── cv-data.json    # Hoja de vida estructurada en formato JSON
└── README.md       # Documentación y resumen del perfil
```

## Ejecución Local

No requiere instalación de dependencias ni paso de compilación: abre directamente `index.html` en tu navegador o ejecuta:

```bash
python -m http.server 8000
```

