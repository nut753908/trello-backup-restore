// cf: custom field
// cfo: custom field option
// a: attachment
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

export const labelKeys = ["name", "color"];

export const cfKeys = ["name", "type", "options"];

export const cfoKeys = ["value", "color"];

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

export const coverKeys = ["color", "url", "size", "brightness"];

export const clKeys = ["name"];

export const ciKeys = ["name", "checked", "due", "dueReminder", "idMember"];

export const cfiKeys = ["idCustomField", "value", "idValue"];

export const sKeys = ["image", "top", "left", "zIndex", "rotate"];
