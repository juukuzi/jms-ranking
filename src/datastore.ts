import Datastore = require('@google-cloud/datastore');
import Category from "./Category";
import World from "./World";
import CharacterData from "./CharacterData";


const datastore = Datastore();


/**
 * @param dateString
 * @param worldKey
 * @param categoryKey
 * @param character
 * @returns Datastoreに保存する用のエンティティ
 */
function toEntity(dateString: string, worldKey: string, categoryKey: string, character: CharacterData) {
    return {
        key: datastore.key([
            'Date', dateString,
            'World', worldKey,
            'Category', categoryKey,
            'Character', character.name,
        ]),
        data: {
            level: character.level,
            exp: character.exp
        }
    };
}


/**
 * @param date 取得日を表す文字列。Date.prototype.toDateString()の値
 * @param characters 保存するキャラクターのリスト
 * @param worldKey ワールドを表す文字列。enumのキー名のほう
 * @param categoryKey 職業等の分類を表す文字列。enumのキー名のほう
 */
export function saveToDatastore(
    date: string, characters: CharacterData[],
    worldKey: string, categoryKey: string): void {

    characters
        .map(character => toEntity(date, worldKey, categoryKey, character))
        .forEach(entity => datastore.save(entity));

}
