// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

export const listKeys = ["id", "name"];

export const cardKeys = [
  "id",
  "name",
  "due",
  "start",
  "dueComplete",
  "idMembers",
  "idLabels",
  "address",
  "locationName",
  "coordinates",
];

export const aKeys = ["id", "name", "url"];

export const coverKeys = [
  "color",
  "attachmentPos",
  "unsplashUrl",
  "size",
  "brightness",
];

export const clKeys = ["id", "name"];

export const ciKeys = [
  "id",
  "name",
  "checked",
  "due",
  "dueReminder",
  "idMember",
];

export const cfiKeys = ["id", "idCustomField", "value", "idValue"];

export const sKeys = ["id", "image", "top", "left", "zIndex", "rotate"];
