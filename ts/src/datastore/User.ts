import datastore from './datastore';
import logger from '../logger';
import config from '../config';
import ExpData from './ExpData';


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

    /** 無効化されてたらtrue */
    disabled: boolean;

    /** 経験値情報の配列 */
    expData: ExpData[];

    /** アクティブなときだけつぶやくかどうか設定 */
    tweetOnlyActiveDay?: boolean;
}


namespace User {

    /** ユーザー型っぽいことを確認するための適当なタイプガード */
    function isUser(object: any): object is User {
        return object &&
            object.hasOwnProperty('id') &&
            object.hasOwnProperty('userName') &&
            object.hasOwnProperty('token') &&
            object.hasOwnProperty('tokenSecret') &&
            object.hasOwnProperty('disabled') &&
            object.hasOwnProperty('expData');
    }

    /**
     * @param id TwitterのID値（数字）の文字列
     * @returns 見つかったらUser なかったらエラー
     */
    export async function findById(id: string): Promise<User | undefined> {

        const key = datastore.key(['User', id]);

        const result = await datastore.get(key);

        const user = result[0];

        if (isUser(user)) {
            return user;

        } else if(user === void 0) {
            return undefined;

        } else {
            throw { message: 'user format is wrong', user };

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

        // idをkye値に使うよ
        const key = datastore.key(['User', id]);

        // とりあえず保存されているものがあるか探すよ
        const result = await datastore.get(key);
        const entity = result[0];
        let user: User;

        if (isUser(entity)) {
            // とってこれた　＝　登録済みならそれに上書き
            user = {
                ...entity,
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
                tokenSecret,
                disabled: true,
                expData: []
            };
        }

        // 保存しておく
        await datastore.upsert({
            key,
            data: user
        });

        return user;

    }


    /**
     * @param user 更新するユーザー情報
     * @returns 終わったときよう
     */
    export async function update(user: User): Promise<void> {

        const key = datastore.key(['User', user.id]);

        await datastore.update({
            key,
            data: user
        });

    }


    /**
     * Datastoreに保存されている有効な全ユーザーを取得してきます。
     * @returns Datastoreに保存されているユーザー取ってくるやつ
     */
    export async function findAll(): Promise<User[]> {

        const query = datastore.createQuery('User')
            .filter('disabled', '=', false)
            .order('world')
            .order('category');

        const result = await datastore.runQuery(query);
        const entities = result[0];

        const users: User[] = [];

        entities.forEach(entity => {
            if (isUser(entity)) users.push(entity);
            else logger.warn('found strange user entity', entity);
        });

        return users;

    }

    export function pushExpData(user: User, expData: ExpData): void {
        user.expData.push(expData);
        while (user.expData.length >= config.daysToKeepExpData) {
            user.expData.shift();
        }
    }

}


export default User;
