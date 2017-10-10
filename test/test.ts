import {Category, requestRanking, World} from "../src";

requestRanking(World.YUKARI, Category.BOWMAN)
    .then(characters => console.log(characters));
