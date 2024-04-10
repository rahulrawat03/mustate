import { operateAndWrite } from "./packageJsons.mjs";

operateAndWrite((json) => {
  json["main"] = "dist/main.js";
  json["types"] = "dist/main.d.ts";
  json["files"] = ["dist"];
});
