import * as sourceMapSupport from 'source-map-support';
import setupApplication from './src/setup';
import logger from './src/logger';

// スタックトレースとか読みやすくする。
sourceMapSupport.install();

const production = process.env.NODE_ENV === 'production';

// expressアプリケーションの設定
const app = setupApplication(production);

// ポートはデフォルトで8080番を使うらしい。
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}.`);
});
