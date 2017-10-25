import { Router } from 'express';
import { Profile } from "passport-twitter";
import User from "../datastore/User";

const indexRouter = Router();

// トップページへのリクエストに対応します。
indexRouter.get('/', async (req, res) => {

    const profile: Profile | undefined = req.user;

    let user;

    if (profile) {
        user = await User.findById(profile.id);
    }

    res.render('index', {
        title: 'Top',
        user
    });

});

export default indexRouter;
