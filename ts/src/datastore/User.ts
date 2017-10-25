import datastore from './datastore';


/**
 * サービスに登録してくれているユーザーの情報です。
 */
interface User {

    /** TwitterのID（数字） */
    id: string;

    /** Twitterのアカウント名。多分マイページとかで使う。 */
    userName: string;

    /** Mapleのキャラクター名。 */
    characterName?: string;

    /** サーバー名。Worldのキー値のほう。 */
    world?: string;

    /** 職名。Categoryのキー値のほう。 */
    category?: string;

    /** access token */
    token: string;

    /** access token secret */
    tokenSecret: string;
}


namespace User {

    /** ユーザー型っぽいことを確認するための適当なタイプガード */
    function isUser(object: any): object is User {
        return object && object.userName;
    }

    /**
     * @param id TwitterのID値（数字）の文字列
     * @returns 見つかったらUser なかったらエラー
     */
    export async function findById(id: string): Promise<User> {

        const key = datastore.key(['User', id]);

        const user = await datastore.get(key);

        if (isUser(user)) {
            return user;

        } else {
            throw { message: 'undefined user', user };

        }
    }


    /**
     * @param id TwitterのID値（数字）の文字列
     * @param userName アットマークは外したやつ。十九字@Juukuzi -> Juukuzi
     * @param token twitter access token
     * @param tokenSecret twitter access token secret
     * @returns 既に登録してある場合はそのUserを取得、なかったら新しく作成したUser
     */
    export async function signUp(id: string, userName: string, token: string, tokenSecret: string): Promise<User> {

        // 食い違いがあったらいけないのでトランザクション使う
        const transaction = datastore.transaction();
        await transaction.run();

        // idをkye値に使うよ
        const key = datastore.key(['User', id]);

        // とりあえず保存されているものがあるか探すよ
        const entity = await datastore.get(key);
        let user: User;

        if (isUser(entity)) {
            // とってこれた　＝　登録済みならそれに上書き
            user = {
                id: entity.id,
                characterName: entity.characterName,
                world: entity.world,
                category: entity.category,
                userName,
                token,
                tokenSecret
            };
        } else {
            // なかったときは新しく作成
            user = {
                id,
                userName,
                token,
                tokenSecret
            };
        }

        // 保存しておく
        await transaction.upsert({
            key,
            data: user
        });

        // コミットして終わったら返却
        await transaction.commit();

        return user;

    }

}


export default User;
