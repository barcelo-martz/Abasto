using Abasto.Infrastructure;
using Abasto.Infrastructure.Persistence;

LoadEnvFile();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/health", async (AbastoDbContext db, CancellationToken ct) =>
{
    var dbUp = await db.Database.CanConnectAsync(ct);
    var body = new { status = dbUp ? "ok" : "degraded", database = dbUp ? "up" : "down" };
    return dbUp ? Results.Ok(body) : Results.Json(body, statusCode: 503);
})
.WithName("Health")
.WithTags("Sistema");

app.UseHttpsRedirection();


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

