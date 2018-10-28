import Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({
    projectId: 'jms-ranking-tweet'
});

export default datastore;
