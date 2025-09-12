import app from "./app.js";
import {environment} from "./config/environment.js";
const PORT = environment.port;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

