import chalk from "chalk";

const dangerLevels = [chalk.green, chalk.yellow, chalk.red];

/**
 * Logs a message with a certain coloured prefix and level depending on parameters.
 * @param message The message to log to the console.
 * @param level THe amount of tabs to prefix with.
 * @param dangerLevel The danger level, determines the colour of the prefix.
 */
export const logMessage = (
  message: string,
  level: number = 0,
  dangerLevel: number = 0
) => {
  const color =
    dangerLevel > dangerLevels.length
      ? dangerLevels.length
      : Math.max(dangerLevel, 0);
  const prefix = " ".repeat(level * 2);
  console.log(
    `${prefix} ${dangerLevels[color]("::")} ${chalk.gray(message || "")}`
  );
};
