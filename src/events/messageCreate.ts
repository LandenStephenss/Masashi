import Client from "../structures/Client.js";
import { Message } from "eris";
import Command from "../structures/Command.js";

export default class MessageEvent {
  constructor(public client: Client) {
    this.client = client;
  }

  async run(message: Message) {
    // do some leveling stuff up here, possibly automod idk depends;

    if (message.content.startsWith(process.env.PREFIX as string)) {
      let Command: any = message.content
        .split(" ")[0]
        .slice(process.env.PREFIX?.length)
        .toLowerCase();
      const Args = message.content.split(" ").slice(1);

      if (
        this.client.commands.has(Command) ||
        this.client.aliases.has(Command)
      ) {
        // @ts-ignore
        Command =
          this.client.commands.get(Command) ||
          this.client.commands.get(this.client.aliases.get(Command) as string);

        if (!process.env.DEVELOPERS?.split(",").includes(message.author.id)) {
          this.client.createMessage(message.channel.id, {
            embed: { title: "You must be a developer to run this command" },
          });
        } else if(!Command.config.enabled) {
            return
        } else {
            var res = await Command.run({
                message,
                args: Args
            })

            if(res) {
                if(res.embed && res.embed.color) {
                    res.embed.color = parseInt("B3EFB2", 16)
                }
                this.client.createMessage(message.channel.id, res);
            }
        }
      }
    }
  }
}
