let attempt = 0;

const fullJitter = async () => {
  const sleep = Math.min(32000, 1000 * 2 ** attempt) * Math.random();
  await new Promise((resolve) => setTimeout(resolve, sleep));
};

export const backoff = async (func) => {
  const res = await func();
  if (res.status === 200) {
    await fullJitter();
    attempt += 1;
    return backoff(func);
  }
  if (
    res.headers.get("x-rate-limit-api-key-remaining") <= 100 ||
    res.headers.get("x-rate-limit-api-token-remaining") <= 50
  ) {
    await fullJitter();
    attempt += 1;
    return res;
  }
  attempt = 0;
  return res;
};
