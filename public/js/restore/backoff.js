let retryCount = 0;

const backoff = async () => {
  const backoff = Math.min(Math.pow(2, retryCount) * 1000, 32000);
  const jitter = Math.random() * 1000;
  const jitteredBackoff = backoff + jitter;
  await new Promise((resolve) => setTimeout(resolve, jitteredBackoff));
};

export const withBackoff = async (func) => {
  const res = await func();
  if (res.status === 429) {
    await backoff();
    retryCount += 1;
    return withBackoff(func);
  }
  if (
    res.headers.get("x-rate-limit-api-key-remaining") <= 100 ||
    res.headers.get("x-rate-limit-api-token-remaining") <= 50
  ) {
    await backoff();
    retryCount += 1;
    return res;
  }
  retryCount = 0;
  return res;
};
