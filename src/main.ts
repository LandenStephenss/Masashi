import * as dotenv from 'dotenv';
import Client from './structures/Client.js';
dotenv.config({ path: 'config.env' });
new Client(process.env.DISCORD_TOKEN as string)
  .start();
