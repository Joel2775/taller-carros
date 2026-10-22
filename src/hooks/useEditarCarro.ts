import { useMutation, useQueryClient } from '@tanstack/react-query'
import { carrosService } from '@/api/carros.services'
import { CARROS_QUERY_KEY } from '@/hooks/useCarros'
import { Carro } from '@/types/carros'

type EditarCarroVariables = {
  id: string
  carro: Omit<Carro, 'id'>
}

export function useEditarCarro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, carro }: EditarCarroVariables) =>
      carrosService.update(id, carro),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CARROS_QUERY_KEY }),
  })
}
