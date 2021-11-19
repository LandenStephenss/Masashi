import './util/modifyEris.js';
import dotenv from 'dotenv';
import Client from './structures/Masashi.js';
dotenv.config({ path: 'config.env' });
const masashi = new Client(`Bot ${process.env['DISCORD_TOKEN']}`, {
  messageLimit: 0,
  defaultImageFormat: 'png',
  defaultImageSize: 1024,
  restMode: true
});
await masashi.start();
