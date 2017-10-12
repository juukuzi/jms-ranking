import * as request from 'request';
import * as cheerio from 'cheerio';
import { CharacterData } from './CharacterData';
import { World } from "./World";
import { Category } from "./Category";


/**
 * Hangameのランキングページにアクセスして、html文字列をもらってきます。
 *
 * @param world サーバーのやつ
 * @param category 職業とかのやつ
 * @returns HTML文字列とってくるPromise
 */
function fetchHTML(world: World, category: Category): Promise<string> {

    // あんまりこのURLをソースに埋め込むのはよくない気もするけれど
    // どうせURLが変わるようなことがあったら他の仕様もかわって使えなくなるしOK
    const RANKING_PAGE = 'http://hangame.maplestory.nexon.co.jp/ranking/ranking.asp';

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
 * 取得してきたHTMLからキャラクター情報を抜き出すやつ
 *
 * @param html 取得してきたhtml形式の文字列
 * @param date 取得日時
 * @returns キャラクター情報の配列
 */
function parseHTML(html: string, date: Date): CharacterData[] {

    // cheerio: Node.jsでjQueryぽくお手軽DOM解析できるやつ
    const $ = cheerio.load(html);

    // あんまりセマンティックじゃないけど、
    // 拾いやすい位置にクラスついてるのがいたのでそこから捕まえる（他にろくなのがない）
    const nameTDs = $('.color00659c');

    // 各要素からデータを抽出して配列にいれていくよ
    const characters: CharacterData[] = [];
    nameTDs.each((index, nameTDElement) => {

        const $name = $(nameTDElement);
        const name = $name.last().text();

        const $server = $name.next();
        const server = $server.text();

        const $job = $server.next();
        const job = $job.text();

        const $levelAndExp = $job.next();
        const levelAndExp = $levelAndExp.text()
            .replace(')', '')
            .split(' (');

        const level = parseInt(levelAndExp[0]);
        const exp = parseInt(levelAndExp[1]);

        characters.push({
            name,
            date,
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
        .then(html => parseHTML(html, new Date()));
}
