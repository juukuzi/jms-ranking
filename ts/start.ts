import * as sourceMapSupport from 'source-map-support';
import setupApplication from './src/setup';
import logger from './src/logger';

// タイムゾーンを日本にしておくよ
process.env.TZ = 'Asia/Tokyo';

// スタックトレースとか読みやすくする。
sourceMapSupport.install();

// expressアプリケーションの設定
const app = setupApplication();

// ポートはデフォルトで8080番を使うらしい。
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}.`);
});
