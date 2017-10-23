import { Profile } from 'passport-twitter';
import {insertUserIfNotExists} from "./datastore/datastore";
import logger from "./logger";

export default function onAuth(token: string, tokenSecret: string, profile: Profile , done: (err: any, user?: any)=>void) {
    insertUserIfNotExists(profile.id, profile.username, token, tokenSecret)
        .then(() => done(null, profile))
        .catch(err => logger.error(err));
}
