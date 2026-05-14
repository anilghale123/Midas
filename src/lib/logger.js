import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "midas-cms" },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        headers: { "user-agent": req.headers?.["user-agent"] },
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
    err: pino.stdSerializers.err,
  },
  transport: isDev
    ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss" } }
    : undefined,
});
