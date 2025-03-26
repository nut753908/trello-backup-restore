let attempt = 0;

const fullJitter = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.min(32000, 1000 * 2 ** attempt) * Math.random())
  );

export const backoff = async (func, rateLimit = true) => {
  const res = await func();
  if (res.status === 429) {
    await fullJitter();
    attempt++;
    return backoff(func);
  }
  if (
    rateLimit &&
    (res.headers.get("x-rate-limit-api-key-remaining") <= 100 ||
      res.headers.get("x-rate-limit-api-token-remaining") <= 50)
  ) {
    await fullJitter();
    attempt++;
    return res;
  }
  attempt = 0;
  return res;
};
