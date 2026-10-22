---
name: actualizaciones-optimas
description: Implementa actualizaciones optimistas al eliminar un carro usando onMutate, onError y onSettled con TanStack Query.
---
# Taller Carros - Actualizaciones Optimistas

## Alcance Estricto (Archivos Permitidos)
Para evitar alterar el código funcional, esta skill **solo** tiene permitido modificar los siguientes archivos. **NO** debes tocar ninguna otra carpeta o archivo fuera de esta lista:
- `src/hooks/useEliminarCarro.ts` (Implementación principal de la mutación)
- `src/hooks/useCarros.ts` (Referencia a la query key si es necesario)
- `src/app/index.tsx` (Para manejar o mostrar la alerta de error si falla la eliminación)
- `src/app/explore.tsx` (Si requiere ajustes menores para leer la caché)

## Cuándo usar
Usa esta skill cuando se te pida:
- Implementar "actualizaciones optimistas" (optimistic updates) en la aplicación.
- Modificar el comportamiento de eliminación para que sea inmediato en la interfaz.

## Reglas de Implementación (Eliminar Carro)

Debes modificar la mutación en `useEliminarCarro` para incluir el siguiente flujo de TanStack Query:

1. **`onMutate` (El efecto inmediato):**
   - Cancela cualquier refetch saliente para la query de la lista de carros (`queryClient.cancelQueries`).
   - Captura el estado actual de la caché (`queryClient.getQueryData`).
   - Modifica la caché optimísticamente (`queryClient.setQueryData`) filtrando y quitando de la lista el carro que se va a eliminar, para que desaparezca de inmediato en la UI.
   - Retorna un contexto que contenga los datos previos (`{ previousCarros }`).

2. **`onError` (El rollback):**
   - Si la petición al servidor falla, utiliza el contexto retornado por `onMutate` para restaurar la caché a su estado anterior (`queryClient.setQueryData`).
   - Muestra una alerta o mensaje de error al usuario indicando que la eliminación falló.

3. **`onSettled` (La sincronización):**
   - Independientemente de si la petición tuvo éxito o falló, invalida la query de la lista de carros (`queryClient.invalidateQueries`).
   - Esto asegura que la aplicación siempre termine sincronizada con la fuente de verdad (el servidor).