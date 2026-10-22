import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TallerCarrosColors } from '@/constants/theme'
import { useCarros } from '@/hooks/useCarros'

export default function Explore() {
  const { data: carros = [], isLoading, error } = useCarros()

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        style={styles.list}
        data={carros}
        keyExtractor={(carro) => carro.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Inventario de carros</Text>
            {isLoading ? <Text style={styles.status}>Cargando carros...</Text> : null}
            {error ? (
              <Text style={styles.error}>
                No se pudieron cargar los carros: {error.message}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !isLoading && !error ? (
            <Text style={styles.empty}>No hay carros registrados.</Text>
          ) : null
        }
        renderItem={({ item: carro }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {carro.marca} {carro.modelo} ({carro.anio})
            </Text>
            <Text style={styles.cardDetail}>Color: {carro.color}</Text>
            <Text style={styles.cardDetail}>Kilometraje: {carro.kilometraje}</Text>
            <Text style={styles.cardDetail}>Precio: {carro.precio}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: TallerCarrosColors.background,
  },
  list: {
    flex: 1,
    width: '100%',
    maxWidth: 840,
    alignSelf: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: TallerCarrosColors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  status: {
    color: TallerCarrosColors.textSecondary,
    marginTop: 8,
  },
  error: {
    color: TallerCarrosColors.highlight,
    marginTop: 8,
  },
  empty: {
    color: TallerCarrosColors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: TallerCarrosColors.surface,
    borderColor: TallerCarrosColors.muted,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    color: TallerCarrosColors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDetail: {
    color: TallerCarrosColors.textSecondary,
    marginTop: 3,
  },
})
