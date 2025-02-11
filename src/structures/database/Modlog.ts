export enum Actions {
  'Ban' = 1,
  'Kick' = 2,
  'Unban' = 3,
  'Mute' = 4,
  'Soft-ban' = 5,
}

export default interface ModLog {
  case: number,
  reason: number,
  userID: string,
  time: number,
  type: Actions
}
