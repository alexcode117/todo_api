import { config } from "./src/config/config.js";
import { app } from "./src/app.js";

async function startServer(){
  try {
    app.listen(config.port, () => {
      console.log(`Server is running on port🚀 ${config.port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
