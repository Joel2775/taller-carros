import { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm } from '@tanstack/react-form'
import { TallerCarrosColors } from '@/constants/theme'
import { useAgregarCarro, useCarros } from '@/hooks/useCarros'
import { useEditarCarro } from '@/hooks/useEditarCarro'
import { useEliminarCarro } from '@/hooks/useEliminarCarro'
import { Carro } from '@/types/carros'

type CarroFormValues = Omit<Carro, 'id'>

const CARRO_VACIO: CarroFormValues = {
  marca: '',
  modelo: '',
  anio: '',
  color: '',
  kilometraje: '',
  precio: '',
}

function validarObligatorio(valor: string, campo: string) {
  return valor.trim() ? undefined : `${campo} es obligatorio.`
}

function validarAnio(valor: string) {
  const obligatorio = validarObligatorio(valor, 'El año')
  if (obligatorio) return obligatorio

  const anio = Number(valor)
  if (!Number.isInteger(anio) || anio < 1900 || anio > new Date().getFullYear()) {
    return `Ingresa un año entre 1900 y ${new Date().getFullYear()}.`
  }
}

function validarNumeroPositivo(valor: string, campo: string) {
  const obligatorio = validarObligatorio(valor, campo)
  if (obligatorio) return obligatorio

  if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
    return `${campo} debe ser un número mayor que 0.`
  }
}

