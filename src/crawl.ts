import Category from "./Category";
import World from "./World";
import requestRanking from "./requestRanking";
import logger from "./logger";


/**
 * 全部のランキングをクローリングしてDatastoreに保存していきます。
 *
 * @returns おわったとき用のやつ
 */
async function crawl(): Promise<void> {
    // 各サーバーと職種の組み合わせ全部やっていく
    for (const world of World.map.values()) {
        for (const category of Category.map.values()) {

            logger.debug(`request ${world}:${category}`);

            const ranking = await requestRanking(world, category);
            // TODO: 取得したランキングの保存

            logger.debug(`complete ${world}:${category}`);

        }
    }
}


export default crawl;
