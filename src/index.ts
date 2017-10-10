import * as request from 'request';
import * as cheerio from 'cheerio';


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
    // ILLIUM = 'イリウム'
}


const RANKING_PAGE = 'http://hangame.maplestory.nexon.co.jp/ranking/ranking.asp';


function fetchHTML(world: World, category: Category): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const options: request.Options = {
            uri: RANKING_PAGE,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'ddlWorld': world,
                'ddlJob': category
            }
        };
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}


/**
 * その日のキャラクターの情報
 */
export interface CharacterData {
    // image: string
    name: string;
    server: string;
    job: string;
    level: number;
    exp: number;
}


/**
 * 取得してきたHTMLからキャラクター情報を抜き出すやつ
 *
 * @param html文字列
 * @returns キャラクター情報の配列
 */
function parseHTML(html: string): CharacterData[] {
    const $ = cheerio.load(html);
    const nameTDs = $('.color00659c');
    const characters: CharacterData[] = [];
    nameTDs.each((index, nameTDElement) => {

        const $name = $(nameTDElement);
        const name = $name.last().text();

        const $server = $name.next();
        const server = $server.text();

        const $job = $server.next();
        const job = $job.text();

        const $levelAndExp = $job.next();
        const levelAndExp = $levelAndExp.text().split(' (');

        const level = parseInt(levelAndExp[0]);
        const exp = parseInt(levelAndExp[1].replace(')', ''));

        characters.push({
            name,
            server,
            job,
            level,
            exp
        });
    });

    return characters;
}


/**
 * 指定された検索条件でのランキングを取得します。
 *
 * @param world サーバー条件
 * @param category 職業などの条件
 * @returns キャラクター情報の配列をとってくるPromiseオブジェクト
 */
export function requestRanking(world: World, category: Category): Promise<CharacterData[]> {
    return fetchHTML(world, category)
        .then(html => parseHTML(html));
}
