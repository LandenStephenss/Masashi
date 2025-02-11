import type { Message, MessageContent, TextChannel } from 'eris';
import type Masashi from './Masashi.js';

export interface CommandData {
  name: string,
  description?: string,
  usage?: string,
  category?: string,
  cooldown?: number,
  aliases?: string[],
  nsfw?: boolean,
  developer?: boolean,
  enabled?: boolean
}

export default abstract class Command {
  args: Record<string, CommandArgument> = {};
  help;
  config;

  constructor({
    name,
    description = 'N/A',
    usage = '{c}',
    category = 'Miscellaneous',
    cooldown = 3000,
    aliases = [],
    nsfw = false,
    developer = false,
    enabled = true,
  }: CommandData) {
    this.help = {
      name,
      description,
      usage,
      category,
    };
    this.config = {
      cooldown,
      aliases,
      nsfw,
      developer,
      enabled,
    };
  }
  abstract run(
    context: CommandContext<this>
  ): void | MessageContent | Promise<void | MessageContent>;

  middleware(
    context: CommandContext<this>
  ): boolean | MessageContent | Promise<boolean | MessageContent>;
  middleware() {
    return true;
  }
}

export type ExtendedCommand = new (client: Masashi) => Command;

export interface CommandArgument {
  description?: string,
  resolve: (input: string, message: Message) => unknown,
  validate?: (value: unknown, message: Message) => boolean | Promise<boolean>,
  /** The input failed the valid function */
  onFail?: (value: unknown, input: string, message: Message) =>
  MessageContent | Promise<MessageContent>,
  /** The response to a missing argument (only if NOT optional aka required) */
  onMissing?: (message: Message) => MessageContent | Promise<MessageContent>,
  matchRest?: boolean,
  optional?: boolean
}

export interface CommandContext<T extends Command> {
  message: Message<TextChannel>,
  args: {
    [k in keyof T['args']]: ReturnType<T['args'][k]['resolve']>;
  },
  invokedAs: string
}
