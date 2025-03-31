let i = -1;

const fullJitter = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.min(32000, 1000 * 2 ** i) * Math.random())
  );

export const backoff = async (func) => {
  i === -1 || (await fullJitter());
  const res = await func();
  if (res.status === 429) {
    i++;
    return backoff(func);
  }
  if (
    res.headers.get("x-rate-limit-api-key-remaining") <= 100 ||
    res.headers.get("x-rate-limit-api-token-remaining") <= 50
  ) {
    i++;
    return res;
  }
  i = -1;
  return res;
};
