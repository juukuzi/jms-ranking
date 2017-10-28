import { expect } from 'chai';
import 'mocha';
import ExpData from "../src/datastore/ExpData";

describe('ExpData', () => {

    const data1: ExpData = {
        date: new Date(),
        level: 211,
        exp: 0
    };

    const data2: ExpData = {
        date: new Date(),
        level: 212,
        exp: 18158366458
    };

    const data3: ExpData = {
        date: new Date()
    };

    it('diff', () => {
        expect(ExpData.diff(data1, data2)).to.equal(25590600805 + 18158366458);
        expect(() => ExpData.diff(data1, data3)).to.throw('empty exp data');
    });

    it('percentage', () => {
        expect(ExpData.percentage(data1)).to.equal(0);
        expect(ExpData.percentage(data2)).to.equal(66.94);
        expect(() => ExpData.percentage(data3)).to.throw('empty exp data');
    });
});
