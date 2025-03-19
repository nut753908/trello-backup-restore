let attempt = 0;

const backoff = async () => {
  const backoff = Math.min(Math.pow(2, attempt) * 1000, 32000);
  const jitter = Math.random() * 1000;
  const sum = backoff + jitter;
  await new Promise((resolve) => setTimeout(resolve, sum));
};

export const withBackoff = async (func) => {
  const res = await func();
  if (res.status === 429) {
    await backoff();
    attempt += 1;
    return withBackoff(func);
  }
  if (
    res.headers.get("x-rate-limit-api-key-remaining") <= 100 ||
    res.headers.get("x-rate-limit-api-token-remaining") <= 50
  ) {
    await backoff();
    attempt += 1;
    return res;
  }
  attempt = 0;
  return res;
};
