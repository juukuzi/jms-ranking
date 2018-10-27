declare module '@google-cloud/connect-datastore' {
    import * as session from 'express-session';
    import Datastore = require('@google-cloud/datastore');
    type sessionType = typeof session;
    class DatastoreStore extends session.Store{
    }
    interface InitOptions {
        dataset: Datastore
    }
    function connectDatastore(session: sessionType): new (options: InitOptions) => DatastoreStore;
    export = connectDatastore;
}
