import { readdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { format } from "prettier";

export async function operateAndWrite(operation) {
  const packageJsons = await getPackageJsons();

  for (const packageJson of packageJsons) {
    const json = await read(packageJson);
    operation(json);
    await write(packageJson, json);
  }
}

export async function getPackageJsons() {
  const packages = await readdir("packages");
  return packages.map((path) => resolve("packages", path, "package.json"));
}

export async function read(filePath) {
  const content = await readFile(filePath);
  return JSON.parse(content);
}

export async function write(filePath, json) {
  const formattedContent = await format(JSON.stringify(json), {
    parser: "json-stringify",
  });
  await writeFile(filePath, formattedContent);
}
