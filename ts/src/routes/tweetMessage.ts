import User from "../datastore/User";
import World from "../scraping/World";
import Category from "../scraping/Category";
import ExpData from '../datastore/ExpData';


export default function tweetMessage(user: User): string {

    // ワールド名と職業名を取得
    const world: string = World.name(user.world!);
    const category: string = Category.map.get(user.category!)!;

    // とりあえずキャラ名とかの情報をいれる
    let message: string = `${user.characterName}（${world} / ${category}）`;

    if (user.expData.length < 2) {
        // 情報が2日分ないとき。サービス利用しはじめたところ？

        if (user.expData.length === 0) {
            // まったくない
            message += '\r\nまだ情報を取得していません。明日まで待ってね！';
        } else {
            // 1こだけあった
            const today = user.expData[0];
            message += `\r\nデータの取得を開始しました。\r\n現在のレベルは ${today.level} です。\r\n獲得経験値量は翌日以降算出されます。`;
        }

    } else {

        // 昨晩と一昨晩のデータを確認
        const today = user.expData[user.expData.length - 1];
        const yesterday = user.expData[user.expData.length - 2];

        // データの状況に応じてメッセージを組み立て
        if (yesterday.level) {
            if (today.level) {
                // どっちちゃんと情報はいってる

                // 十九字（ゆかり / 弓使い）
                // Gain : 151,251,251 exp
                // Level: 212 -> 213 UP!
                // Exp% : 12.22% -> 0.22%
                // #JMSRankingTweet

                message += `\r\nGain : ${Number(ExpData.diff(yesterday, today)).toLocaleString()} exp`;
                if (today.level > yesterday.level) {
                    message += `\r\nLevel: ${yesterday.level} -> ${today.level} UP!`;
                } else {
                    message += `\r\nLevel: ${today.level}`;
                }
                message += `\r\nExp% : ${ExpData.percentage(yesterday)}% -> ${ExpData.percentage(today)}%`;
            } else {
                // 今日分の情報がない。ランクアウトしたかな？
                message += '\r\n昨晩の情報取得に失敗しました。ランクアウト？';
            }
        } else {
            if (today.level) {
                // ランクインしたかな？
                message += '\r\n一昨晩の情報がありません。ランクイン？';
            } else {
                // どっちもない。
                message += '\r\n情報の取得に失敗しています。設定がおかしいか、ランクインしていません。';
            }
        }
    }

    message += '\r\n#JMSRankingTweet';

    return message;
}
