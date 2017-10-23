import setupApplication from "./src/setup";
import logger from "./src/logger";

const app = setupApplication();

// ポートはデフォルトで8080番を使うらしい。
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});
