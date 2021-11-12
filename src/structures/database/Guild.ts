import type { Modlog } from './Modlog.js';

export interface Level {
  id: string,
  level: number,
  xp: number
}

export interface Guild {
  data: {
    modlog: Modlog[],
    levels: Level[]
  },
  messages: {
    welcome: string,
    leave: string
  },
  settings: {
    prefix: string,
    moderation: {
      muteRole: number | null,
      modRole: number | null,
      adminRole: number | null
    }
  },
  autoMod: {
    noNoWords: string[],
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
}
