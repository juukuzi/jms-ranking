/**
 * 多分これは直接は使わない。
 */
export interface User {

    /** ユーザーの表示名。多分マイページとかで使う。 */
    userName: string;

    /** Mapleのキャラクター名。 */
    characterName?: string;

    /** サーバー名。Worldのキー値のほう。 */
    world?: string;

    /** 職名。Categoryのキー値のほう。 */
    category?: string;
}


/**
 * 多分こっちだけ使う。
 */
export interface TwitterUser extends User {

    /** access token */
    token: string;

    /** access token secret */
    tokenSecret: string;
}
