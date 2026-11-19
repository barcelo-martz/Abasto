import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const source = join(root, "packages", "brand", "assets");

const applications = ["web", "panel"];

for (const application of applications) {
  const destination = join(root, "apps", application, "public", "images", "brand");

  await mkdir(destination, { recursive: true });

  await cp(source, destination, {
    recursive: true,
    force: true,
  });

  console.log(`Assets de marca sincronizados: ${application}`);
}
