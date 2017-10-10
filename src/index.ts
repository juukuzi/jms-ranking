/**
 * POSTパラメーター "ddlWorld" が取りうる値です。
 */
export enum World {
    ALL = 9999,    
    KAEDE = 0,
    KURUMI = 1,
    YUKARI = 2,
    REBOOT = 45,
}

/**
 * POSTパラメーター "ddlJob" が取りうる値です。
 */
export enum Category {
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
    // Illium = 'イリウム'
}

/**
 * 引数で指定された情報を、ハンゲーム側のランキングページが受け付ける形式に整形します。
 * 
 * @param world ddlWorldに格納する値
 * @param category ddlJobに格納する値
 */
export function encodeParams(world: World, category: Category): string {
    return 'ddlWorld=' + encodeURIComponent(String(world)) +
     '&ddlJob=' + encodeURIComponent(category);
}
