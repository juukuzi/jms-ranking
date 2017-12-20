/**
 * ランキングサイトのPOSTパラメーター "ddlJob" が取りうる値です。
 */
enum Category {
    // ALL = '男女＋職業全体',
    // MALE = '男',
    // FEMALE = '女',
    WARRIOR = '戦士',
    MAGICIAN = '魔法使い',
    BOWMAN = '弓使い',
    THIEF = '盗賊',
    DUAL_BLADE = 'デュアルブレイド',
    PIRATE = '海賊',
    CANNONEER = 'キャノンシューター',
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
    CADENA = 'カデナ',
    ANGELIC_BUSTER = 'エンジェリックバスター',
    HAYATO = 'ハヤト',
    KANNA = 'カンナ',
    ZERO = 'ゼロ',
    BEAST_TAMER = 'ビーストテイマー',
    KINESIS = 'キネシス',
    // ILLIUM = 'イリウム'
}


namespace Category {

    export const map = new Map<string, Category>();
    const reverseMap = new Map<Category, string>();

    for (const key in Category) {
        const value = Category[key];
        if (typeof value === 'string' && /[A-Z_]+/.test(key)) {
            map.set(key, value as Category);
            reverseMap.set(value as Category, key);
        }
    }

    export function key(value: Category): string {
        return reverseMap.get(value)!;
    }

}


export default Category;
