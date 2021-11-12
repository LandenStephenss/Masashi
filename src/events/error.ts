import Event from '../structures/Event.js';
import logger from '../util/logger.js';

export default class ErrorEvent extends Event {
  name = 'error';

  run(error: Error) {
    logger.info('an error occured!');
    console.log(error);
  }
}
