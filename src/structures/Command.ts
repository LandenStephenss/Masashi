export default class Command {
  public help: Object;
  public config: Object;
  constructor({
    name = "Command",
    description = "N/A",
    usage = "{c}",
    category = "Miscellaneous",
    cooldown = 3000,
    aliases = new Array(),
    nsfw = false,
    developer = false,
    enabled = true,
  }) {
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

}
