//tab desde espo-router, define la navegacionde tipo stack
//importamnos queryClient y QueryClientProvider desde tanstack
//estos se usan para configurar y proveeder el cliente de queries en todas las app
import {Tabs} from 'expo-router'
import{QueryClient, QueryClientProvider} from '@tanstack/react-query'

//creamos una instalacia de QueryClient
//este objeto administra la cache y el ciclo de vida de las querys/mutations
const qc = new QueryClient()

//componenet layour, para envolver la navegacion dentro del QueryClientProvider
//con estio, tosos los componentes hijos pueden usar useQuery y useMutation
//este es el punto de integracion entre tanstack query y la navegacion de expo

export default function Layaout(){
  return (
    <QueryClientProvider client={qc}>
      <Tabs>
        <Tabs.Screen name= 'index' options= {{title: 'Home'}} />
        <Tabs.Screen name= 'explore' options= {{title: 'Explore'}} />
      </Tabs>

    </QueryClientProvider>
  )
}