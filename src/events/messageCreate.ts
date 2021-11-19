import { Message, MessageContent, TextChannel } from 'eris';
import Event from '../structures/Event.js';
import logger from '../util/logger.js';
import levels from '../util/levels.js';

const noXP: Set<string> = new Set();
const usersInChannel: Map<string, string[]> = new Map();
let dropActive = false;

export default class MessageCreateEvent extends Event {
  name = 'messageCreate';

  // async handleLeveling(user) {
  //   const randomXP = Math.floor(Math.random() * 10);

  // }
  async handleLeveling(message: Message<TextChannel>) {
    const user = message.author;
    const randomXP = Math.floor(Math.random() * (25 - 15)) + 15;

    if(!noXP.has(user.id)) {
      noXP.add(user.id);
      const userXP = await user.getXP() + randomXP;
      const userLevel = await user.getLevel();
      const currentLevel = levels[userLevel];   
      await user.addXP(randomXP);
      if(userXP > currentLevel.overallXP) {
        await user.increaseLevel();
        const lvlUp = await this.createMessages(
          message, 
          `You're now level **${userLevel + 1}**!`
        );
        setTimeout(() => this.deleteMessages(message.channel.id, lvlUp), 15000);
      }
      setTimeout(() => {
        noXP.delete(user.id);
      }, 60000);
    }

    // if(!noXP.has(user.id)) {
    //   noXP.add(user.id);
    //   user.addXP(randomXP);
    //   const userXP = await user.getXP();
    //   const userLevel = await user.getLevel();
    //   const nextLevel = levels[userLevel + 1];
    //   let lvlUp: Message<TextChannel>[];
    //   console.log(nextLevel);
    //   if(userXP > nextLevel.xp) {
    //     await user.increaseLevel();
    //     lvlUp = await this.createMessages(
    //       message,
    //       `You're now level **${nextLevel.level}**!`
    //     );
    //   }
    //   setTimeout(() => {
    //     noXP.delete(user.id);
    //     if (lvlUp) {
    //       this.deleteMessages(message.channel.id, lvlUp);
    //     }
    //   }, 5000);
    // }
  }

  async startDrop(message: Message<TextChannel>, multiplier: number) {
    dropActive = true;
    const grab = `${await message.channel.guild.getPrefix()}grab`;

    const timeout = 5000 - multiplier * 250;
    const warningMessage = await this.createMessages(
      message,
      `A coin drop appeared! Type \`${grab}\` to grab it! The coin drop will` +
        ` disappear in ${timeout / 1000} seconds!`,
      false
    );

    const collected = await this.client
      .awaitMessage(
        (msg) => !message.author.bot && msg.content.toLowerCase() === grab,
        timeout
      )
      .catch(() => null);

    await this.deleteMessages(message.channel.id, warningMessage);

    if (!collected) {
      await this.createMessages(message, 'The coin drop got away...', false);
    }
    else {
      const coinDrop = Math.floor(Math.random() * (225 - 275)) + 225;
      const amount = coinDrop + Math.floor(coinDrop / 10) * multiplier;
      await this.createMessages(collected, {
        content: `You grabbed the coin drop and gained ${amount} coins!`,
        // messageReference: {
        //   messageID: collected.id,
        // },
      });
      await collected.author.addCoins(amount);
    }
    dropActive = false;
  }

  manageDrops(message: Message<TextChannel>) {
    let userIDs = usersInChannel.get(message.channel.id)!;
    if (!userIDs) {
      usersInChannel.set(message.channel.id, (userIDs = []));
    }
    if (!userIDs.includes(message.author.id)) {
      userIDs.push(message.author.id);
      setTimeout(() => {
        usersInChannel.set(
          message.channel.id,
          userIDs.filter((userID) => userID !== message.author.id)
        );
      }, 300000);
    }
    const multiplier = userIDs.length > 10 ? 10 : userIDs.length;

    if (!dropActive && Math.floor(Math.random() * 200) < 5 + multiplier) {
      this.startDrop(message, multiplier);
    }
  }

  async run(message: Message<TextChannel>) {
    if (message.author.bot || message.channel.type !== 0) {
      return;
    }
    const isBlacklisted = await message.author.isBlacklisted();
    if (isBlacklisted) {
      return;
    }

    try {
      queueMicrotask(() => {
        this.manageDrops(message);
        this.handleLeveling(message);
      });
    }
    catch (e) {
      console.error(e);
    }

    const prefix = await message.channel.guild.getPrefix()!;
    if (!message.content.startsWith(prefix)) {
      return;
    }

    const content = message.content.substring(prefix.length);
    const matches = content.matchAll(/('.+?'|".+?"|`.+?`)|[\S]+/g);

    const commandName: string = matches.next().value?.[0].toLowerCase();
    if (!commandName) {
      return;
    }
    const command = this.client.resolveCommand(commandName);
    if (!command) {
      return;
    }

    logger.info(
      `\u001b[34m${
        message.author.username
      } \u001b[37m(\u001b[34m${
        message.author.id
      }\u001b[37m) \u001b[37mran command \u001b[34m${
        command.help.name
      }\u001b[37m "\u001b[34m${message.content}\u001b[37m"`
    );

    const contextArgs: Record<string, unknown> = {};

    for (const commandArgName in command.args) {
      const arg: RegExpMatchArray = matches.next().value;
      const commandArg = command.args[commandArgName];

      if (!arg) {
        if (!commandArg.optional) {
          await this.createMessages(
            message,
            await commandArg.onMissing?.(message)
            ?? `Missing argument \`${commandArgName}\`!`
          );
          return;
        }
        break;
      }

      const argInput = commandArg.matchRest
        ? content.slice(arg.index)
        : arg[1]?.slice(1, -1) ?? arg[0];

      const value = await commandArg.resolve(argInput, message);
      if (!((await commandArg.validate?.(value, message)) ?? true)) {
        await this.createMessages(
          message,
          await commandArg.onFail?.(value, argInput, message) ??
          `The input you provided for \`${commandArgName}\` is invalid!`
        );
        return;
      }

      contextArgs[commandArgName] = value;

      if (commandArg.matchRest) {
        break;
      }
    }

    const context = {
      args: contextArgs,
      message,
      invokedAs: commandName,
    };

    const middlewareResult = await command.middleware(context);
    if (middlewareResult !== true) {
      if (middlewareResult !== false) {
        await this.createMessages(message, middlewareResult);
      }
      return;
    }

    const result = await command.run(context);
    if (!result) {
      return;
    }
    
    await this.createMessages(message, result);
  }

  async createMessages(
    message: Message,
    data: MessageContent,
    reference: boolean = true
  ): Promise<Message<TextChannel>[]> {
    const content = typeof data === 'string' ? data : data.content;
    const chunks = content?.match(/[\s\S]{1,2000}/g);

    if (typeof data !== 'string' && data.embed && !data.embed.color) {
      data.embed.color = 12202546;
    }
    const sent = [];

    const msgData = {
      ...(typeof data === 'string' ? undefined : data),
      content: chunks?.shift(),
    };

    if (reference) {
      msgData.messageReference = {
        messageID: message.id,
      };
    }

    sent.push(await this.client.createMessage(message.channel.id, msgData));

    for (const chunk of chunks ?? []) {
      sent.push(await this.client.createMessage(message.channel.id, chunk));
    }

    return sent as Message<TextChannel>[];
  }

  deleteMessages(channelID: string, messages: Message[], reason?: string) {
    const messagesToDelete = messages.map((message) => message.id);
    return this.client.deleteMessages(channelID, messagesToDelete, reason);
  }
}
