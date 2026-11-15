using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Abasto.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddModeloCompleto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    padre_id = table.Column<Guid>(type: "uuid", nullable: true),
                    tipo_producto = table.Column<string>(type: "text", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categorias", x => x.id);
                    table.ForeignKey(
                        name: "fk_categorias_categorias_padre_id",
                        column: x => x.padre_id,
                        principalTable: "categorias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ciclos_abastecimiento",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    fecha_inicio = table.Column<DateOnly>(type: "date", nullable: false),
                    fecha_fin = table.Column<DateOnly>(type: "date", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ciclos_abastecimiento", x => x.id);
                    table.CheckConstraint("ck_ciclos_abastecimiento_estado", "estado IN ('PLANIFICADO', 'ABIERTO', 'CERRADO')");
                    table.CheckConstraint("ck_ciclos_abastecimiento_fechas", "fecha_fin >= fecha_inicio");
                });

            migrationBuilder.CreateTable(
                name: "principios_activos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_principios_activos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "provincias",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_provincias", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    nombre_comercial = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    categoria_id = table.Column<Guid>(type: "uuid", nullable: false),
                    forma_farmaceutica = table.Column<string>(type: "text", nullable: true),
                    via_administracion = table.Column<string>(type: "text", nullable: true),
                    concentracion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    presentacion = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    unidad_inventario = table.Column<string>(type: "text", nullable: false),
                    requiere_receta = table.Column<bool>(type: "boolean", nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_productos", x => x.id);
                    table.CheckConstraint("ck_productos_tipo", "tipo IN ('MEDICAMENTO', 'INSUMO')");
                    table.CheckConstraint("ck_productos_unidad_inventario", "unidad_inventario IN ('UNIDAD', 'TABLETA', 'CAPSULA', 'FRASCO', 'TUBO', 'AMPOLLETA', 'SOBRE', 'CAJA', 'BLISTER')");
                    table.ForeignKey(
                        name: "fk_productos_categorias_categoria_id",
                        column: x => x.categoria_id,
                        principalTable: "categorias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "almacenes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    provincia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    direccion = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    ubicacion = table.Column<Point>(type: "geography(Point,4326)", nullable: true),
                    telefono = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    estado = table.Column<string>(type: "text", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_almacenes", x => x.id);
                    table.CheckConstraint("ck_almacenes_estado", "estado IN ('ACTIVA', 'INACTIVA', 'CERRADA_TEMPORALMENTE')");
                    table.ForeignKey(
                        name: "fk_almacenes_provincias_provincia_id",
                        column: x => x.provincia_id,
                        principalTable: "provincias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "municipios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    provincia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_municipios", x => x.id);
                    table.ForeignKey(
                        name: "fk_municipios_provincias_provincia_id",
                        column: x => x.provincia_id,
                        principalTable: "provincias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "productos_principios_activos",
                columns: table => new
                {
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    principio_activo_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cantidad = table.Column<decimal>(type: "numeric(14,3)", precision: 14, scale: 3, nullable: true),
                    unidad = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_productos_principios_activos", x => new { x.producto_id, x.principio_activo_id });
                    table.ForeignKey(
                        name: "fk_productos_principios_activos_principios_activos_principio_a",
                        column: x => x.principio_activo_id,
                        principalTable: "principios_activos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_productos_principios_activos_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "farmacias",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    municipio_id = table.Column<Guid>(type: "uuid", nullable: false),
                    almacen_id = table.Column<Guid>(type: "uuid", nullable: true),
                    direccion = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    ubicacion = table.Column<Point>(type: "geography(Point,4326)", nullable: false),
                    telefono = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    tipo_propiedad = table.Column<string>(type: "text", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    tiene_conexion_fija = table.Column<bool>(type: "boolean", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_farmacias", x => x.id);
                    table.CheckConstraint("ck_farmacias_estado", "estado IN ('ACTIVA', 'INACTIVA', 'CERRADA_TEMPORALMENTE')");
                    table.CheckConstraint("ck_farmacias_tipo_propiedad", "tipo_propiedad IN ('ESTATAL', 'PRIVADA')");
                    table.ForeignKey(
                        name: "fk_farmacias_almacenes_almacen_id",
                        column: x => x.almacen_id,
                        principalTable: "almacenes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_farmacias_municipios_municipio_id",
                        column: x => x.municipio_id,
                        principalTable: "municipios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "unidades_salud",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    municipio_id = table.Column<Guid>(type: "uuid", nullable: false),
                    direccion = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    telefono = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    ubicacion = table.Column<Point>(type: "geography(Point,4326)", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_unidades_salud", x => x.id);
                    table.CheckConstraint("ck_unidades_salud_tipo", "tipo IN ('HOSPITAL', 'CONSULTORIO', 'OTRO')");
                    table.ForeignKey(
                        name: "fk_unidades_salud_municipios_municipio_id",
                        column: x => x.municipio_id,
                        principalTable: "municipios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "horarios_farmacia",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    dia_semana = table.Column<string>(type: "text", nullable: false),
                    abre_a = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    cierra_a = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    cerrado = table.Column<bool>(type: "boolean", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_horarios_farmacia", x => x.id);
                    table.CheckConstraint("ck_horarios_farmacia_dia_semana", "dia_semana IN ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO')");
                    table.CheckConstraint("ck_horarios_farmacia_horas", "cerrado OR (abre_a IS NOT NULL AND cierra_a IS NOT NULL)");
                    table.ForeignKey(
                        name: "fk_horarios_farmacia_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "predicciones_disponibilidad",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    probabilidad = table.Column<decimal>(type: "numeric(5,4)", precision: 5, scale: 4, nullable: false),
                    horizonte_dias = table.Column<int>(type: "integer", nullable: false),
                    dias_estimados_agotamiento = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    factores = table.Column<string>(type: "jsonb", nullable: true),
                    modelo_version = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    calculado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_predicciones_disponibilidad", x => x.id);
                    table.CheckConstraint("ck_predicciones_disponibilidad_probabilidad", "probabilidad BETWEEN 0 AND 1");
                    table.ForeignKey(
                        name: "fk_predicciones_disponibilidad_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_predicciones_disponibilidad_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    correo = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    contrasena_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    nombres = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    apellidos = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    telefono = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    rol = table.Column<string>(type: "text", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    provincia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    municipio_id = table.Column<Guid>(type: "uuid", nullable: true),
                    direccion = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    carnet_identidad = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    almacen_id = table.Column<Guid>(type: "uuid", nullable: true),
                    ultimo_acceso_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    intentos_fallidos = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    bloqueado_hasta = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_usuarios", x => x.id);
                    table.CheckConstraint("ck_usuarios_almacen_requerido", "rol <> 'PERSONAL_ALMACEN' OR almacen_id IS NOT NULL");
                    table.CheckConstraint("ck_usuarios_estado", "estado IN ('PENDIENTE_VERIFICACION', 'ACTIVO', 'BLOQUEADO', 'INACTIVO')");
                    table.CheckConstraint("ck_usuarios_farmacia_requerida", "rol <> 'PERSONAL_FARMACIA' OR farmacia_id IS NOT NULL");
                    table.CheckConstraint("ck_usuarios_municipio_requerido", "rol <> 'SUPERVISOR_MUNICIPAL' OR municipio_id IS NOT NULL");
                    table.CheckConstraint("ck_usuarios_rol", "rol IN ('CIUDADANO', 'PERSONAL_FARMACIA', 'PERSONAL_ALMACEN', 'SUPERVISOR_MUNICIPAL', 'ADMINISTRADOR')");
                    table.ForeignKey(
                        name: "fk_usuarios_almacenes_almacen_id",
                        column: x => x.almacen_id,
                        principalTable: "almacenes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_usuarios_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_usuarios_municipios_municipio_id",
                        column: x => x.municipio_id,
                        principalTable: "municipios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_usuarios_provincias_provincia_id",
                        column: x => x.provincia_id,
                        principalTable: "provincias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "alertas_tempranas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    severidad = table.Column<string>(type: "text", nullable: false),
                    dias_estimados_agotamiento = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    estado = table.Column<string>(type: "text", nullable: false),
                    reconocida_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    resuelta_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_alertas_tempranas", x => x.id);
                    table.CheckConstraint("ck_alertas_tempranas_estado", "estado IN ('ABIERTA', 'RECONOCIDA', 'RESUELTA', 'DESCARTADA')");
                    table.CheckConstraint("ck_alertas_tempranas_severidad", "severidad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')");
                    table.CheckConstraint("ck_alertas_tempranas_tipo", "tipo IN ('RUPTURA_INMINENTE', 'DESABASTECIMIENTO_PROYECTADO', 'SOBRESTOCK')");
                    table.ForeignKey(
                        name: "fk_alertas_tempranas_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_alertas_tempranas_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_alertas_tempranas_usuarios_reconocida_por_id",
                        column: x => x.reconocida_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "alternativas_producto",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    alternativa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    motivo = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    estado_validacion = table.Column<string>(type: "text", nullable: false),
                    validado_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    validado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_alternativas_producto", x => x.id);
                    table.CheckConstraint("ck_alternativas_producto_distintos", "producto_id <> alternativa_id");
                    table.CheckConstraint("ck_alternativas_producto_estado_validacion", "estado_validacion IN ('SUGERIDA', 'VALIDADA', 'RECHAZADA')");
                    table.ForeignKey(
                        name: "fk_alternativas_producto_productos_alternativa_id",
                        column: x => x.alternativa_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_alternativas_producto_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_alternativas_producto_usuarios_validado_por_id",
                        column: x => x.validado_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: true),
                    accion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    entidad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    entidad_id = table.Column<Guid>(type: "uuid", nullable: true),
                    datos_anteriores = table.Column<string>(type: "jsonb", nullable: true),
                    datos_nuevos = table.Column<string>(type: "jsonb", nullable: true),
                    ip = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_audit_logs", x => x.id);
                    table.ForeignKey(
                        name: "fk_audit_logs_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "busquedas_registro",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: true),
                    sesion_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    texto_consulta = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: true),
                    municipio_id = table.Column<Guid>(type: "uuid", nullable: true),
                    resultados = table.Column<int>(type: "integer", nullable: false),
                    sin_disponibilidad = table.Column<bool>(type: "boolean", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_busquedas_registro", x => x.id);
                    table.ForeignKey(
                        name: "fk_busquedas_registro_municipios_municipio_id",
                        column: x => x.municipio_id,
                        principalTable: "municipios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_busquedas_registro_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_busquedas_registro_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "distribuciones",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ciclo_id = table.Column<Guid>(type: "uuid", nullable: true),
                    almacen_id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    fecha_planificada = table.Column<DateOnly>(type: "date", nullable: true),
                    fecha_entrega = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    monto_total = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    registrada_por_id = table.Column<Guid>(type: "uuid", nullable: false),
                    confirmada_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    observaciones = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_distribuciones", x => x.id);
                    table.CheckConstraint("ck_distribuciones_estado", "estado IN ('PLANIFICADA', 'EN_TRANSITO', 'ENTREGADA', 'CONFIRMADA', 'CANCELADA')");
                    table.ForeignKey(
                        name: "fk_distribuciones_almacenes_almacen_id",
                        column: x => x.almacen_id,
                        principalTable: "almacenes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_distribuciones_ciclos_abastecimiento_ciclo_id",
                        column: x => x.ciclo_id,
                        principalTable: "ciclos_abastecimiento",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_distribuciones_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_distribuciones_usuarios_confirmada_por_id",
                        column: x => x.confirmada_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_distribuciones_usuarios_registrada_por_id",
                        column: x => x.registrada_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "favoritos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: true),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_favoritos", x => x.id);
                    table.CheckConstraint("ck_favoritos_objetivo", "(tipo = 'PRODUCTO' AND producto_id IS NOT NULL AND farmacia_id IS NULL) OR (tipo = 'FARMACIA' AND farmacia_id IS NOT NULL AND producto_id IS NULL)");
                    table.CheckConstraint("ck_favoritos_tipo", "tipo IN ('PRODUCTO', 'FARMACIA')");
                    table.ForeignKey(
                        name: "fk_favoritos_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_favoritos_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_favoritos_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "guias_producto",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    para_que_sirve = table.Column<string>(type: "text", nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    advertencias = table.Column<string>(type: "text", nullable: true),
                    conservacion = table.Column<string>(type: "text", nullable: true),
                    fuente = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    revisado_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    revisado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_guias_producto", x => x.id);
                    table.ForeignKey(
                        name: "fk_guias_producto_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_guias_producto_usuarios_revisado_por_id",
                        column: x => x.revisado_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "importaciones_inventario",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    almacen_id = table.Column<Guid>(type: "uuid", nullable: true),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre_archivo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    formato = table.Column<string>(type: "text", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    total_filas = table.Column<int>(type: "integer", nullable: false),
                    filas_validas = table.Column<int>(type: "integer", nullable: false),
                    filas_con_error = table.Column<int>(type: "integer", nullable: false),
                    errores = table.Column<string>(type: "jsonb", nullable: true),
                    aplicada_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_importaciones_inventario", x => x.id);
                    table.CheckConstraint("ck_importaciones_inventario_estado", "estado IN ('SUBIDA', 'VALIDADA', 'CON_ERRORES', 'APLICADA', 'FALLIDA')");
                    table.CheckConstraint("ck_importaciones_inventario_formato", "formato IN ('CSV', 'XLSX')");
                    table.CheckConstraint("ck_importaciones_inventario_una_unidad", "num_nonnulls(farmacia_id, almacen_id) = 1");
                    table.ForeignKey(
                        name: "fk_importaciones_inventario_almacenes_almacen_id",
                        column: x => x.almacen_id,
                        principalTable: "almacenes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_importaciones_inventario_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_importaciones_inventario_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "inventarios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    almacen_id = table.Column<Guid>(type: "uuid", nullable: true),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cantidad = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    precio_unitario = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    monto_total = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false, computedColumnSql: "cantidad * precio_unitario", stored: true),
                    minimo = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: true),
                    maximo = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: true),
                    estado_disponibilidad = table.Column<string>(type: "text", nullable: false),
                    nivel_confianza = table.Column<string>(type: "text", nullable: false),
                    origen_dato = table.Column<string>(type: "text", nullable: false),
                    ultima_actualizacion_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_inventarios", x => x.id);
                    table.CheckConstraint("ck_inventarios_cantidad", "cantidad >= 0");
                    table.CheckConstraint("ck_inventarios_estado_disponibilidad", "estado_disponibilidad IN ('DISPONIBLE', 'BAJO_STOCK', 'AGOTADO', 'SIN_INFORMACION')");
                    table.CheckConstraint("ck_inventarios_nivel_confianza", "nivel_confianza IN ('VERIFICADA', 'ESTIMADA', 'DESACTUALIZADA')");
                    table.CheckConstraint("ck_inventarios_origen_dato", "origen_dato IN ('MANUAL', 'ARCHIVO', 'SINCRONIZACION', 'TRASLADO', 'DISTRIBUCION', 'SISTEMA')");
                    table.CheckConstraint("ck_inventarios_precio", "precio_unitario >= 0");
                    table.CheckConstraint("ck_inventarios_una_unidad", "num_nonnulls(farmacia_id, almacen_id) = 1");
                    table.ForeignKey(
                        name: "fk_inventarios_almacenes_almacen_id",
                        column: x => x.almacen_id,
                        principalTable: "almacenes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventarios_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventarios_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_inventarios_usuarios_actualizado_por_id",
                        column: x => x.actualizado_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "lecturas_receta",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: true),
                    tipo_documento = table.Column<string>(type: "text", nullable: false),
                    imagen_ref = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    texto_crudo = table.Column<string>(type: "text", nullable: true),
                    proveedor_ocr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    estado = table.Column<string>(type: "text", nullable: false),
                    confianza_global = table.Column<decimal>(type: "numeric(5,4)", precision: 5, scale: 4, nullable: true),
                    expira_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lecturas_receta", x => x.id);
                    table.CheckConstraint("ck_lecturas_receta_confianza", "confianza_global IS NULL OR confianza_global BETWEEN 0 AND 1");
                    table.CheckConstraint("ck_lecturas_receta_estado", "estado IN ('PENDIENTE', 'PROCESADA', 'EDITADA', 'CONFIRMADA', 'FALLIDA')");
                    table.CheckConstraint("ck_lecturas_receta_tipo_documento", "tipo_documento IN ('RECETA', 'TARJETON')");
                    table.ForeignKey(
                        name: "fk_lecturas_receta_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "mensajes_contacto",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: true),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    correo = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    asunto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    mensaje = table.Column<string>(type: "text", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    respuesta = table.Column<string>(type: "text", nullable: true),
                    respondido_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    respondido_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_mensajes_contacto", x => x.id);
                    table.CheckConstraint("ck_mensajes_contacto_estado", "estado IN ('NUEVO', 'LEIDO', 'RESPONDIDO', 'ARCHIVADO')");
                    table.ForeignKey(
                        name: "fk_mensajes_contacto_usuarios_respondido_por_id",
                        column: x => x.respondido_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_mensajes_contacto_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "notificaciones",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    titulo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    mensaje = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    referencia_tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    referencia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    leida = table.Column<bool>(type: "boolean", nullable: false),
                    leida_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notificaciones", x => x.id);
                    table.CheckConstraint("ck_notificaciones_tipo", "tipo IN ('DISPONIBILIDAD_PRODUCTO', 'ALERTA_RUPTURA', 'TRASLADO_SOLICITADO', 'TRASLADO_RESUELTO', 'DISTRIBUCION_REGISTRADA', 'ANOMALIA_DETECTADA', 'MENSAJE_RESPONDIDO', 'RECORDATORIO', 'SISTEMA')");
                    table.ForeignKey(
                        name: "fk_notificaciones_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "operaciones_sync",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    id_cliente = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    payload = table.Column<string>(type: "jsonb", nullable: false),
                    creada_en_cliente = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    error = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    procesada_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_operaciones_sync", x => x.id);
                    table.CheckConstraint("ck_operaciones_sync_estado", "estado IN ('PENDIENTE', 'APLICADA', 'CONFLICTO', 'RECHAZADA')");
                    table.CheckConstraint("ck_operaciones_sync_tipo", "tipo IN ('ACTUALIZAR_STOCK', 'REGISTRAR_DISPENSACION', 'REGISTRAR_AJUSTE')");
                    table.ForeignKey(
                        name: "fk_operaciones_sync_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_operaciones_sync_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "parametros_sistema",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    clave = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    valor = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    descripcion = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    actualizado_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_parametros_sistema", x => x.id);
                    table.CheckConstraint("ck_parametros_sistema_tipo", "tipo IN ('ENTERO', 'DECIMAL', 'TEXTO', 'BOOLEANO')");
                    table.ForeignKey(
                        name: "fk_parametros_sistema_usuarios_actualizado_por_id",
                        column: x => x.actualizado_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "refresh_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    expira_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    revocado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ip = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_refresh_tokens", x => x.id);
                    table.ForeignKey(
                        name: "fk_refresh_tokens_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "remisiones_cronicas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    farmacia_origen_id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_destino_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo_referencia = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    vigente_hasta = table.Column<DateOnly>(type: "date", nullable: true),
                    aprobada_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    motivo = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_remisiones_cronicas", x => x.id);
                    table.CheckConstraint("ck_remisiones_cronicas_estado", "estado IN ('SOLICITADA', 'APROBADA', 'RECHAZADA', 'ATENDIDA', 'VENCIDA')");
                    table.CheckConstraint("ck_remisiones_cronicas_origen_destino", "farmacia_origen_id <> farmacia_destino_id");
                    table.ForeignKey(
                        name: "fk_remisiones_cronicas_farmacias_farmacia_destino_id",
                        column: x => x.farmacia_destino_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_remisiones_cronicas_farmacias_farmacia_origen_id",
                        column: x => x.farmacia_origen_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_remisiones_cronicas_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_remisiones_cronicas_usuarios_aprobada_por_id",
                        column: x => x.aprobada_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "suscripciones_alerta",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    municipio_id = table.Column<Guid>(type: "uuid", nullable: true),
                    activa = table.Column<bool>(type: "boolean", nullable: false),
                    ultima_notificacion_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_suscripciones_alerta", x => x.id);
                    table.ForeignKey(
                        name: "fk_suscripciones_alerta_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_suscripciones_alerta_municipios_municipio_id",
                        column: x => x.municipio_id,
                        principalTable: "municipios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_suscripciones_alerta_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_suscripciones_alerta_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "tokens_usuario",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    token_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    expira_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    usado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tokens_usuario", x => x.id);
                    table.CheckConstraint("ck_tokens_usuario_tipo", "tipo IN ('VERIFICACION_CORREO', 'RECUPERACION_CONTRASENA')");
                    table.ForeignKey(
                        name: "fk_tokens_usuario_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "traslados",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    farmacia_origen_id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_destino_id = table.Column<Guid>(type: "uuid", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    motivo = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    solicitado_por_id = table.Column<Guid>(type: "uuid", nullable: false),
                    aprobado_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    resuelto_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    comentario_resolucion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_traslados", x => x.id);
                    table.CheckConstraint("ck_traslados_estado", "estado IN ('SOLICITADO', 'APROBADO', 'RECHAZADO', 'EN_TRANSITO', 'RECIBIDO', 'CANCELADO')");
                    table.CheckConstraint("ck_traslados_origen_destino", "farmacia_origen_id <> farmacia_destino_id");
                    table.ForeignKey(
                        name: "fk_traslados_farmacias_farmacia_destino_id",
                        column: x => x.farmacia_destino_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_traslados_farmacias_farmacia_origen_id",
                        column: x => x.farmacia_origen_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_traslados_usuarios_aprobado_por_id",
                        column: x => x.aprobado_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_traslados_usuarios_solicitado_por_id",
                        column: x => x.solicitado_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "distribuciones_detalle",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    distribucion_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cantidad_enviada = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    cantidad_recibida = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: true),
                    precio_unitario = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    monto_total = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_distribuciones_detalle", x => x.id);
                    table.ForeignKey(
                        name: "fk_distribuciones_detalle_distribuciones_distribucion_id",
                        column: x => x.distribucion_id,
                        principalTable: "distribuciones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_distribuciones_detalle_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "movimientos_inventario",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    inventario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    cantidad = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    cantidad_anterior = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    cantidad_posterior = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    precio_unitario = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    monto_total = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    motivo = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    referencia_tipo = table.Column<string>(type: "text", nullable: true),
                    referencia_id = table.Column<Guid>(type: "uuid", nullable: true),
                    origen_dato = table.Column<string>(type: "text", nullable: false),
                    id_cliente = table.Column<Guid>(type: "uuid", nullable: true),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    fecha_operacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_movimientos_inventario", x => x.id);
                    table.CheckConstraint("ck_movimientos_inventario_cantidad", "cantidad > 0");
                    table.CheckConstraint("ck_movimientos_inventario_origen_dato", "origen_dato IN ('MANUAL', 'ARCHIVO', 'SINCRONIZACION', 'TRASLADO', 'DISTRIBUCION', 'SISTEMA')");
                    table.CheckConstraint("ck_movimientos_inventario_tipo", "tipo IN ('CARGA_INICIAL', 'ENTRADA_DISTRIBUCION', 'ENTRADA_TRASLADO', 'SALIDA_TRASLADO', 'SALIDA_DISPENSACION', 'SALIDA_DISTRIBUCION', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'BAJA')");
                    table.ForeignKey(
                        name: "fk_movimientos_inventario_inventarios_inventario_id",
                        column: x => x.inventario_id,
                        principalTable: "inventarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_movimientos_inventario_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "lecturas_receta_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    lectura_id = table.Column<Guid>(type: "uuid", nullable: false),
                    texto_original = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    texto_editado = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: true),
                    cantidad = table.Column<int>(type: "integer", nullable: true),
                    confianza = table.Column<decimal>(type: "numeric(5,4)", precision: 5, scale: 4, nullable: true),
                    confirmado = table.Column<bool>(type: "boolean", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lecturas_receta_items", x => x.id);
                    table.CheckConstraint("ck_lecturas_receta_items_confianza", "confianza IS NULL OR confianza BETWEEN 0 AND 1");
                    table.ForeignKey(
                        name: "fk_lecturas_receta_items_lecturas_receta_lectura_id",
                        column: x => x.lectura_id,
                        principalTable: "lecturas_receta",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_lecturas_receta_items_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "listas_medicamentos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    origen_receta_id = table.Column<Guid>(type: "uuid", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_listas_medicamentos", x => x.id);
                    table.ForeignKey(
                        name: "fk_listas_medicamentos_lecturas_receta_origen_receta_id",
                        column: x => x.origen_receta_id,
                        principalTable: "lecturas_receta",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_listas_medicamentos_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "traslados_detalle",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    traslado_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cantidad_solicitada = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    cantidad_aprobada = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: true),
                    cantidad_recibida = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_traslados_detalle", x => x.id);
                    table.ForeignKey(
                        name: "fk_traslados_detalle_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_traslados_detalle_traslados_traslado_id",
                        column: x => x.traslado_id,
                        principalTable: "traslados",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "anomalias",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: true),
                    movimiento_id = table.Column<Guid>(type: "uuid", nullable: true),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    puntuacion = table.Column<decimal>(type: "numeric(10,4)", precision: 10, scale: 4, nullable: false),
                    descripcion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    revisada_por_id = table.Column<Guid>(type: "uuid", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_anomalias", x => x.id);
                    table.CheckConstraint("ck_anomalias_estado", "estado IN ('NUEVA', 'EN_REVISION', 'CONFIRMADA', 'FALSO_POSITIVO')");
                    table.CheckConstraint("ck_anomalias_tipo", "tipo IN ('CONSUMO_ATIPICO', 'AJUSTE_SOSPECHOSO', 'ACTUALIZACION_INCONSISTENTE', 'PRECIO_FUERA_DE_RANGO')");
                    table.ForeignKey(
                        name: "fk_anomalias_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_anomalias_movimientos_inventario_movimiento_id",
                        column: x => x.movimiento_id,
                        principalTable: "movimientos_inventario",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_anomalias_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_anomalias_usuarios_revisada_por_id",
                        column: x => x.revisada_por_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "listas_medicamentos_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    lista_id = table.Column<Guid>(type: "uuid", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cantidad = table.Column<int>(type: "integer", nullable: true),
                    nota = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_listas_medicamentos_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_listas_medicamentos_items_listas_medicamentos_lista_id",
                        column: x => x.lista_id,
                        principalTable: "listas_medicamentos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_listas_medicamentos_items_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "planes_recorrido",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: true),
                    origen = table.Column<Point>(type: "geography(Point,4326)", nullable: false),
                    lista_id = table.Column<Guid>(type: "uuid", nullable: true),
                    distancia_total_km = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    tiempo_estimado_min = table.Column<int>(type: "integer", nullable: true),
                    cubre_pct = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_planes_recorrido", x => x.id);
                    table.ForeignKey(
                        name: "fk_planes_recorrido_listas_medicamentos_lista_id",
                        column: x => x.lista_id,
                        principalTable: "listas_medicamentos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_planes_recorrido_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "recordatorios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    producto_id = table.Column<Guid>(type: "uuid", nullable: true),
                    lista_id = table.Column<Guid>(type: "uuid", nullable: true),
                    programado_para = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    frecuencia_dias = table.Column<int>(type: "integer", nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false),
                    ultimo_disparo_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_recordatorios", x => x.id);
                    table.CheckConstraint("ck_recordatorios_frecuencia", "frecuencia_dias IS NULL OR frecuencia_dias > 0");
                    table.CheckConstraint("ck_recordatorios_tipo", "tipo IN ('REPOSICION', 'REPETIR_LISTA', 'POSIBLE_FALTA')");
                    table.ForeignKey(
                        name: "fk_recordatorios_listas_medicamentos_lista_id",
                        column: x => x.lista_id,
                        principalTable: "listas_medicamentos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_recordatorios_productos_producto_id",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_recordatorios_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "planes_recorrido_paradas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    plan_id = table.Column<Guid>(type: "uuid", nullable: false),
                    orden = table.Column<int>(type: "integer", nullable: false),
                    farmacia_id = table.Column<Guid>(type: "uuid", nullable: false),
                    distancia_desde_anterior_km = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    productos_ids = table.Column<Guid[]>(type: "uuid[]", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_planes_recorrido_paradas", x => x.id);
                    table.ForeignKey(
                        name: "fk_planes_recorrido_paradas_farmacias_farmacia_id",
                        column: x => x.farmacia_id,
                        principalTable: "farmacias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_planes_recorrido_paradas_planes_recorrido_plan_id",
                        column: x => x.plan_id,
                        principalTable: "planes_recorrido",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "parametros_sistema",
                columns: new[] { "id", "actualizado_en", "actualizado_por_id", "clave", "creado_en", "descripcion", "tipo", "valor" },
                values: new object[,]
                {
                    { new Guid("30000000-0000-0000-0000-000000000001"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "confianza.horasVerificada", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Horas máximas para que el dato de la farmacia sea VERIFICADA", "ENTERO", "48" },
                    { new Guid("30000000-0000-0000-0000-000000000002"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "confianza.horasDesactualizada", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pasadas estas horas el dato pasa a DESACTUALIZADA", "ENTERO", "168" },
                    { new Guid("30000000-0000-0000-0000-000000000003"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "stock.minimoInicialPct", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Mínimo inicial como porcentaje del máximo", "ENTERO", "20" },
                    { new Guid("30000000-0000-0000-0000-000000000004"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "stock.umbralBajoPct", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "BAJO_STOCK si no hay mínimo definido (porcentaje del máximo)", "ENTERO", "20" },
                    { new Guid("30000000-0000-0000-0000-000000000005"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "abastecimiento.cicloDias", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Duración del ciclo de abastecimiento", "ENTERO", "60" },
                    { new Guid("30000000-0000-0000-0000-000000000006"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "alertas.diasAnticipacion", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Días de anticipación de la alerta de ruptura", "ENTERO", "14" },
                    { new Guid("30000000-0000-0000-0000-000000000007"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "prediccion.horizonteDias", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Horizonte de la probabilidad de disponibilidad", "ENTERO", "14" },
                    { new Guid("30000000-0000-0000-0000-000000000008"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "prediccion.ventanaConsumoDias", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Ventana para calcular el ritmo de consumo", "ENTERO", "30" },
                    { new Guid("30000000-0000-0000-0000-000000000009"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "anomalias.umbralPuntuacion", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Puntuación mínima para marcar una anomalía", "DECIMAL", "3" },
                    { new Guid("30000000-0000-0000-0000-000000000010"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "receta.horasRetencion", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Retención del texto leído; la imagen se borra al procesar", "ENTERO", "24" },
                    { new Guid("30000000-0000-0000-0000-000000000011"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "auth.maxIntentosFallidos", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Intentos fallidos antes de bloquear la cuenta", "ENTERO", "5" },
                    { new Guid("30000000-0000-0000-0000-000000000012"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "auth.minutosBloqueo", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Duración del bloqueo de la cuenta", "ENTERO", "15" }
                });

            migrationBuilder.InsertData(
                table: "provincias",
                columns: new[] { "id", "actualizado_en", "codigo", "creado_en", "nombre" },
                values: new object[] { new Guid("10000000-0000-0000-0000-000000000001"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La Habana" });

            migrationBuilder.InsertData(
                table: "municipios",
                columns: new[] { "id", "actualizado_en", "codigo", "creado_en", "nombre", "provincia_id" },
                values: new object[,]
                {
                    { new Guid("20000000-0000-0000-0000-000000000001"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-01", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Playa", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000002"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-02", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Plaza de la Revolución", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000003"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-03", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Centro Habana", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000004"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-04", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La Habana Vieja", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000005"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-05", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Regla", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000006"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-06", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La Habana del Este", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000007"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-07", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Guanabacoa", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000008"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-08", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "San Miguel del Padrón", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000009"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-09", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Diez de Octubre", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000010"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-10", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cerro", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000011"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-11", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Marianao", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000012"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-12", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La Lisa", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000013"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-13", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Boyeros", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000014"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-14", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Arroyo Naranjo", new Guid("10000000-0000-0000-0000-000000000001") },
                    { new Guid("20000000-0000-0000-0000-000000000015"), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "LHA-15", new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cotorro", new Guid("10000000-0000-0000-0000-000000000001") }
                });

            migrationBuilder.CreateIndex(
                name: "ix_alertas_tempranas_farmacia_id_estado",
                table: "alertas_tempranas",
                columns: new[] { "farmacia_id", "estado" });

            migrationBuilder.CreateIndex(
                name: "ix_alertas_tempranas_producto_id",
                table: "alertas_tempranas",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_alertas_tempranas_reconocida_por_id",
                table: "alertas_tempranas",
                column: "reconocida_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_almacenes_codigo",
                table: "almacenes",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_almacenes_provincia_id",
                table: "almacenes",
                column: "provincia_id");

            migrationBuilder.CreateIndex(
                name: "ix_alternativas_producto_alternativa_id",
                table: "alternativas_producto",
                column: "alternativa_id");

            migrationBuilder.CreateIndex(
                name: "ix_alternativas_producto_producto_id_alternativa_id",
                table: "alternativas_producto",
                columns: new[] { "producto_id", "alternativa_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_alternativas_producto_validado_por_id",
                table: "alternativas_producto",
                column: "validado_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_anomalias_farmacia_id_estado",
                table: "anomalias",
                columns: new[] { "farmacia_id", "estado" });

            migrationBuilder.CreateIndex(
                name: "ix_anomalias_movimiento_id",
                table: "anomalias",
                column: "movimiento_id");

            migrationBuilder.CreateIndex(
                name: "ix_anomalias_producto_id",
                table: "anomalias",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_anomalias_revisada_por_id",
                table: "anomalias",
                column: "revisada_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_creado_en",
                table: "audit_logs",
                column: "creado_en");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_entidad_entidad_id",
                table: "audit_logs",
                columns: new[] { "entidad", "entidad_id" });

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_usuario_id",
                table: "audit_logs",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_busquedas_registro_creado_en",
                table: "busquedas_registro",
                column: "creado_en");

            migrationBuilder.CreateIndex(
                name: "ix_busquedas_registro_municipio_id",
                table: "busquedas_registro",
                column: "municipio_id");

            migrationBuilder.CreateIndex(
                name: "ix_busquedas_registro_producto_id",
                table: "busquedas_registro",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_busquedas_registro_sin_disponibilidad_municipio_id",
                table: "busquedas_registro",
                columns: new[] { "sin_disponibilidad", "municipio_id" });

            migrationBuilder.CreateIndex(
                name: "ix_busquedas_registro_usuario_id",
                table: "busquedas_registro",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_categorias_padre_id_nombre",
                table: "categorias",
                columns: new[] { "padre_id", "nombre" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_almacen_id",
                table: "distribuciones",
                column: "almacen_id");

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_ciclo_id",
                table: "distribuciones",
                column: "ciclo_id");

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_codigo",
                table: "distribuciones",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_confirmada_por_id",
                table: "distribuciones",
                column: "confirmada_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_farmacia_id",
                table: "distribuciones",
                column: "farmacia_id");

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_registrada_por_id",
                table: "distribuciones",
                column: "registrada_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_detalle_distribucion_id_producto_id",
                table: "distribuciones_detalle",
                columns: new[] { "distribucion_id", "producto_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_distribuciones_detalle_producto_id",
                table: "distribuciones_detalle",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_farmacias_almacen_id",
                table: "farmacias",
                column: "almacen_id");

            migrationBuilder.CreateIndex(
                name: "ix_farmacias_codigo",
                table: "farmacias",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_farmacias_municipio_id",
                table: "farmacias",
                column: "municipio_id");

            migrationBuilder.CreateIndex(
                name: "ix_farmacias_ubicacion",
                table: "farmacias",
                column: "ubicacion")
                .Annotation("Npgsql:IndexMethod", "gist");

            migrationBuilder.CreateIndex(
                name: "ix_favoritos_farmacia_id",
                table: "favoritos",
                column: "farmacia_id");

            migrationBuilder.CreateIndex(
                name: "ix_favoritos_producto_id",
                table: "favoritos",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_favoritos_usuario_id_farmacia_id",
                table: "favoritos",
                columns: new[] { "usuario_id", "farmacia_id" },
                unique: true,
                filter: "farmacia_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_favoritos_usuario_id_producto_id",
                table: "favoritos",
                columns: new[] { "usuario_id", "producto_id" },
                unique: true,
                filter: "producto_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_guias_producto_producto_id",
                table: "guias_producto",
                column: "producto_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_guias_producto_revisado_por_id",
                table: "guias_producto",
                column: "revisado_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_horarios_farmacia_farmacia_id_dia_semana",
                table: "horarios_farmacia",
                columns: new[] { "farmacia_id", "dia_semana" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_importaciones_inventario_almacen_id",
                table: "importaciones_inventario",
                column: "almacen_id");

            migrationBuilder.CreateIndex(
                name: "ix_importaciones_inventario_farmacia_id",
                table: "importaciones_inventario",
                column: "farmacia_id");

            migrationBuilder.CreateIndex(
                name: "ix_importaciones_inventario_usuario_id",
                table: "importaciones_inventario",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventarios_actualizado_por_id",
                table: "inventarios",
                column: "actualizado_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventarios_almacen_id_producto_id",
                table: "inventarios",
                columns: new[] { "almacen_id", "producto_id" },
                unique: true,
                filter: "almacen_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_inventarios_farmacia_id_producto_id",
                table: "inventarios",
                columns: new[] { "farmacia_id", "producto_id" },
                unique: true,
                filter: "farmacia_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_inventarios_producto_id",
                table: "inventarios",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_lecturas_receta_expira_en",
                table: "lecturas_receta",
                column: "expira_en");

            migrationBuilder.CreateIndex(
                name: "ix_lecturas_receta_usuario_id",
                table: "lecturas_receta",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_lecturas_receta_items_lectura_id",
                table: "lecturas_receta_items",
                column: "lectura_id");

            migrationBuilder.CreateIndex(
                name: "ix_lecturas_receta_items_producto_id",
                table: "lecturas_receta_items",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_listas_medicamentos_origen_receta_id",
                table: "listas_medicamentos",
                column: "origen_receta_id");

            migrationBuilder.CreateIndex(
                name: "ix_listas_medicamentos_usuario_id",
                table: "listas_medicamentos",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_listas_medicamentos_items_lista_id_producto_id",
                table: "listas_medicamentos_items",
                columns: new[] { "lista_id", "producto_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_listas_medicamentos_items_producto_id",
                table: "listas_medicamentos_items",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_mensajes_contacto_estado",
                table: "mensajes_contacto",
                column: "estado");

            migrationBuilder.CreateIndex(
                name: "ix_mensajes_contacto_respondido_por_id",
                table: "mensajes_contacto",
                column: "respondido_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_mensajes_contacto_usuario_id",
                table: "mensajes_contacto",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_movimientos_inventario_id_cliente",
                table: "movimientos_inventario",
                column: "id_cliente",
                unique: true,
                filter: "id_cliente IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_movimientos_inventario_inventario_id_fecha_operacion",
                table: "movimientos_inventario",
                columns: new[] { "inventario_id", "fecha_operacion" });

            migrationBuilder.CreateIndex(
                name: "ix_movimientos_inventario_usuario_id",
                table: "movimientos_inventario",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_municipios_provincia_id_nombre",
                table: "municipios",
                columns: new[] { "provincia_id", "nombre" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_notificaciones_usuario_id_leida_creado_en",
                table: "notificaciones",
                columns: new[] { "usuario_id", "leida", "creado_en" });

            migrationBuilder.CreateIndex(
                name: "ix_operaciones_sync_farmacia_id_estado",
                table: "operaciones_sync",
                columns: new[] { "farmacia_id", "estado" });

            migrationBuilder.CreateIndex(
                name: "ix_operaciones_sync_id_cliente",
                table: "operaciones_sync",
                column: "id_cliente",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_operaciones_sync_usuario_id",
                table: "operaciones_sync",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_parametros_sistema_actualizado_por_id",
                table: "parametros_sistema",
                column: "actualizado_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_parametros_sistema_clave",
                table: "parametros_sistema",
                column: "clave",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_planes_recorrido_lista_id",
                table: "planes_recorrido",
                column: "lista_id");

            migrationBuilder.CreateIndex(
                name: "ix_planes_recorrido_usuario_id",
                table: "planes_recorrido",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_planes_recorrido_paradas_farmacia_id",
                table: "planes_recorrido_paradas",
                column: "farmacia_id");

            migrationBuilder.CreateIndex(
                name: "ix_planes_recorrido_paradas_plan_id_orden",
                table: "planes_recorrido_paradas",
                columns: new[] { "plan_id", "orden" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_predicciones_disponibilidad_farmacia_id_producto_id_horizon",
                table: "predicciones_disponibilidad",
                columns: new[] { "farmacia_id", "producto_id", "horizonte_dias" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_predicciones_disponibilidad_producto_id",
                table: "predicciones_disponibilidad",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_principios_activos_nombre",
                table: "principios_activos",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_productos_categoria_id",
                table: "productos",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "ix_productos_codigo",
                table: "productos",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_productos_nombre",
                table: "productos",
                column: "nombre");

            migrationBuilder.CreateIndex(
                name: "ix_productos_principios_activos_principio_activo_id",
                table: "productos_principios_activos",
                column: "principio_activo_id");

            migrationBuilder.CreateIndex(
                name: "ix_provincias_codigo",
                table: "provincias",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_provincias_nombre",
                table: "provincias",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_recordatorios_activo_programado_para",
                table: "recordatorios",
                columns: new[] { "activo", "programado_para" });

            migrationBuilder.CreateIndex(
                name: "ix_recordatorios_lista_id",
                table: "recordatorios",
                column: "lista_id");

            migrationBuilder.CreateIndex(
                name: "ix_recordatorios_producto_id",
                table: "recordatorios",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_recordatorios_usuario_id",
                table: "recordatorios",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_refresh_tokens_token_hash",
                table: "refresh_tokens",
                column: "token_hash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_refresh_tokens_usuario_id",
                table: "refresh_tokens",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_remisiones_cronicas_aprobada_por_id",
                table: "remisiones_cronicas",
                column: "aprobada_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_remisiones_cronicas_codigo",
                table: "remisiones_cronicas",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_remisiones_cronicas_farmacia_destino_id",
                table: "remisiones_cronicas",
                column: "farmacia_destino_id");

            migrationBuilder.CreateIndex(
                name: "ix_remisiones_cronicas_farmacia_origen_id",
                table: "remisiones_cronicas",
                column: "farmacia_origen_id");

            migrationBuilder.CreateIndex(
                name: "ix_remisiones_cronicas_producto_id",
                table: "remisiones_cronicas",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_suscripciones_alerta_farmacia_id",
                table: "suscripciones_alerta",
                column: "farmacia_id");

            migrationBuilder.CreateIndex(
                name: "ix_suscripciones_alerta_municipio_id",
                table: "suscripciones_alerta",
                column: "municipio_id");

            migrationBuilder.CreateIndex(
                name: "ix_suscripciones_alerta_producto_id_activa",
                table: "suscripciones_alerta",
                columns: new[] { "producto_id", "activa" });

            migrationBuilder.CreateIndex(
                name: "ix_suscripciones_alerta_usuario_id",
                table: "suscripciones_alerta",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_tokens_usuario_token_hash",
                table: "tokens_usuario",
                column: "token_hash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tokens_usuario_usuario_id",
                table: "tokens_usuario",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_traslados_aprobado_por_id",
                table: "traslados",
                column: "aprobado_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_traslados_codigo",
                table: "traslados",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_traslados_farmacia_destino_id",
                table: "traslados",
                column: "farmacia_destino_id");

            migrationBuilder.CreateIndex(
                name: "ix_traslados_farmacia_origen_id",
                table: "traslados",
                column: "farmacia_origen_id");

            migrationBuilder.CreateIndex(
                name: "ix_traslados_solicitado_por_id",
                table: "traslados",
                column: "solicitado_por_id");

            migrationBuilder.CreateIndex(
                name: "ix_traslados_detalle_producto_id",
                table: "traslados_detalle",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "ix_traslados_detalle_traslado_id_producto_id",
                table: "traslados_detalle",
                columns: new[] { "traslado_id", "producto_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_unidades_salud_municipio_id",
                table: "unidades_salud",
                column: "municipio_id");

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_almacen_id",
                table: "usuarios",
                column: "almacen_id");

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_correo",
                table: "usuarios",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_farmacia_id",
                table: "usuarios",
                column: "farmacia_id",
                unique: true,
                filter: "rol = 'PERSONAL_FARMACIA'");

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_municipio_id",
                table: "usuarios",
                column: "municipio_id");

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_provincia_id",
                table: "usuarios",
                column: "provincia_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alertas_tempranas");

            migrationBuilder.DropTable(
                name: "alternativas_producto");

            migrationBuilder.DropTable(
                name: "anomalias");

            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "busquedas_registro");

            migrationBuilder.DropTable(
                name: "distribuciones_detalle");

            migrationBuilder.DropTable(
                name: "favoritos");

            migrationBuilder.DropTable(
                name: "guias_producto");

            migrationBuilder.DropTable(
                name: "horarios_farmacia");

            migrationBuilder.DropTable(
                name: "importaciones_inventario");

            migrationBuilder.DropTable(
                name: "lecturas_receta_items");

            migrationBuilder.DropTable(
                name: "listas_medicamentos_items");

            migrationBuilder.DropTable(
                name: "mensajes_contacto");

            migrationBuilder.DropTable(
                name: "notificaciones");

            migrationBuilder.DropTable(
                name: "operaciones_sync");

            migrationBuilder.DropTable(
                name: "parametros_sistema");

            migrationBuilder.DropTable(
                name: "planes_recorrido_paradas");

            migrationBuilder.DropTable(
                name: "predicciones_disponibilidad");

            migrationBuilder.DropTable(
                name: "productos_principios_activos");

            migrationBuilder.DropTable(
                name: "recordatorios");

            migrationBuilder.DropTable(
                name: "refresh_tokens");

            migrationBuilder.DropTable(
                name: "remisiones_cronicas");

            migrationBuilder.DropTable(
                name: "suscripciones_alerta");

            migrationBuilder.DropTable(
                name: "tokens_usuario");

            migrationBuilder.DropTable(
                name: "traslados_detalle");

            migrationBuilder.DropTable(
                name: "unidades_salud");

            migrationBuilder.DropTable(
                name: "movimientos_inventario");

            migrationBuilder.DropTable(
                name: "distribuciones");

            migrationBuilder.DropTable(
                name: "planes_recorrido");

            migrationBuilder.DropTable(
                name: "principios_activos");

            migrationBuilder.DropTable(
                name: "traslados");

            migrationBuilder.DropTable(
                name: "inventarios");

            migrationBuilder.DropTable(
                name: "ciclos_abastecimiento");

            migrationBuilder.DropTable(
                name: "listas_medicamentos");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "lecturas_receta");

            migrationBuilder.DropTable(
                name: "categorias");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "farmacias");

            migrationBuilder.DropTable(
                name: "almacenes");

            migrationBuilder.DropTable(
                name: "municipios");

            migrationBuilder.DropTable(
                name: "provincias");
        }
    }
}
