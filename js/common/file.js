export const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

export const selectFile = (accept = ".json") =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.hidden = true;
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    document.body.appendChild(input);
    input.click();
  });
