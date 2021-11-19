import Client from '../../structures/Masashi.js';
import LevelCommand from '../../structures/categories/LevelCommand.js';
import { CommandContext } from '../../structures/Command.js';

export default class Level extends LevelCommand {
  constructor(public client: Client) {
    super({
      name: 'level',
      description: 'Check your level',
      aliases: ['lvl'],
    });
  }

  async run({message: { author }}: CommandContext<this>) {
    const user = author;
    const level = await user.getLevel();
    const xp = await user.getXP();
    return {
      embed: {
        author: {
          icon_url: user.dynamicAvatarURL(),
          name: user.username        
        },
        fields: [
          {
            name: 'Level',
            value: level.toString(),
            inline: true
          },
          {
            name: 'XP',
            value: xp.toString(),
            inline: true
          }
        ]
      }
    };
  }
}
