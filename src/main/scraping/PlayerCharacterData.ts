/**
 * ある特定の日に取得した時点でのキャラクターの情報
 */
interface PlayerCharacterData {
    // image: string    // アバター画像は多分使わないから取得しない

    /**
     * キャラクター名
     */
    name: string;

    /**
     * サーバー名
     */
    server: string;

    /**
     * 職業名
     */
    job: string;

    /**
     * レベル
     */
    level: number;

    /**
     * （そのレベルになってから獲得した）経験値
     */
    exp: number;

}


export default PlayerCharacterData;
