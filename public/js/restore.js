import { APP_KEY } from "/js/env.js";

var upload = function () {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json"; // NOTE: change to ".zip" later
    input.addEventListener(
      "change",
      function () {
        resolve(this.files[0]);
      },
      false
    );
    input.click();
  });
};

var read = function (file) {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        resolve(reader.result);
      },
      false
    );
    reader.readAsText(file);
  });
};

var restore = function (text) {
  console.log(text);
};

export var uploadFileAndRestore = async function (t) {
  const file = await upload();
  t.closePopup();
  const text = await read(file);
  await restore(text);
};

export var restoreBoardButtonCallback = async function (t) {
  await t
    .getRestApi()
    .getToken()
    .then(async function (token) {
      if (/^[0-9a-fA-Z]{76}$/.test(token)) {
        await t.popup({
          title: "Restore",
          url: "/restore.html",
          height: 40,
        });
      } else {
        await t.popup({
          title: "Authorize",
          url: "/authorize.html",
          height: 40,
        });
      }
    });
};
