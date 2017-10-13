import { expect } from 'chai';
import 'mocha';
import { requestRanking } from "../src/requestRanking";
import World from "../src/World";
import Category from "../src/Category";


describe('request ranking', () => {

    it('yukari bowman', async () => {

        const ranking = await requestRanking(World.YUKARI, Category.BOWMAN);
        expect(ranking.characters).to.have.lengthOf(100);

    });

    it('MNjoe-san', async () => {
        const ranking = await requestRanking(World.ALL, Category.ALL);
        const mnjoe = ranking.characters[0];
        expect(mnjoe.name).to.equal('MNjoe');
        expect(mnjoe.level).to.equal(250);
    });

});
