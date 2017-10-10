
import { World, Category, encodeParams } from '../src/index';

describe('url encode test', () => {

    it('all', () => {
        const param = encodeParams(World.ALL, Category.ALL);
        expect(param).toBe('ddlWorld=9999&ddlJob=%E7%94%B7%E5%A5%B3%EF%BC%8B%E8%81%B7%E6%A5%AD%E5%85%A8%E4%BD%93');
    });

    it('yukari bowman', () => {
        const param = encodeParams(World.YUKARI, Category.BOWMAN);
        expect(param).toBe('ddlWorld=2&ddlJob=%E5%BC%93%E4%BD%BF%E3%81%84');
    });

});
