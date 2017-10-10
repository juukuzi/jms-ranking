import { Category, requestRanking, World } from "../src";

// とりあえず関数呼び出ししてコンソールにだしてみるテスト
// TODO: ちゃんとしたユニットテスト化
requestRanking(World.YUKARI, Category.BOWMAN)
    .then(characters => console.log(characters));
