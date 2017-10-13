import Datastore = require('@google-cloud/datastore');
import Category from "./Category";
import World from "./World";
import PlayerCharacterData from "./PlayerCharacterData";
import RankingList from "./RankingList";


const datastore = new Datastore();


/**
 * @param dateString
 * @param worldKey
 * @param categoryKey
 * @param character
 * @returns Datastoreに保存する用のエンティティ
 */
function toEntity(dateString: string, worldKey: string, categoryKey: string, character: PlayerCharacterData) {
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
 * @param ranking
 */
export async function saveToDatastore(ranking: RankingList): Promise<void> {

    const {
        characters,
        dateString,
        worldKey,
        categoryKey
    } = ranking;

    const complete = characters
        .map(character => toEntity(dateString, worldKey, categoryKey, character))
        .map(entity => datastore.save(entity));

    await Promise.all(complete);

}
