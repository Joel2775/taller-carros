//Importamos los hooks de tanstack query:
//UseQq¿uery: para consultas get
//useMutation: para operaciones POST/PUT/DELETE
//useQueryClient: para interactuar con la cache (Invalidar, refrescar)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { carrosService } from '@/api/carros.services'
import { Carro } from '@/types/carros'

export const CARROS_QUERY_KEY = ['carros']

export function useCarros() {
    return useQuery({
        queryKey: CARROS_QUERY_KEY,
        queryFn: () => carrosService.getAll(),
        staleTime: 1000 * 60 * 5,
    })
}

export function useAgregarCarro() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (carro: Omit<Carro, 'id'>) => carrosService.add(carro),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CARROS_QUERY_KEY }),
    })
}