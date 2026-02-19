import { app } from "./server";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`4o-api listening on http://localhost:${env.PORT}`);
});
