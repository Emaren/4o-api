import { app } from "./server";
import { env } from "./config/env";

// Bind explicitly so nginx -> 127.0.0.1:3380 is always stable.
// (Avoids localhost resolving to ::1 on some boots / environments.)
const HOST = process.env.HOST ?? "127.0.0.1";

app.listen(env.PORT, HOST, () => {
  console.log(`4o-api listening on http://${HOST}:${env.PORT}`);
});
