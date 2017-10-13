/**
 * ランキングサイトのPOSTパラメーター "ddlJob" が取りうる値です。
 */
enum Category {
    ALL = '男女＋職業全体',
    MALE = '男',
    FEMALE = '女',
    WARRIOR = '戦士',
    MAGICIAN = '魔法使い',
    BOWMAN = '弓使い',
    THIEF = '盗賊',
    DUAL_BLADE = 'デュアルブレイド',
    PIRATE = '海賊',
    CANNONEER = 'キャノンマスター',
    JETT = 'ジェット',
    DAWN_WARRIOR = 'ソウルマスター',
    BLAZE_WIZARD = 'フレイムウィザード',
    WIND_ARCHER = 'ウインドシューター',
    NIGHT_WALKER = 'ナイトウォーカー',
    THUNDER_BREAKER = 'ストライカー',
    MIHILE = 'ミハエル',
    ARAN = 'アラン',
    EVAN = 'エヴァン',
    MERCEDES = 'メルセデス',
    PHANTOM = 'ファントム',
    LUMINOUS = 'ルミナス',
    SHADE = '隠月',
    BLASTER = 'ブラスター',
    BATTLE_MAGE = 'バトルメイジ',
    WILD_HUNTER = 'ワイルドハンター',
    MECHANIC = 'メカニック',
    DEMON_SLAYER = 'デーモンスレイヤー',
    DEMON_AVENGER = 'デーモンアヴェンジャー',
    XENON = 'ゼノン',
    KAISER = 'カイザー',
    // CADENA = 'カデナ',
    ANGELIC_BUSTER = 'エンジェリックバスター',
    HAYATO = 'ハヤト',
    KANNA = 'カンナ',
    ZERO = 'ゼロ',
    BEAST_TAMER = 'ビーストテイマー',
    KINESIS = 'キネシス',
    // ILLIUM = 'イリウム'
}


namespace Category {

    interface CategoryObject {
        /** key (ALPHABET) */
        name: string;
        /** Japanese */
        value: Category;
    }

    const list: CategoryObject[] = [];
    for (const key in Category) {
        const value = Category[key];
        if (typeof value === 'string' && /[A-Z_]+/.test(key)) {
            list.push({
                name: key,
                value: value as Category
            });
        }
    }

    export function asList(): CategoryObject[] {
        return list;
    }

    export function key(value: Category): string {
        return list.find(ca => ca.value === value)!.name;
    }

}


export default Category;
