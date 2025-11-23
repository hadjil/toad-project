# Flujos de Trabajo de Gestión de Calidad (QM)

Este documento describe los flujos de trabajo completos de gestión de calidad en el sistema Toad (clon de SAP). Estos flujos están diseñados para estudiantes de ingeniería industrial y técnicos de calidad.

## 1. Flujo: Compras → Inspección de Calidad

### Objetivo
Gestionar la calidad de materiales recibidos de proveedores mediante inspección de recepción.

### Pasos del Proceso

1. **Crear Orden de Compra (ME21N)**
   - Material: RM-100 (Acero Inoxidable 316L)
   - Cantidad: 500 KG
   - Proveedor: VEND-001

2. **Recepción de Mercancías (MIGO)**
   - Registrar entrada de mercancías contra la OC
   - El sistema crea automáticamente un lote de inspección

3. **Crear/Visualizar Lote de Inspección (QA01/QA03)**
   - Lote: 10000001
   - Tipo de inspección: 01 (Recepción de mercancías)
   - Plan de inspección: MAT001-1

4. **Registrar Resultados de Inspección (QE01/QE51N)**
   - Característica: THICKNESS (Espesor)
     - Valor objetivo: 3.0 mm
     - Límites: 2.9 - 3.1 mm
     - Valor real: 3.02 mm → OK
   - Característica: HARDNESS (Dureza)
     - Valor objetivo: 85 HRC
     - Límites: 80 - 90 HRC
     - Valor real: 84 HRC → OK

5. **Tomar Decisión de Empleo (QA11)**
   - Si todos los resultados son OK → Aceptar (A)
   - Si hay defectos → Rechazar (R) o Muestra (S)

6. **Resultado**
   - Material aceptado → Disponible para producción
   - Material rechazado → Crear aviso de calidad (QM01) para proveedor

---

## 2. Flujo: Producción → Inspección de Calidad

### Objetivo
Asegurar la calidad de productos fabricados mediante inspección en proceso y final.

### Pasos del Proceso

1. **Crear Orden de Producción (CO01)**
   - Material: FG-200 (Bomba Centrífuga P-100)
   - Cantidad: 10 unidades
   - Orden: 1000000001

2. **Confirmar Operaciones de Producción (CO15)**
   - Op 0010: Ensamble de Impulsor
   - Op 0020: Montaje de Carcasa
   - Op 0030: Instalación de Sellos

3. **Inspección en Proceso (QA01)**
   - Crear lote de inspección tipo 02 (En proceso)
   - Inspeccionar características críticas durante fabricación

4. **Inspección Final (QA01)**
   - Crear lote de inspección tipo 03 (Final)
   - Lote: 10000002
   - Plan: FG001-1

5. **Pruebas Funcionales (QE51N)**
   - FLOW_RATE: 102 L/min (objetivo 100 ±5) → OK
   - PRESSURE: 50.5 bar (objetivo 50 ±2) → OK
   - VIBRATION: 2.1 mm/s (máx 3.5) → OK
   - NOISE: 68 dB (máx 75) → OK

6. **Decisión de Empleo (QA11)**
   - Aceptar producto terminado
   - Liberar para expedición

7. **Crear Certificado de Calidad (QC01)** *(Opcional)*
   - Para clientes que requieren certificación
   - Incluye todos los resultados de inspección

---

## 3. Flujo: Gestión de Avisos de Calidad

### Objetivo
Gestionar defectos, quejas de clientes y problemas de calidad mediante avisos estructurados.

### Escenario 1: Queja de Cliente

1. **Cliente Reporta Problema**
   - Producto: FG-200 (Bomba)
   - Problema: Fuga en sello mecánico

2. **Crear Aviso de Calidad (QM01)**
   - Tipo: Q2 (Queja de cliente)
   - Número: 100000001
   - Código de defecto: LEAK
   - Prioridad: 1 (Muy alta)

3. **Investigación**
   - Asignar a inspector de calidad
   - Revisar lote de producción
   - Analizar causa raíz

4. **Modificar Aviso (QM02)**
   - Agregar hallazgos de investigación
   - Definir acciones correctivas
   - Cambiar estado a NOTI (Notificado)

5. **Acciones Correctivas**
   - Reemplazar producto bajo garantía
   - Revisar proceso de instalación de sellos
   - Actualizar instrucciones de trabajo

6. **Cerrar Aviso (QM02)**
   - Cambiar estado a COMP (Completado)
   - Documentar solución

### Escenario 2: Problema con Proveedor

1. **Inspección de Recepción Falla**
   - Material: RM-100
   - Defecto: Dimensiones fuera de tolerancia

