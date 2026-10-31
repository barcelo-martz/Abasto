using Abasto.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Abasto.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        var connection = new NpgsqlConnectionStringBuilder
        {
            Host = configuration["Database:Host"] ?? "localhost",
            Port = int.Parse(configuration["Database:Port"] ?? "5432"),
            Username = Require("POSTGRES_USER"),
            Password = Require("POSTGRES_PASSWORD"),
            Database = Require("POSTGRES_DB"),
        };

        services.AddDbContext<AbastoDbContext>(options =>
            options.UseNpgsql(connection.ConnectionString, npgsql => npgsql.UseNetTopologySuite()));

        return services;
    }

    private static string Require(string name) =>
        Environment.GetEnvironmentVariable(name)
        ?? throw new InvalidOperationException($"Falta la variable de entorno {name}. Revisa infra/.env");
}