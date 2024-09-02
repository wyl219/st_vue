
import {getJson} from "./dataService.js"
import { Lunar, Solar } from 'lunar-javascript';

let loadPromise;
const dayTime=86400000;
const hourTime=3600000;
// let JSONReady=false;
let HEROES_JSON
let ITEM_TYPE_DATA_JSON
let ITEM_TYPE_ZH
let ZH_JSON;
const eventDict={
    "lcog":{
        "name":"黄金城",
        "start": 15*hourTime+dayTime,
        "end": 15*hourTime+4*dayTime,
        "offset": 28*24*60*60*1000
    },
    "titantower":{
        "name":"泰坦塔",
        "start": 15*hourTime+14*dayTime,
        "end": 15*hourTime+18*dayTime,
        "offset": 28*24*60*60*1000
    },
    "king":{
        "name":"国王的意向天开",
        "start": 15*hourTime+6*dayTime,
        "end": 15*hourTime+13*dayTime,
        "offset": 28*24*60*60*1000
    },
    "dragon":{
        "name":"飞龙入侵",
        "start": 15*hourTime+20*dayTime,
        "end": 15*hourTime+27*dayTime,
        "offset": 28*24*60*60*1000
    }
};



function getEvent(time){
    for(let eventId in eventDict){
        let event = eventDict[eventId];
        let offset = time%event.offset;
        if(offset >= event.start && offset < event.end){
            return eventId;
        }
    }
}

function getBoss(time){
    const quests=getJson("quests") // 任务
    const boss={};
    for(const key in quests){
        let quest=quests[key];
        if(quest.family==='goldcity'||!quest.isBoss) continue;
        boss[quest.family]={
            'bossRespawn':quest.bossRespawn,
            'respawnOffset':quest.respawnOffset
        }
    }

    const ret=[];
    for(const bossId in boss){
        if(time%boss[bossId]['bossRespawn']===boss[bossId]['respawnOffset']){
            ret.push(bossId);
        }
    }
    return ret;
}


export   async function 特殊事件(timestamp) {
    const date = new Date(timestamp);
    // 首先是快闪任务
    const flashQuests=await getJson("flashQuests") // 快闪任务
    // 从时间戳获取日期,这里的时间戳是UTC时间
    // 创建一个 Date 对象
    const day = date.getDate()
    let fq=null
    for (let k of Object.keys(flashQuests)) {
        let date=flashQuests[k].date
        if (date===day){
            fq=flashQuests[k]
        }
    }
    // 然后是农历满月
    const isFullMoon = Lunar.fromDate(date).getDay()===15;

    // 然后是活动
    const event = getEvent(timestamp);

    // // 不要boss了 意义不大 还费流量
    // const boss = getBoss(timestamp);

    // 翻译并打印
    let r=[]
    if (fq){
        let fq1=`<span style="text-decoration: underline; text-decoration-style: dotted;" title="名字${fq.name},次数${fq.attempts},最低商人等级${fq.minLevel}">闪回副本:${fq.掉落}</span><br>`
        r.push([fq1,1])
    }
    if (isFullMoon){
        r.push(["满月合成",1])
    }
    if (event){
        r.push([`${eventDict[event].name}`,1])
    }


    return r
}









async function getAll() {

    // console.time('heroes.json');
    HEROES_JSON = await getJson('heroes');
    // console.timeEnd('heroes.json');

    // console.time('item_type_data.json');
    ITEM_TYPE_DATA_JSON = (await getJson("item_type_data",'http://101.35.240.107/data/item_type_data.json'));
    // console.timeEnd('item_type_data.json');


    // console.time('item_type_zh.json');
    ITEM_TYPE_ZH = await getJson("item_type_zh",'http://101.35.240.107/data/item_type_zh.json');
    // console.timeEnd('item_type_zh.json');
    // JSONReady=true
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