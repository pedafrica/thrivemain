import sequelize from "./config/sequelize.config";
import fastifyCaching from "@fastify/caching";
import fastifyCors from "@fastify/cors";
import closeWithGrace from "close-with-grace";
import dotenv from "dotenv";
import Fastify from "fastify";
import disableCache from "fastify-disablecache";

dotenv.config();

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
  // @ts-expect-error
  transport: { target: "pino-pretty" },
});

const urls = [
  // '*',
  "http://localhost:8081",
  "http://localhost",
  "http://192.168.88.57:8081",
  "https://thrivebizng.com",
  "http://thrivebizng.com",
  // 'http://54.82.227.240:3000',
  // 'http://54.82.227.240:6000',
  // 'http://54.82.227.240:80',
  // 'http://54.82.227.240:81',
  // 'http://54.82.227.240',
  // 'ec2-54-82-227-240.compute-1.amazonaws.com',
];
console.log(urls);

app.register(fastifyCors, {
  // origin: urls,
  // credentials: true,
});

app.register(fastifyCaching, { privacy: fastifyCaching.privacy.NOCACHE });

app.register(disableCache);

// Connect to the MongoDB database
(async () => {
  await sequelize.authenticate();
})();

// Register your application as a normal plugin.
app.register(import("./app"));

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace(
  { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || "") || 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  } as closeWithGrace.CloseWithGraceAsyncCallback
);

app.addHook("onClose", (instance, done) => {
  closeListeners.uninstall();
  done();
});

// Start listening.
app.listen(
  {
    port: parseInt(process.env.PORT || "") || 6000,
    host: "0.0.0.0",
    // ...(process.env.NODE_ENV == 'production' ? {} : { host: '192.168.88.57' }),
  },
  (err: any) => {
    // sequelize.sync({
    //   // alter: true,
    //   // force: true,
    // });
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
);
