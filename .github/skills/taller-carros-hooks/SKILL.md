---
name: taller-carros-hooks
description: Crea hooks de mutación (useEliminarCarro, useEditarCarro) con TanStack Query y formularios validados con TanStack Form para la app taller-carros.
---
# Taller Carros - Hooks y Formularios

## Alcance Estricto (Archivos Permitidos)
Esta skill **solo** tiene permitido modificar y trabajar en los siguientes archivos y carpetas. **NO** debes tocar ni modificar ninguna otra carpeta o archivo fuera de esta lista:
- `src/api/carros.services.ts`
- `src/api/client.ts`
- `src/hooks/` (toda la carpeta de hooks)
- `src/app/_layout.tsx`
- `src/app/explore.tsx`
- `src/app/index.tsx`

## Cuándo usar
Usa esta skill cuando debas:
- Crear o modificar hooks para eliminar o editar carros (`useEliminarCarro`, `useEditarCarro`).
- Configurar estados de carga y notificaciones en mutaciones.
- Actualizar la caché de consultas sin recargar pantallas.
- Crear o actualizar el formulario de agregar/editar con TanStack Form.

## 1. Operaciones de Mutación (TanStack Query)
- **Hooks dedicados:** Crea un hook separado para cada operación.
- **useEliminarCarro:** Implementa una alerta de confirmación antes de ejecutar la mutación. Usa el método `DELETE`.
- **useEditarCarro:** Abre un formulario con los datos iniciales pre-cargados. Usa `PUT` o `PATCH`.
- **Feedback visual:** Exporta y expón `isPending` para mostrar carga en los botones, y maneja mensajes de éxito o error.
- **Actualización de caché:** En el `onSuccess` de la mutación, usa `queryClient.invalidateQueries({ queryKey: ['carros'] })` o `setQueryData` para refrescar la lista de la vista `Explore` silenciosamente.

## 2. Obtención de Datos (getAll)
- Asegúrate de que `carrosService.getAll` devuelva la interfaz `Carro` completa con todos sus atributos: `id`, `marca`, `modelo`, `anio`, `color`, `kilometraje` y `precio`.

## 3. Formularios (TanStack Form)
- Integra TanStack Form (`useForm` de `@tanstack/react-form`) en los componentes de creación y edición.
- **Validaciones estrictas:**
  - Todos los campos son obligatorios.
  - `anio`: Debe estar en un rango válido (por ejemplo, entre 1900 y el año actual).
  - `precio` y `kilometraje`: Deben ser números mayores que 0.
- **Experiencia de usuario (UX):**
  - Muestra mensajes de error de validación explícitos debajo de cada input.
  - El botón "Guardar" debe estar deshabilitado mientras el formulario tenga errores (`!form.state.canSubmit`) o la mutación esté en curso (`isPending`).