2. **Crear Aviso de Calidad (QM01)**
   - Tipo: Q1 (Calidad interna)
   - Código: DIMENS
   - Vincular a lote de inspección rechazado

3. **Notificar a Proveedor**
   - Enviar aviso de calidad
   - Solicitar acción correctiva
   - Programar auditoría si es recurrente

---

## 4. Flujo: Certificados de Calidad

### Objetivo
Generar certificados de calidad para clientes que los requieren.

### Pasos del Proceso

1. **Completar Inspección Final**
   - Lote de inspección: 10000002
   - Decisión: Aceptado (A)
   - Todos los resultados documentados

2. **Crear Certificado (QC01)**
   - Tipo: 01 (Certificado de material)
   - Material: FG-200
   - Lote: PROD-2024-001
   - Cliente: CUST-001

3. **Incluir Datos del Certificado**
   - Resultados de todas las pruebas
   - Especificaciones cumplidas
   - Normas aplicables (ISO 9001, etc.)
   - Firma del inspector

4. **Imprimir/Enviar Certificado (QC03)**
   - Generar PDF
   - Enviar al cliente
   - Archivar copia

---

## 5. Datos de Ejemplo Disponibles

### Avisos de Calidad
- **100000001**: Queja cliente - Fuga en sello
- **100000002**: Proveedor - Dimensiones incorrectas
- **100000003**: Interno - Defecto superficial
- **100000004**: Auditoría - Falta calibración
- **100000005**: Cliente - Ruido excesivo

### Lotes de Inspección
- **10000001**: Recepción RM-100 - Aceptado
- **10000002**: Final FG-200 - Aceptado
- **10000003**: En proceso 100-200 - Resultados registrados
- **10000004**: Recepción ELEC-001 - Rechazado
- **10000005**: Recepción PKG-BOX - Muestra tomada

### Órdenes de Producción
- **1000000001**: FG-200 x10 - Liberada
- **1000000002**: FG-201 x5 - Parcialmente confirmada
- **1000000003**: SEMI-001 x50 - Técnicamente completa

---

## 6. Mejores Prácticas

### Para Estudiantes

1. **Siempre registrar resultados completos**
   - No dejar características sin inspeccionar
   - Documentar valores reales, no solo OK/NOT_OK

2. **Usar códigos de defecto estándar**
   - LEAK: Fugas
   - DIMENS: Problemas dimensionales
   - SURFACE: Defectos superficiales
   - NOISE: Ruido excesivo
   - PROC: Problemas de proceso

3. **Priorizar correctamente**
   - Prioridad 1: Seguridad, quejas críticas
   - Prioridad 2: Impacto en producción
   - Prioridad 3: Mejoras menores

4. **Cerrar el ciclo**
   - Todo aviso debe tener seguimiento
   - Documentar acciones correctivas
   - Verificar efectividad

### Para Técnicos de Calidad

1. **Trazabilidad completa**
   - Vincular avisos con lotes de inspección
   - Referenciar órdenes de producción/compra
   - Mantener historial de problemas

2. **Análisis de tendencias**
   - Revisar avisos recurrentes
   - Identificar proveedores problemáticos
   - Detectar problemas de proceso

3. **Mejora continua**
   - Usar datos de calidad para mejoras
   - Actualizar planes de inspección
   - Capacitar al personal

---

## 7. Transacciones Clave de Referencia

| Código | Descripción | Uso |
|--------|-------------|-----|
| QP01 | Crear plan de inspección | Definir qué inspeccionar |
| QP03 | Visualizar plan | Consultar características |
| QA01 | Crear lote de inspección | Iniciar inspección |
| QA02 | Modificar lote | Ajustar datos |
| QA03 | Visualizar lote | Consultar estado |
| QE01 | Registrar resultados | Ingresar mediciones |
| QE51N | Entrada de resultados (Enjoy) | Interfaz moderna |
| QA11 | Decisión de empleo | Aceptar/Rechazar |
| QM01 | Crear aviso de calidad | Reportar problema |
| QM02 | Modificar aviso | Actualizar estado |
| QM03 | Visualizar aviso | Consultar detalles |
| QMEL | Lista de avisos | Ver todos los avisos |
| QC01 | Crear certificado | Generar certificado |
| QC03 | Visualizar certificado | Consultar certificado |

---

## Notas Importantes

- Este sistema es una réplica educativa de SAP QM
- Los datos son ficticios pero realistas
- Practicar estos flujos ayuda a entender procesos industriales reales
- En SAP real, algunos procesos pueden tener pasos adicionales de configuración
