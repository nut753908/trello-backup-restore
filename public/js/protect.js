let busy = false;

export const protect = (func) => async (t) => {
  if (busy) {
    return;
  }
  busy = true;
  await Promise.all([
    new Promise((resolve) => setTimeout(resolve, 500)),
    func(t),
  ]).finally(() => {
    busy = false;
  });
};
