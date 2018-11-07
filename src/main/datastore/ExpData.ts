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
            throw new Error('empty exp data');
        }
    }

    /**
     * そのレベルの中で経験値が何パーセントたまっているか（小数点第２位まで・切り捨て）
     *
     */
    export function percentage(data: ExpData): number {
        if (data.level && data.exp !== undefined) {
            // 小数点第2位まで出したいので、とりあえず10000倍
            const x100 = ( data.exp / table[data.level] ) * 10000;
            // 要らない分を切り捨て
            const floored = Math.floor(x100);

            return floored / 100;
        } else {
            throw new Error('empty exp data');
        }
    }

}

export default ExpData;
