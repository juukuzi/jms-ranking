import User from "../datastore/User";
import World from "../scraping/World";
import Category from "../scraping/Category";
import ExpData from '../datastore/ExpData';

/**
 * @param user ツイートを生成する対象のユーザー情報
 * @returns ツイートするメッセージ。ツイートしないときは空文字列。
 */
export default function tweetMessage(user: User): string {

    // 週次設定になっているかどうか？
    const weekly = user.interval === "week";

    // 週次設定で、今日が月曜日以外だった場合はスキップ
    if (weekly && new Date().getDay() !== 1) return '';

    // 最終的につぶやかれるメッセージ。とりあえずキャラ名とかの情報をいれる
    let message: string = basicInformation(user);

    // 何日分集計していればツイートできるか。
    const requiredLength = weekly ? 8 : 2;

    if (user.expData.length < requiredLength) {
        // 必要な長さまで取得できていなければスキップ
        return '';

    } else {

        // 昨晩と一昨晩のデータを確認
        const current = user.expData[user.expData.length - 1];
        const previous = user.expData[user.expData.length - requiredLength];

        // データの状況に応じてメッセージを組み立て
        if (previous.level) {
            if (current.level) {
                // どっちもちゃんと情報はいってる

                // 十九字（ゆかり / 弓使い）
                // Day  : 11/7
                // Gain : 151,251,251 exp
                // Level: 212 -> 213 UP!
                // Exp% : 12.22% -> 0.22%
                // #JMSRankingTweet

                //
                message += weekly ?
                    `\r\nWeek : ${previous.date.getMonth() + 1}/${previous.date.getDate()}` :
                    `\r\nDay  : ${previous.date.getMonth() + 1}/${previous.date.getDate()}`;

                // 増加量を算出
                const diff = ExpData.diff(previous, current);

                if (inactive(user, diff)) {
                    // 差分があったときだけツイートするオプション
                    // 条件にかかったらスキップ
                    return '';
                }

                // 増加量メッセージ
                message += `\r\nGain : ${Number(diff).toLocaleString()} exp`;

                if (current.level > previous.level) {
                    // レベルアップしたとき
                    message += `\r\nLevel: ${previous.level} -> ${current.level} UP!`;

                    if (current.level === 250) {
                        message += `\r\nCongratulations!\r\nもう、経験値測定はできません。登録を解除するか、他キャラクターを設定してください。`;
                    }
                } else {
                    // レベルアップはしてないとき
                    if (current.level === 250) {
                        // カンストしたまんまだとツイートをスキップ
                        return '';
                    }

                    message += `\r\nLevel: ${current.level}`;
                }
                message += `\r\nExp% : ${ExpData.percentage(previous)}% -> ${ExpData.percentage(current)}%`;
            } else {
                // 今日分の情報がない。ランクアウトしたかな？
                message += '\r\n今回の情報取得に失敗しています。ランクアウト？\r\n\r\n（前回時点の情報）\r\n' + pointDataInformation(previous);
            }
        } else {
            if (current.level) {
                // ランクインしたかな？
                message += '\r\n前回分の情報取得に失敗しています。ランクイン？\r\n\r\n（今回取得した情報）\r\n' + pointDataInformation(current);
            } else {
                // どっちもない。
                message += '\r\n情報の取得に失敗しています。設定がおかしいか、ランクインしていません。';
            }
        }
    }

    message += '\r\n#JMSRankingTweet';

    return message;
}


function basicInformation(user: User): string {
    // ワールド名と職業名を取得
    const world: string = World.name(user.world!);
    const category: string = Category.map.get(user.category!)!;

    return `${user.characterName}（${world} / ${category}）`;
}

function pointDataInformation(data: ExpData): string {
    return `Level:${data.level}\r\nExp% :${ExpData.percentage(data)}%`
}

/**
 * @param user 調べる対象のユーザー
 * @param diff 計算した経験値増加量
 * @returns 閾値に達しておらず、ツイートしないときは `true`
 */
function inactive(user: User, diff: number): boolean {
    if (user.tweetOnlyActiveDay) {
        // アクティブな時だけツイートする設定が有効
        let threshold;
        if (user.threshold) {
            // 閾値設定がされているとき
            threshold = (user.threshold.value * user.threshold.order);
        } else {
            // されていなかったら１
            threshold = 1;
        }
        return diff < threshold;
    } else {
        // 設定されてなかったら問題なし
        return false;
    }
}