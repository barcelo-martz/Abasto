using System.Text.Json;
using Abasto.Application.Common.Excepciones;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Abasto.Api.Middleware;

public sealed class ManejadorExcepciones(IProblemDetailsService problemas) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext http, Exception ex, CancellationToken ct)
    {
        ProblemDetails problema;
        switch (ex)
        {
            case ValidationException validacion:
                problema = new ValidationProblemDetails(validacion.Errors
                    .GroupBy(e => JsonNamingPolicy.CamelCase.ConvertName(e.PropertyName))
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).Distinct().ToArray()))
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Datos inválidos",
                };
                break;
            case AplicacionException app:
                problema = new ProblemDetails { Status = app.Estado, Title = app.Titulo, Detail = app.Message };
                break;
            default:
                return false;
        }

        http.Response.StatusCode = problema.Status!.Value;
        return await problemas.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = http,
            ProblemDetails = problema,
            Exception = ex,
        });
    }
}
