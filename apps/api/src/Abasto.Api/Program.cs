using Abasto.Infrastructure;
using Abasto.Infrastructure.Persistence;

LoadEnvFile();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

var corsOrigins = builder.Configuration["CORS_ORIGINS"]
    ?? (builder.Environment.IsDevelopment()
        ? "http://localhost:3000,http://localhost:3001"
        : throw new InvalidOperationException("Falta CORS_ORIGINS. Revisa infra/.env"));

var allowedOrigins = corsOrigins
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy => policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.MapGet("/health", async (AbastoDbContext db, CancellationToken ct) =>
{
    var dbUp = await db.Database.CanConnectAsync(ct);
    var body = new { status = dbUp ? "ok" : "degraded", database = dbUp ? "up" : "down" };
    return dbUp ? Results.Ok(body) : Results.Json(body, statusCode: 503);
})
.WithName("Health")
.WithTags("Sistema");

var api = app.MapGroup("/api");

app.Run();

static void LoadEnvFile()
{
    var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
    while (dir is not null)
    {
        var path = Path.Combine(dir.FullName, "infra", ".env");
        if (File.Exists(path))
        {
            foreach (var raw in File.ReadAllLines(path))
            {
                var line = raw.Trim();
                if (line.Length == 0 || line.StartsWith('#')) continue;

                var i = line.IndexOf('=');
                if (i <= 0) continue;

                var key = line[..i].Trim();
                var value = line[(i + 1)..].Trim().Trim('"');
                if (Environment.GetEnvironmentVariable(key) is null)
                    Environment.SetEnvironmentVariable(key, value);
            }
            return;
        }
        dir = dir.Parent;
    }
}

public partial class Program;
