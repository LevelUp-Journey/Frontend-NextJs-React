# Design Rules - LevelUp Journey Frontend

Este documento establece las reglas de diseño y patrones de UI que deben seguirse consistentemente en toda la aplicación LevelUp Journey.

## 1. Layout y Estructuras Generales

### 1.1 Páginas de Formularios Centradas
```tsx
// Estructura base para páginas con formularios principales
<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div className="w-full max-w-{size}">
    {/* Contenido */}
  </div>
</div>
```

**Reglas:**
- Usar `min-h-svh` para altura completa del viewport
- Centrar contenido vertical y horizontalmente con flexbox
- Padding responsivo: `p-6 md:p-10`
- Ancho máximo definido según el tipo de formulario:
  - Formularios de auth: `max-w-sm` (384px)
  - Formularios de creación: `max-w-lg` (512px)

### 1.2 Estructura de Formularios
```tsx
<div className="flex flex-col gap-6">
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col gap-6">
      <div className="grid gap-6">
        {/* Campos del formulario */}
      </div>
      <Button type="submit" className="w-full">
        {/* Texto del botón */}
      </Button>
    </div>
  </form>
  {/* Texto de ayuda opcional */}
</div>
```

**Reglas:**
- Gap consistente de `gap-6` entre secciones principales
- Botones de submit siempre de ancho completo (`w-full`)
- Agrupar campos relacionados en `div` con `grid gap-6`

## 2. Headers y Títulos

### 2.1 Headers de Página
```tsx
<div className="flex flex-col items-center gap-3 text-center">
  <h1 className="text-2xl font-semibold tracking-tight">
    Título Principal
  </h1>
  <p className="text-muted-foreground text-sm text-balance">
    Descripción explicativa del propósito de la página.
  </p>
</div>
```

**Reglas:**
- Títulos principales: `text-2xl font-semibold tracking-tight`
- Descripciones: `text-muted-foreground text-sm text-balance`
- Centrar texto y elementos: `items-center text-center`
- Gap de `gap-3` entre título y descripción

### 2.2 Jerarquía Tipográfica
- **H1 (Títulos de página):** `text-2xl font-semibold tracking-tight`
- **Labels de formulario:** Sin clases adicionales (usar componente `Label`)
- **Texto de ayuda:** `text-muted-foreground text-center text-xs text-balance`
- **Mensajes de error:** `text-sm text-red-500`

## 3. Campos de Formulario

### 3.1 Estructura de Campo
```tsx
<div className="grid gap-3">
  <Label htmlFor="field-id">
    Etiqueta del Campo
  </Label>
  <Input
    id="field-id"
    type="text"
    placeholder="Placeholder descriptivo"
    {...register("fieldName")}
    className={errors.fieldName ? "border-red-500" : ""}
  />
  {errors.fieldName && (
    <p className="text-sm text-red-500">
      {errors.fieldName.message}
    </p>
  )}
</div>
```

**Reglas:**
- Gap consistente de `gap-3` entre label, input y error
- IDs descriptivos para accesibilidad
- Estados de error con borde rojo: `border-red-500`
- Mensajes de error debajo del campo con `text-sm text-red-500`

### 3.2 Placeholders
**Input de texto:**
- Ser descriptivos y específicos
- Indicar formato esperado cuando sea relevante
- Ejemplo: "Ingresa el título del challenge" vs "Título"

**Textarea:**
- Incluir guía de contenido esperado
- Ejemplo: "Describe el challenge en detalle. Incluye los objetivos de aprendizaje..."

### 3.3 Validación de Campos
- **Títulos:** 1-100 caracteres
- **Descripciones:** 1-1000 caracteres
- **Emails:** Formato de email válido
- **Usernames:** 3-20 caracteres, solo letras, números y guiones bajos

## 4. Botones

### 4.1 Botones Primarios
```tsx
<Button
  type="submit"
  className="w-full"
  disabled={isLoading || isSubmitting}
>
  {isLoading ? "Estado de carga..." : "Acción principal"}
</Button>
```

