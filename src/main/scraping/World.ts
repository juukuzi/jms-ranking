/**
 * ランキングサイトのPOSTパラメーター "ddlWorld" が取りうる値です。
 */
enum World {
    // ALL = 9999,
    KAEDE = 0,
    KURUMI = 1,
    YUKARI = 2,
    REBOOT = 45,
}


namespace World {

    export const map = new Map<string, World>();

    for (const key in World) {
        const value = World[key];
        if (typeof value === 'number') {
            map.set(key, value);
        }
    }

    export function keyOf(value: World): string {
        return World[value];
    }

    export function name(key: string): string {
        switch(key) {
            case 'KAEDE':
                return 'かえで';
            case 'KURUMI':
                return 'くるみ';
            case 'YUKARI':
                return 'ゆかり';
            case 'REBOOT':
                return 'リブート';
            default:
                throw 'unknown world key';
        }
    }

}


export default World;
