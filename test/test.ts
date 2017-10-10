import {Category, fetchHTML, parseHTML, World} from "../src";

fetchHTML(World.YUKARI, Category.BOWMAN)
    .then(html => {
        const characters = parseHTML(html);
        console.log(characters);
    });
