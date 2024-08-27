
import {getJson} from "./com.js"
let loadPromise;

let JSONReady=false;
let HEROES_JSON
let ITEM_TYPE_DATA_JSON
let ITEM_TYPE_ZH

async function getAll() {

    // console.time('heroes.json');
    HEROES_JSON = await getJson('http://101.35.240.107/data/heroes.json');
    // console.timeEnd('heroes.json');

    // console.time('item_type_data.json');
    ITEM_TYPE_DATA_JSON = (await getJson('http://101.35.240.107/data/item_type_data.json'));
    // console.timeEnd('item_type_data.json');


    // console.time('item_type_zh.json');
    ITEM_TYPE_ZH = await getJson('http://101.35.240.107/data/item_type_zh.json');
    // console.timeEnd('item_type_zh.json');
    JSONReady=true
}


export  async function calendarByTime(timestamp) {

    if (!loadPromise) {
        loadPromise = getAll();
    }
    await loadPromise;

    let heroesList_one;
    heroesList_one = getHeroesListByTime(timestamp );

    // console.log(heroesList_one)

    return heroesList_one;

}

function getHeroesListByTime(timestamp){



    let heroList=getHeroes1(HEROES_JSON,timestamp);

    let heroDict
    heroDict={}
    for(let i=0;i<heroList.length;i++){
        let heroId=heroList[i];

        let itemTypes=HEROES_JSON[heroId]["bulkTypes"].split(",");

        heroDict[heroId]={"type":[],"cnType":[]}
        for(let idx in itemTypes){
            let type=itemTypes[idx];
            let cnType=ITEM_TYPE_ZH[type];
            heroDict[heroId]["type"].push(type);
            heroDict[heroId]["cnType"].push(cnType);
        }
    }
    return heroDict;

}


function getHeroes1(heroes,time){


    let ret=[]
    const 临时英雄 = ["leather", "atlab_aang",
        "atlab_sokka", "king"];
    for(let heroId in heroes){
        if (临时英雄.includes(heroId)){
            // console.log(heroId)
            continue}


        let offset = time%heroes[heroId]['respawnCycle'];
        if(offset===heroes[heroId]['respawnOffset'] || (offset + heroes[heroId]['respawnCycle'] === heroes[heroId]['respawnOffset'])){
            ret.push(heroId);
        }
    }
    return ret;
}










export default async function calendar() {
    await getAll()
    const heroesList=getHeroesList();
    // console.log(heroesList)
    // console.log(typeof heroesList)
    return heroesList;
}

function getHeroesList(){
    const dayTime=86400000;
    const hourTime=3600000;
    let ret=[]
    let beginDate=new Date();
    beginDate.setHours(0,0,0,0);
    // beginDate.setUTCHours(0,0,0,0);
    for(let d=0;d<8;d++){

        let day=new Date(beginDate.getTime()+d*dayTime);

        for(let h=0;h<24;h++){
            let hour=new Date(day.getTime()+h*hourTime);

            let heroList=getHeroes(HEROES_JSON,hour.getTime());
            let heroDict={}
            for(let i=0;i<heroList.length;i++){
                let heroId=heroList[i];

                let itemTypes=HEROES_JSON[heroId]["bulkTypes"].split(",");

                heroDict[heroId]={"type":[],"cnType":[]}
                for(let idx in itemTypes){
                    let type=itemTypes[idx];
                    let cnType=ITEM_TYPE_ZH[type];
                    heroDict[heroId]["type"].push(type);
                    heroDict[heroId]["cnType"].push(cnType);
                }
            }
            ret[hour.getTime()]=heroDict;

        }
    }
    return ret;

}

function getHeroes(heroes,time){
    let ret=[]
    const 临时英雄 = ["leather", "atlab_aang",
        "atlab_sokka", "king"];
    for(let heroId in heroes){
        if (临时英雄.includes(heroId)){
            // console.log(heroId)
            continue}


        let offset = time%heroes[heroId]['respawnCycle'];
        if(offset===heroes[heroId]['respawnOffset'] || (offset + heroes[heroId]['respawnCycle'] === heroes[heroId]['respawnOffset'])){
            ret.push(heroId);
        }
    }
    return ret;
}