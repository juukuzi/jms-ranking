const table: number[] = require('../../../resources/exp-table.json').exp;


interface ExpData {
    /** 取得日時 */
    date: Date;
    /** レベル */
    level?: number;
    /** そのレベルになってから取得した経験値 */
    exp?: number;
}


namespace ExpData {

    /**
     * どちらの経験値データもデータの取得に成功（ランキングにのっている）必要があります。
     *
     * @param from
     * @param to
     * @returns 経験値の変位
     */
    export function diff(from: ExpData, to: ExpData): number {
        if (from.level && to.level) {
            // 両方とも経験値データが入っていたとき
            let exp = to.exp! - from.exp!;
            for (let level = from.level; level < to.level; level++) {
                exp += table[level];
            }
            return exp;
        } else {
            throw new Error('');
        }
    }

}


export default ExpData;
