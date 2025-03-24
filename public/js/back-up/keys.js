// m: member
// cf: custom field
// cfo: custom field option
// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

export const boardKeys = ["id", "name", "members", "labels", "customFields"];

export const mKeys = ["id", "fullName", "username"];

export const labelKeys = ["id", "name", "color"];

export const cfKeys = ["id", "name", "type", "options"];

export const cfoKeys = ["id", "value", "color"];

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
  "idAttachment",
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
