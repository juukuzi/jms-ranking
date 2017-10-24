import { Router } from 'express';

const indexRouter = Router();

// トップページへのリクエストに対応します。
indexRouter.get('/', (req, res) => {
    res.render('index', {
        title: 'Top',
        user: req.user
    });
});

export default indexRouter;
