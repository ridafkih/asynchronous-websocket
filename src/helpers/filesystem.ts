import { readdirSync } from "fs";
import { join } from "path";

/**
 * Imports default exported handlers.
 * @param path The to-be-joined directories relative to the src folder to import from.
 * @returns Promise which resolves the imports.
 */
export const importHandlers = <T>(...path: string[]) => {
  const directory = join(__dirname, "..", ...path);
  const handlers = readdirSync(directory).map((filename) =>
    join(directory, filename)
  );

  const imports: Promise<T[]> = Promise.all(
    handlers.map((handler) => {
      return import(handler).then(
        ({ default: defaultExport }) => defaultExport
      );
    })
  );

  return imports;
};
