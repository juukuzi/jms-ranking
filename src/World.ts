/**
 * ランキングサイトのPOSTパラメーター "ddlWorld" が取りうる値です。
 */
enum World {
    ALL = 9999,
    KAEDE = 0,
    KURUMI = 1,
    YUKARI = 2,
    REBOOT = 45,
}


namespace World {

    interface WorldObject {
        /** ALPHABET */
        name: string;
        /** (number) */
        value: World;
    }

    export function asList(): WorldObject[] {
        const map: WorldObject[] = [];
        for (const key in World) {
            const value = World[key];
            if (typeof value === 'number') {
                map.push({
                    name: key,
                    value: value
                });
            }
        }
        return map;
    }

}


export default World;
