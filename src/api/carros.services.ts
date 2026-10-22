//Importar el cliente axios y el tipo carro
import { client } from './client'
import { Carro } from '../types/carros'

//Definir un servicio llamado carrosService
//El servicio centraliza las operaciones de l
//Retorna una promesa con un arreglo de objet
//Poner metodos asincronicos para interactura

export const carrosService = {
    //Metodo Get
    getAll: async (): Promise<Carro[]> => {
        const { data } = await client.get<Carro[]>('patio')
        return data
    },

    add: async (carro: Omit<Carro, 'id'>): Promise<Carro> => {
        const { data } = await client.post<Carro>('patio', carro)
        return data
    },

    update: async (id: string, carro: Omit<Carro, 'id'>): Promise<Carro> => {
        const { data } = await client.put<Carro>(`patio/${id}`, carro)
        return data
    },

    delete: async (id: string) => {
        const response = await client.delete(`patio/${id}`);
        return response.data;
    },
}