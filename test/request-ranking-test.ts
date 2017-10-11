import { expect } from 'chai';
import 'mocha';
import { Category, requestRanking, World } from "../src/requestRanking";


describe('request ranking', () => {

    it('yukari bowman', async () => {

        const characters = await requestRanking(World.YUKARI, Category.BOWMAN);
        expect(characters).to.have.lengthOf(100);

    });

    it('MNjoe-san', async () => {

        const characters = await requestRanking(World.ALL, Category.ALL);
        const mnjoe = characters[0];
        expect(mnjoe.name).to.equal('MNjoe');
        expect(mnjoe.level).to.equal(250);

    });

});
