import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';
import { MessageContent } from 'eris';
export default class Balance extends CurrencyCommand {
  constructor(public client: Client) {
    super({
      name: 'rich',
      description: 'View the richest people in the server',
    });
  }
  async run({ message }: CommandContext<this>) {
    if (message.channel.type != 0) {
      return;
    }
    const richest = await message.channel.guild.getRichUsers();
    const msg: MessageContent = {
      embed: {
        title: `Richest users in ${message.channel.guild.name}`,
        fields: [],
      },
    };

    for (const rich of richest) {
      msg.embed?.fields?.push({
        name: this.client.resolveUser(rich._id)?.username || rich._id,
        value: rich.currency.wallet.toString(),
      });
    }
    return msg;
  }
}
