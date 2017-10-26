const table: number[] = require('../../../resources/exp-table.json').exp;


interface ExpData {
    /** 取得日時 */
    date: Date;
    /** レベル */
    level: number;
    /** そのレベルになってから取得した経験値 */
    exp: number;
}


namespace ExpData {

    function diff(from: ExpData, to: ExpData): number {
        let exp = to.exp - from.exp;
        for (let level = from.level; level < to.level; level++) {
            exp += table[level];
        }
        return exp;
    }

}
