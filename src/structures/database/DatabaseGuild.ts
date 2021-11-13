export interface Level {
  id: string,
  level: number,
  xp: number
}

export interface AutoModSettings {
  noNoWords: [],
  fastMsg: boolean,
  massMention: boolean,
  largeMessages: boolean,
  allCaps: boolean,
  invites: boolean,
  spoilers: boolean,
  duplicateText: boolean,
  allLinks: boolean,
  imageSpam: boolean,
  selfbotDetect: boolean,
  maxMentions: number,
  autoMuteTime: number,
  maxEmote: number,
  maxChars: number
}

export default class DatabaseGuild {
  data = {
    modlog: [],
    levels: [],
  };
  messages = {
    welcome: 'Welcome to {guild}, {user}!',
    leave: 'Bye {user}.',
  };
  settings = {
    prefix: process.env['PREFIX']!,
    moderation: {
      muteRole: null as number | null,
      modRole: null as number | null,
      adminRole: null as number | null,
    },
  };
  autoMod = {
    noNoWords: [],
    fastMsg: false,
    massMention: false,
    largeMessages: false,
    allCaps: false,
    invites: false,
    spoilers: false,
    duplicateText: false,
    allLinks: false,
    imageSpam: false,
    selfbotDetect: false,
    maxMentions: 5,
    autoMuteTime: 10000,
    maxEmote: 6,
    maxChars: 2000,
  };

  constructor(public _id: string) {}
}