**Reglas:**
- Botones principales siempre de ancho completo en formularios
- Estados de carga descriptivos: "Creando challenge...", "Iniciando sesión..."
- Deshabilitar durante carga o envío

### 4.2 Variantes de Botones
- **Default:** Acciones principales (enviar formularios)
- **Outline:** Acciones secundarias (OAuth, cancelar)
- **Ghost:** Acciones terciarias (editar, cambiar)

## 5. Estados de Interacción

### 5.1 Estados de Carga
- Cambiar texto del botón para indicar progreso
- Deshabilitar controles durante operaciones asíncronas
- Mantener contexto: "Creando..." en lugar de solo "Cargando..."

### 5.2 Estados de Error
- Bordes rojos en campos con errores
- Mensajes de error específicos y en español
- Posición de errores: debajo del campo correspondiente

## 6. Espaciado y Layout

### 6.1 Sistema de Gap
- **gap-6:** Entre secciones principales de formularios
- **gap-3:** Entre elementos de un campo (label, input, error)
- **gap-2:** Entre elementos muy relacionados (como enlaces)

### 6.2 Responsividad
- Padding base: `p-6`
- Padding en desktop: `md:p-10`
- Ancho máximo apropiado para el contenido
- Usar `text-balance` para texto descriptivo

## 7. Colores y Temas

### 7.1 Colores Semánticos
- **Errores:** `text-red-500`, `border-red-500`
- **Texto secundario:** `text-muted-foreground`
- **Backgrounds:** `bg-background` para páginas principales

### 7.2 Consistencia de Tema
- Usar variables CSS para colores
- Soportar modo claro y oscuro automáticamente
- No hardcodear valores de color

## 8. Accesibilidad

### 8.1 Etiquetas y IDs
- Siempre usar `htmlFor` en labels
- IDs descriptivos en inputs
- Mantener relación label-input clara

### 8.2 Estados Focales
- Los componentes shadcn manejan automáticamente los estados de foco
- No sobrescribir estilos de foco a menos que sea necesario

## 9. Texto de Ayuda y Contexto

### 9.1 Texto de Ayuda
```tsx
<div className="text-muted-foreground text-center text-xs text-balance">
  Información adicional o contexto sobre la acción.
</div>
```

**Reglas:**
- Colocar al final de formularios
- Usar para explicar qué sucede después del envío
- Mantener tono informativo y útil

## 10. Ejemplos de Aplicación

### ✅ Correcto
```tsx
// Header descriptivo y centrado
<div className="flex flex-col items-center gap-3 text-center">
  <h1 className="text-2xl font-semibold tracking-tight">
    Crear nuevo challenge
  </h1>
  <p className="text-muted-foreground text-sm text-balance">
    Completa los campos para crear un nuevo challenge de programación.
  </p>
</div>
```

### ❌ Incorrecto
```tsx
// Header sin estructura consistente
<h1>Nuevo Challenge</h1>
<p>Crear challenge</p>
```

### ✅ Correcto
```tsx
// Campo con estructura completa
<div className="grid gap-3">
  <Label htmlFor="title">Título del challenge</Label>
  <Input
    id="title"
    placeholder="Ingresa el título del challenge"
    {...register("title")}
    className={errors.title ? "border-red-500" : ""}
  />
  {errors.title && (
    <p className="text-sm text-red-500">
      {errors.title.message}
    </p>
  )}
</div>
```

### ❌ Incorrecto
```tsx
// Campo sin manejo de errores o estructura
<Label>Título</Label>
<Input placeholder="Título" {...register("title")} />
```

---

## Notas Importantes

1. **Consistencia:** Seguir estos patrones en todas las páginas nuevas
2. **Shadcn UI:** Usar componentes shadcn sin modificaciones extensas
3. **Responsive:** Todos los diseños deben funcionar en mobile y desktop
4. **Accesibilidad:** Mantener siempre las mejores prácticas de a11y
5. **Español:** Todos los textos de usuario en español, código en inglés
