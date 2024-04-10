/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

import { resolve } from "path";
import {
  operateAndWrite,
  getPackageJsons,
  read,
  write,
} from "./packageJsons.mjs";

updateVersion();

async function updateVersion() {
  const [_, __, version] = process.argv;
  if (!isValidVersion(version)) {
    console.error("Invalid version!");
    process.exit(1);
  }

  await operateAndWrite((json) => {
    json["version"] = version;
  });

  const packageJsons = await getPackageJsons();
  const packageNames = new Set();
  for (const packageJson of packageJsons) {
    const { name } = await read(packageJson);
    packageNames.add(name);
  }

  const examplePackageJsonPath = resolve(".", "example", "package.json");
  const examplePackageJson = await read(examplePackageJsonPath);
  const dependencyProperties = ["dependencies", "devDependencies"];
  for (const deps of dependencyProperties) {
    if (!examplePackageJson[deps]) {
      continue;
    }
    for (const packageName of packageNames) {
      if (packageName in examplePackageJson[deps]) {
        examplePackageJson[deps][packageName] = version;
      }
    }
  }

  await write(examplePackageJsonPath, examplePackageJson);
}

function isValidVersion(version) {
  const regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}$/g;
  return regex.test(version);
}