export default function App() {
  const [carroEnEdicion, setCarroEnEdicion] = useState<Carro | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { data: carros = [], isLoading, error } = useCarros()
  const { mutateAsync: agregarCarro, isPending: agregando } = useAgregarCarro()
  const { mutateAsync: editarCarro, isPending: editando } = useEditarCarro()
  const { confirmarEliminacion, isPending: eliminando } = useEliminarCarro()
  const guardando = agregando || editando

  const form = useForm({
    defaultValues: CARRO_VACIO,
    onSubmit: async ({ value }) => {
      const carro: CarroFormValues = {
        marca: value.marca.trim(),
        modelo: value.modelo.trim(),
        anio: value.anio.trim(),
        color: value.color.trim(),
        kilometraje: value.kilometraje.trim(),
        precio: value.precio.trim(),
      }

      try {
        if (carroEnEdicion) {
          await editarCarro({ id: carroEnEdicion.id, carro })
        } else {
          await agregarCarro(carro)
        }

        form.reset()
        setCarroEnEdicion(null)
        Alert.alert(
          'Éxito',
          carroEnEdicion
            ? 'El carro se actualizó correctamente.'
            : 'El carro se agregó correctamente.',
        )
      } catch (submitError) {
        const detalle =
          submitError instanceof Error
            ? submitError.message
            : 'Ocurrió un error inesperado.'
        Alert.alert('Error', `No se pudo guardar el carro. ${detalle}`)
      }
    },
  })

  const iniciarEdicion = (carro: Carro) => {
    setCarroEnEdicion(carro)
    form.setFieldValue('marca', carro.marca)
    form.setFieldValue('modelo', carro.modelo)
    form.setFieldValue('anio', carro.anio)
    form.setFieldValue('color', carro.color)
    form.setFieldValue('kilometraje', carro.kilometraje)
    form.setFieldValue('precio', carro.precio)
  }

  const cancelarEdicion = () => {
    form.reset()
    setCarroEnEdicion(null)
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        style={styles.list}
        data={carros}
        keyExtractor={(carro) => carro.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.formCard}>
              <Text style={styles.title}>
                {carroEnEdicion ? 'Editar carro' : 'Agregar carro'}
              </Text>

              <form.Field
                name="marca"
                validators={{
                  onMount: ({ value }) => validarObligatorio(value, 'La marca'),
                  onChange: ({ value }) => validarObligatorio(value, 'La marca'),
                }}
              >
                {(field) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Marca</Text>
                    <TextInput
                      accessibilityLabel="Marca"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder="Ej. Toyota"
                      onFocus={() => setFocusedField('marca')}
                      onBlur={() => setFocusedField(null)}
                      style={[styles.input, focusedField === 'marca' && styles.inputFocused]}
                    />
                    {field.state.meta.errors.map((mensaje, index) => (
                      <Text key={index} style={styles.error}>{mensaje}</Text>
                    ))}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="modelo"
                validators={{
                  onMount: ({ value }) => validarObligatorio(value, 'El modelo'),
                  onChange: ({ value }) => validarObligatorio(value, 'El modelo'),
                }}
              >
                {(field) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Modelo</Text>
                    <TextInput
                      accessibilityLabel="Modelo"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder="Ej. Corolla"
                      onFocus={() => setFocusedField('modelo')}
                      onBlur={() => setFocusedField(null)}
                      style={[styles.input, focusedField === 'modelo' && styles.inputFocused]}
                    />
                    {field.state.meta.errors.map((mensaje, index) => (
                      <Text key={index} style={styles.error}>{mensaje}</Text>
                    ))}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="anio"
                validators={{
                  onMount: ({ value }) => validarAnio(value),
                  onChange: ({ value }) => validarAnio(value),
                }}
              >
                {(field) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Año</Text>
                    <TextInput
                      accessibilityLabel="Año"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      keyboardType="number-pad"
                      placeholder="Ej. 2022"
                      onFocus={() => setFocusedField('anio')}
                      onBlur={() => setFocusedField(null)}
                      style={[styles.input, focusedField === 'anio' && styles.inputFocused]}
                    />
                    {field.state.meta.errors.map((mensaje, index) => (
                      <Text key={index} style={styles.error}>{mensaje}</Text>
                    ))}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="color"
                validators={{
                  onMount: ({ value }) => validarObligatorio(value, 'El color'),
                  onChange: ({ value }) => validarObligatorio(value, 'El color'),
                }}
              >
                {(field) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Color</Text>
                    <TextInput
                      accessibilityLabel="Color"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder="Ej. Blanco"
                      onFocus={() => setFocusedField('color')}
                      onBlur={() => setFocusedField(null)}
                      style={[styles.input, focusedField === 'color' && styles.inputFocused]}
                    />
                    {field.state.meta.errors.map((mensaje, index) => (
                      <Text key={index} style={styles.error}>{mensaje}</Text>
                    ))}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="kilometraje"
                validators={{
                  onMount: ({ value }) => validarNumeroPositivo(value, 'El kilometraje'),
                  onChange: ({ value }) => validarNumeroPositivo(value, 'El kilometraje'),
                }}
              >
                {(field) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Kilometraje</Text>
                    <TextInput
                      accessibilityLabel="Kilometraje"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      keyboardType="number-pad"
                      placeholder="Ej. 45000"
                      onFocus={() => setFocusedField('kilometraje')}
                      onBlur={() => setFocusedField(null)}
                      style={[
                        styles.input,
                        focusedField === 'kilometraje' && styles.inputFocused,
                      ]}
                    />
                    {field.state.meta.errors.map((mensaje, index) => (
                      <Text key={index} style={styles.error}>{mensaje}</Text>
                    ))}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="precio"
                validators={{
                  onMount: ({ value }) => validarNumeroPositivo(value, 'El precio'),
                  onChange: ({ value }) => validarNumeroPositivo(value, 'El precio'),
                }}
              >
                {(field) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Precio</Text>
                    <TextInput
                      accessibilityLabel="Precio"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      keyboardType="decimal-pad"
                      placeholder="Ej. 12500"
                      onFocus={() => setFocusedField('precio')}
                      onBlur={() => setFocusedField(null)}
                      style={[styles.input, focusedField === 'precio' && styles.inputFocused]}
                    />
                    {field.state.meta.errors.map((mensaje, index) => (
                      <Text key={index} style={styles.error}>{mensaje}</Text>
                    ))}
                  </View>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.canSubmit}>
                {(canSubmit) => (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => form.handleSubmit()}
                      disabled={!canSubmit || guardando}
                      style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                        (!canSubmit || guardando) && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.buttonText}>
                        {guardando
                          ? 'Guardando...'
                          : carroEnEdicion
                            ? 'Guardar cambios'
                            : 'Guardar'}
                      </Text>
                    </Pressable>
                  )}
              </form.Subscribe>
              {carroEnEdicion ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={cancelarEdicion}
                    disabled={guardando}
                    style={({ pressed }) => [
                      styles.button,
                      styles.buttonSecondary,
                      styles.cancelButton,
                      pressed && styles.buttonPressed,
                      guardando && styles.buttonDisabled,
                    ]}
                  >
                    <Text style={styles.buttonText}>Cancelar edición</Text>
                  </Pressable>
              ) : null}
            </View>
            <Text style={styles.sectionTitle}>Carros registrados</Text>
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
            <View style={styles.actions}>
              <Pressable
                  accessibilityRole="button"
                  onPress={() => iniciarEdicion(carro)}
                  disabled={guardando || eliminando}
                  style={({ pressed }) => [
                    styles.button,
                    styles.buttonSecondary,
                    pressed && styles.buttonPressed,
                    (guardando || eliminando) && styles.buttonDisabled,
                  ]}
              >
                  <Text style={styles.buttonText}>Editar</Text>
              </Pressable>
              <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    confirmarEliminacion(carro.id, `${carro.marca} ${carro.modelo}`)
                  }
                  disabled={guardando || eliminando}
                  style={({ pressed }) => [
                    styles.button,
                    styles.buttonDestructive,
                    pressed && styles.buttonPressed,
                    (guardando || eliminando) && styles.buttonDisabled,
                  ]}
              >
                  <Text style={styles.buttonText}>
                    {eliminando ? 'Eliminando...' : 'Eliminar'}
                  </Text>
              </Pressable>
            </View>
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
  formCard: {
    backgroundColor: TallerCarrosColors.surface,
    borderColor: TallerCarrosColors.muted,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    padding: 16,
  },
  title: {
    color: TallerCarrosColors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitle: {
    color: TallerCarrosColors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: TallerCarrosColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: TallerCarrosColors.surface,
    borderColor: TallerCarrosColors.muted,
    borderRadius: 8,
    borderWidth: 1,
    color: TallerCarrosColors.text,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputFocused: {
    borderColor: TallerCarrosColors.primary,
  },
  error: {
    color: TallerCarrosColors.highlight,
    marginTop: 4,
  },
  status: {
    color: TallerCarrosColors.textSecondary,
    marginVertical: 8,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: TallerCarrosColors.primary,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: TallerCarrosColors.secondary,
  },
  buttonDestructive: {
    backgroundColor: TallerCarrosColors.highlight,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    marginTop: 8,
  },
  buttonText: {
    color: TallerCarrosColors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
})
