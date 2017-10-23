import Datastore = require('@google-cloud/datastore');


const datastore = new Datastore({});


/**
 * Twitter認証成功時に未登録だったらDatastoreに保存するよう。
 *
 * @param {string} id
 * @param {string} userName
 * @param {string} token
 * @param {string} tokenSecret
 * @returns {Promise<void>}
 */
export async function insertUserIfNotExists(id: string, userName: string, token: string, tokenSecret: string): Promise<void> {

    const transaction = datastore.transaction();
    await transaction.run();

    const key = datastore.key(['User', 'Twitter-' + id]);

    const userEntity = await datastore.get(key);

    if (!userEntity) {
        // 未登録のユーザーであれば新規
        await transaction.save({
            key,
            data: {
                userName,
                token,
                tokenSecret
            }
        });
    }

    await transaction.commit();

}
