// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

export const listKeys = ["name"];

export const cardKeys = [
  "name",
  "desc",
  "due",
  "start",
  "dueComplete",
  "idMembers",
  "idLabels",
  "address",
  "locationName",
  "coordinates",
];

export const aKeys = ["name", "url"];

export const coverKeys = [
  "color",
  "idAttachment",
  "unsplashUrl",
  "size",
  "brightness",
];

export const clKeys = ["name"];

export const ciKeys = ["name", "checked", "due", "dueReminder", "idMember"];

export const cfiKeys = ["idCustomField", "value", "idValue"];

export const sKeys = ["image", "top", "left", "zIndex", "rotate"];
