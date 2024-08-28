import {getJson} from "@/components/dataService.js";

let HEROES_JSON
let ITEMS_TYPE

export async function calendarByTime(timestamp) {

    HEROES_JSON = await getJson("heroes");
    ITEMS_TYPE = await getJson("itemType");
    // console.log(HEROES_JSON)
    // console.log(ITEMS_TYPE)


    let heroesList_one;
    heroesList_one = getHeroesListByTime(timestamp);

    // console.log(heroesList_one)

    return heroesList_one;

}

function getHeroesListByTime(timestamp) {


    let heroList = getHeroes(HEROES_JSON, timestamp);

    let heroDict
    heroDict = {}
    for (let i = 0; i < heroList.length; i++) {
        let heroId = heroList[i];

        let itemTypes = HEROES_JSON[heroId]["bulkTypes"].split(",");

        heroDict[heroId] = {"type": [], "rawType": []}
        for (let idx in itemTypes) {
            let type = itemTypes[idx];
            let rawType = ITEMS_TYPE[type];
            heroDict[heroId]["type"].push(type);
            heroDict[heroId]["rawType"].push(rawType);
        }
    }
    return heroDict;

}


function getHeroes(heroes, time) {


    let ret = []
    const 临时英雄 = ["leather", "atlab_aang",
        "atlab_sokka", "king"];
    for (let heroId in heroes) {
        if (临时英雄.includes(heroId)) {
            // console.log(heroId)
            continue
        }


        let offset = time % heroes[heroId]['respawnCycle'];
        if (offset === heroes[heroId]['respawnOffset'] || (offset + heroes[heroId]['respawnCycle'] === heroes[heroId]['respawnOffset'])) {
            ret.push(heroId);
        }
    }
    return ret;
}







