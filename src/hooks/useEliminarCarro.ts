import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { carrosService } from '@/api/carros.services'
import { CARROS_QUERY_KEY } from '@/hooks/useCarros'
import { Carro } from '@/types/carros'

export function useEliminarCarro() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (id: string) => carrosService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CARROS_QUERY_KEY })

      const previousCarros = queryClient.getQueryData<Carro[]>(CARROS_QUERY_KEY)
      if (previousCarros) {
        queryClient.setQueryData<Carro[]>(
          CARROS_QUERY_KEY,
          previousCarros.filter((carro) => carro.id !== id),
        )
      }

      return { previousCarros }
    },
    onSuccess: () => {
      Alert.alert('Éxito', 'El carro se eliminó correctamente.')
    },
    onError: (_error, _id, context) => {
      if (context?.previousCarros) {
        queryClient.setQueryData(CARROS_QUERY_KEY, context.previousCarros)
      }
      Alert.alert('Error', 'No se pudo eliminar el carro.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CARROS_QUERY_KEY }),
  })

  const confirmarEliminacion = (id: string, nombre: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Deseas eliminar ${nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => mutation.mutate(id),
        },
      ],
    )
  }

  return {
    confirmarEliminacion,
    isPending: mutation.isPending,
  }
}
