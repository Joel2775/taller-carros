---
name: taller-ui
description: Define y aplica una paleta de colores profesional (#D90707 al #F2F2F2) usando StyleSheet con diseño responsivo para móviles.
---
# Taller Carros - Diseño de Interfaz con StyleSheet

## Alcance Permitido
Para mantener el orden de la aplicación, esta skill trabajará sobre la interfaz sin romper la lógica. Solo se deben modificar estilos en:
- `src/constants/theme.ts` (Para definir o actualizar las constantes de color)
- Archivos de pantallas en `src/app/` (ej. `index.tsx`, `explore.tsx`)
- Archivos de componentes en `src/components/`

## Cuándo usar
Usa esta skill cuando se te pida:
- Dar estilo, arreglar o modernizar el aspecto visual de la aplicación.
- Configurar layouts que se vean bien en horizontal y vertical.
- Crear o modificar componentes visuales (tarjetas, botones, formularios).

## 1. Uso Estricto de StyleSheet
- **Prohibido el uso de estilos en línea (inline styles)** a menos que sea estrictamente necesario para un valor dinámico.
- Todo el diseño debe estar centralizado al final de cada archivo usando `StyleSheet.create({ ... })` de `react-native`.

## 2. Paleta de Colores
Usa estrictamente estos colores dentro de tus objetos `StyleSheet`:
- **Principal (Primary):** `#D90707` (Rojo intenso). Uso: Fondos de botones principales, headers.
- **Secundario (Secondary):** `#D92929`. Uso: Estados *active* de botones y elementos de énfasis.
- **Acentos (Destructive/Highlight):** `#F25E5E`. Uso: Botones de eliminar y mensajes de error.
- **Detalles y Bordes (Muted):** `#F29191`. Uso: `borderColor` de inputs inactivos, líneas separadoras.
- **Fondos (Background):** `#F2F2F2`. Uso: `backgroundColor` principal de la vista global.
- *(Nota: Usa blanco `#FFFFFF` para el fondo de las tarjetas/inputs, y texto oscuro para buen contraste).*

## 3. Principios de Diseño Profesional
- **Tarjetas (Cards):** Los elementos de listas (carros) deben usar estilos de tarjeta. Ejemplo en `StyleSheet`: `backgroundColor: '#FFFFFF'`, `borderRadius: 12`, `padding: 16`, `marginBottom: 12`, `elevation: 2` (Android) o `shadowOpacity: 0.1` (iOS).
- **Formas y Feedback:** Aplica `borderRadius: 8` en botones e inputs. Los inputs enfocados deben cambiar su `borderColor` a `#D90707`.

## 4. Responsividad y Flexbox
- **Diseño Adaptable:** Utiliza Flexbox (`flex: 1`, `flexDirection`, `justifyContent`, `alignItems`) en lugar de dimensiones fijas (`width`/`height` quemados).
- **Orientación:** Asegúrate de que las vistas con formularios estén envueltas en un `ScrollView` y las listas en un `FlatList` para que la UI no se rompa al rotar la pantalla a horizontal.
- **Márgenes y SafeArea:** Usa márgenes relativos (`paddingHorizontal: 16` o porcentajes) y asegúrate de que el contenido no quede oculto por el notch o la barra de estado.