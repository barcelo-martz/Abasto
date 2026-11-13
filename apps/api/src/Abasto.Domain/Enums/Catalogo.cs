namespace Abasto.Domain.Enums;

public enum TipoProducto { Medicamento, Insumo }
public enum FormaFarmaceutica
{
    Tableta, Capsula, Jarabe, Suspension, Solucion, Inyectable,
    Crema, Unguento, Gotas, Inhalador, Supositorio, Parche, Otra
}
public enum ViaAdministracion
{
    Oral, Sublingual, Topica, Inhalatoria, Oftalmica, Otica, Nasal, Rectal, Parenteral, Otra
}
public enum UnidadInventario { Unidad, Tableta, Capsula, Frasco, Tubo, Ampolleta, Sobre, Caja, Blister }
public enum EstadoValidacionAlternativa { Sugerida, Validada, Rechazada }