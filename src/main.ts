import dotenv from 'dotenv';
import Client from './structures/Masashi.js';

dotenv.config({ path: 'config.env' });

const masashi = new Client(process.env['DISCORD_TOKEN'] as string);

masashi.start();
