import { Category, requestRanking, World } from "../src/requestRanking";
import { CharacterData } from "../src/CharacterData";

// とりあえず関数呼び出ししてコンソールにだしてみるテスト
// TODO: ちゃんとしたユニットテスト化
requestRanking(World.YUKARI, Category.BOWMAN)
    .then((characters: CharacterData[]) => console.log(characters));
