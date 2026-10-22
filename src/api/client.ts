import { create } from 'axios'

//Crear un cliente de axios configurado con:
//baseURL: la URL de la PI, tomada de variables de entorno de EXPO
//headers: indicar que el contenido es JSON

export const client = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {'Content-Type': 'application/json'},
})