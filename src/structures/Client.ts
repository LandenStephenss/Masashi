import { Client } from "eris";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Command from "./Command.js";
import { logger } from "../util/logger.js";
export default class Masashi extends Client {
  public commands: Map<string, Command>;
  public aliases: Map<string, string>;
  constructor(token: string) {
    super(token);
    this.commands = new Map();
    this.aliases = new Map();
  }

  start() {
    readdir(fileURLToPath(path.join(import.meta.url, "../../events"))).then(
      (events) => {
        events = events.filter((event) => !event.endsWith(".d.ts"));
        events.forEach((event) => {
          const eventName = event.split(".")[0];
          import(`../events/${eventName}.js`).then(({ default: event }) => {
            const _event = new event(this);
            this.on(eventName, (...args) => {
              _event.run(...args);
            });
          });
        });
      }
    );

    readdir(fileURLToPath(path.join(import.meta.url, "../../commands"))).then(
      (commands) => {
        commands = commands.filter((command) => !command.endsWith("d.ts"));
        commands.forEach((command) => {
          this.loadCommand(command);
        });
      }
    );
    this.connect();
  }

  private loadCommand(commandPath: string): void {
    if (commandPath.endsWith(".js")) {
      console.log(commandPath);
      import(`../commands/${commandPath}`).then(({ default: commandClass }) => {
        const CMD = new commandClass(this);
        this.commands.set(CMD.help.name, CMD);
        CMD.config.aliases.forEach((alias: string) => {
          this.aliases.set(alias, CMD.name);
        });
        logger.info(`${CMD.help.name} loaded!`)
      });
    } else {
      readdir(
        fileURLToPath(path.join(import.meta.url, "../../commands", commandPath))
      ).then((commands) => {
        commands = commands.filter((command) => !command.endsWith("d.ts"));
        commands.forEach((command) => {
          this.loadCommand(`${commandPath}/${command}`);
        });
      });
    }
  }
}
