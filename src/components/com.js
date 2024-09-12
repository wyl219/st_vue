
// com.data_import
import {getJson} from "./dataService.js"


async function getAll() {
    // console.time('items.json');
    ITEM_JSON = await getJson('items');
    // console.timeEnd('items.json');
    //
    // console.time('texts_en.json');
    EN_JSON = (await getJson("enJson",'http://101.35.240.107/data/texts_en.json'))['texts'];
    // console.timeEnd('texts_en.json');
    //
    // console.time('texts_zh.json');
    ZH_JSON = (await getJson("zhJson",'http://101.35.240.107/data/texts_zh.json'))['texts'];
    // console.timeEnd('texts_zh.json');
    //
    // console.time('item_type_zh.json');
    itemType = await getJson("itemType");
    // console.timeEnd('item_type_zh.json');
    //
    // console.time('last/all');
    let data = await getJson("all");
    // console.timeEnd('last/all');
    //
    // console.log(`获取${data['data'].length}个物品成功`);
    return data['data'];
}

let ITEM_JSON
let EN_JSON
let ZH_JSON
let itemType

const qualityBuff={
    'common':1,
    'uncommon':1.25,
    'flawless':1.5,
    'epic':2,
    'legendaryQuality':3
}
const qualityValueBuff={ // 价格加成,工人经验加成似乎与之相同,白绿蓝已经测试了
    'common':1,
    'uncommon':1.25,
    'flawless':2,
    'epic':3,
    'legendary':5
}
// com.com
const MUNDRA_PRICE = {
    mundrahammer: 700000,
    mundrabow: 19400,
    mundrastaff: 105000,
    mundrapotion: 2850000,
    mundraarmor: 33000,
    mundrahelm: 12700000,
    mundrashield: 5450000,
    mundraamulet: 21000,
};

function 根据品质计算真实属性(blueprint){
    // 传入的是白色的属性
    // console.log(blueprint)
    let itemData=blueprint['itemData']
    // 价格

    for(let key of ['value','craftXp','xp']){
        itemData[key] *= qualityValueBuff[blueprint['tag1']] // 价格是验证过的,商人经验验证了白绿蓝,工人经验没验证
    }


    for(let key of ['atk','def','hp']){
        itemData[key] *= qualityValueBuff[blueprint['tag1']]
    }

    // 这些是getBp里面计算过的
    blueprint["飞龙威力"]*=qualityValueBuff[blueprint['tag1']]
        blueprint["单工人经验"]*=qualityValueBuff[blueprint['tag1']]


    // 价格还需要特殊处理
    let 价格=itemData['value']
    let tier=blueprint['tier']
    // 获取价格的位数
    let 价格位数=价格.toString().length
    if (tier<3 && 价格位数<4){// 保留n-1位有效数字
        价格=Math.round(价格/10**(价格位数-2))*10**(价格位数-2)
    }else {
        let 价格位数减
        if (tier>=14) {// 保留4位有效数字,且最后一位是5或0
             价格位数减=4
        }else{
             价格位数减=3
        }
        let t1 = 价格/10**(价格位数-价格位数减) // 这里是有小数的
        let t2 = t1 % 5 // 这里是0-4
        if (t2<3){
            t1=Math.floor(t1/5)*5-5
        }else {
            t1=Math.floor(t1/5)*5+5
        }
        价格=t1*10**(价格位数-价格位数减)
    }
    // console.log(价格)
    itemData['value']=价格
    return blueprint
}

/// 缺少高品质对价格和属性的加成
async function getBp(uid) {
    // 获取蓝图的信息
    let itemData = JSON.parse(JSON.stringify(ITEM_JSON[uid]));  // Deep copy
    const enName = EN_JSON[`${uid}_name`];

    let 名称;
    try {
        名称 = ZH_JSON[`${uid}_name`];
    } catch (error) {
        名称 = '未找到';
    }

    const 装备类别 = ZH_JSON[itemType[itemData['type']]];


    if (itemData['lTag3'] || itemData['lTag2']) {
        const a = itemData['lTag3'] || itemData['lTag2'];
        const ltag = ITEM_JSON[a];
        itemData['xp'] += Math.min(itemData['xp'], ltag['xp']);

        for (const k of ["atk", "def", "hp"]) {
            if (itemData[k] > 0) {
                itemData[k] += Math.min(itemData[k], ltag[k] * 1.5);
            }
        }

        if (MUNDRA_PRICE.hasOwnProperty(uid)) {
            // console.log(uid)
            itemData['value'] = MUNDRA_PRICE[uid];
            // console.log(itemData['value'])
        } else {
            itemData['value'] += ltag['value'] * 0.1;
        }
    }



    let 单工人经验;
    if (itemData['worker3']) {
        单工人经验 = Math.floor(itemData['craftXp'] / 3);
    } else if (itemData['worker2']) {
        单工人经验 = Math.floor(itemData['craftXp'] / 2);
    } else {
        单工人经验 = itemData['craftXp'];
    }

    let 里程碑价格加成 = 1;
    for (let i = 1; i <= 5; i++) {
        if (itemData[`upgrade${i}`] && itemData[`upgrade${i}`].includes('value')) {
            里程碑价格加成 = parseFloat(itemData[`upgrade${i}`].split('*')[1]);
            break;
        }
    }

    let 飞龙威力, 飞龙类别;
    if (!["符文石", "月光石", "材料", "光环", "使魔"].includes(装备类别)) {
        飞龙威力 = Math.floor(
            (itemData['atk'] * 0.8 + itemData['def'] * 1.2 + itemData['hp'] * 5) *
            (1 + itemData['eva'] * 10 + itemData['crit'] * 10)
        );
        if(uid==="artifactgun")飞龙威力*=1.2; // 屠龙大炮特殊加成
        飞龙类别 = {
            "a": "护甲",
            "b": "副甲",
            "g": "副甲",
            "h": "副甲",
            "w": "武器",
            "u": "饰品",
            "x": "饰品",
            "f": "饰品",
            "z": "附魔",
        }[itemData['type'][0]];
    } else {
        飞龙威力 = 0;
        飞龙类别 = "不可用";
    }


    let 亲和=""
    let t_亲和=[];
    if (itemData['elementAffinity']){
        // if(itemData['elementAffinity']==="gold"){
        //     t_亲和.push("黄金")
        // }else{
        // t_亲和.push(ZH_JSON[itemData["element_"+'elementAffinity']])
        // }
        t_亲和.push(ZH_JSON["element_"+itemData['elementAffinity']])
    }
    if (itemData['spiritAffinity']){
        t_亲和.push(ZH_JSON[itemData['spiritAffinity']+"_name_o"])
    }
    if (t_亲和.length>0){

        亲和=t_亲和.join(',')
    }
    let 自带附魔;
    if (itemData["lTag2"]||itemData["lTag3"]){
        自带附魔=true
    }else  {
        自带附魔=false
    }




    return {
        itemData,
        enName,
        名称,
        装备类别,
        飞龙威力,
        飞龙类别,
        单工人经验,
        里程碑价格加成,
        亲和,
        自带附魔

    };
}

// 金币格式转换的工具
export function 金币格式转换(金币, s2i = false) {
    const 单位 = ["", "K", "M", "G", "T"];
    if (s2i) {
        if (typeof 金币 === 'string') {
            金币=金币.toUpperCase()
            if (金币.length > 1 && 单位.includes(金币.slice(-1))) {
                const 单位索引 = 单位.indexOf(金币.slice(-1));
                let 金币数值 = parseFloat(金币.slice(0, -1));
                金币数值 *= 10 ** (3 * 单位索引);
                return Math.round(金币数值);
            } else {
                return parseInt(金币, 10);
            }
        } else {
            return parseInt(金币, 10);
        }
    } else {
        if (typeof 金币 === 'number') {
            if (金币 === 0) {
                return "0";
            } else {
                let 正负flag= 金币 >= 0 ? "" : "-";
                金币=Math.abs(金币)
                let 单位索引 = 0;
                while (金币 >= 1000 && 单位索引 < 单位.length - 1) {
                    金币 /= 1000;
                    单位索引++;
                }
                return `${正负flag}${金币.toFixed(1)}${单位[单位索引]}`;
            }
        } else {
            return 金币;
        }
    }
}

// check_mo


// 过滤列表函数
function filList(listAll, tTypeFil = 'o',等级范围=null, tag1Fil = ["common", "uncommon", "flawless", "epic", "legendary"]) {
    // console.log(等级范围)

    return listAll.filter(item => {
        // console.log(item, tTypeFil, tierFil, tag1Fil)
        if (tTypeFil && item['tType'] !== tTypeFil) return false;
        if (等级范围 && ( !等级范围.includes(item['tier'] ))) {
            // console.log(item['tier'])
            return false
        };
        if (!item['tag1']) item['tag1'] = 'common';
        if (tag1Fil && !tag1Fil.includes(item['tag1'])) return false;
        return true;
    });
}

// 获取订单图纸的原始数据并计算净利润
async function getOrderDrawings(blueprint, hasProfit = false, hasExperience = true) {
    const uid = blueprint['uid'];
    const itemData = Object.values(ITEM_JSON).find(v => v['uid'] === uid);

    if (!itemData) {
        console.log("没找到",uid)
        return null}


    const bpData = await getBp(uid);
    blueprint = { ...blueprint, ...bpData };

    blueprint=根据品质计算真实属性(blueprint)

    blueprint['品质'] = ZH_JSON[blueprint['tag1'] + '_name'];
    blueprint['净利润'] = blueprint['itemData']['value'] - blueprint['goldPrice'];

    if (!blueprint['goldPrice'] || (hasProfit &&  blueprint['净利润']<0 ) || (hasExperience && itemData['xp'] === 0)) {
        return null;
    }

    // if(uid==="mundraamulet"){
    //     console.log(itemData['value'] )
    //     console.log(blueprint['itemData']['value'] )
    //     console.log(blueprint['itemData']['xp'] )
    //     console.log(blueprint['goldPrice'])
    //     console.log(blueprint['净利润'])
    // }

    return blueprint;
}



// 主函数
export  async function checkMo(tTypeFil = 'o', 等级范围 = null, tag1Fil = null,
                               numDay = 200, money = 1000000,

                               ) {



    // console.log(`\n限制条件,等级范围:${等级范围} ;日最大出售量:${numDay} ;金币限制:${money}\n`);
    // console.log(等级范围)
    // 从API中获取数据
    const listAll = await getAll();
    // console.log(listAll)
    // console.log(listAll)
    const newList = filList(listAll, tTypeFil,等级范围, tag1Fil);
    // console.log(newList)
    const setList = [];
    for (const blueprint of newList) {
        const orderDrawing = await getOrderDrawings(blueprint);
        // console.log(orderDrawing)
        if (!orderDrawing) continue;

        let 金币限制;
        if (orderDrawing['净利润'] >= 0) {
            金币限制 = Infinity;
        } else {
            金币限制 = Math.floor(money / Math.abs(orderDrawing['净利润'])) * orderDrawing['itemData']['xp'];
        }
        const 数量限制 = numDay * orderDrawing['itemData']['xp'];
        const 日最大经验 = Math.min(数量限制, 金币限制);

        orderDrawing['日最大经验'] = 日最大经验;
        orderDrawing['金币限制'] = 金币限制;
        orderDrawing['数量限制'] = 数量限制;
        // console.log(orderDrawing)
        setList.push(orderDrawing);
    }
    // console.log(setList)
    // 清理数据
    const cleanedList = filDataDesc(setList);

    // 排序并展示前20条数据
    const sortedDataDesc = cleanedList.sort((a, b) => b['日最大经验'] - a['日最大经验']);
    // showData(sortedDataDesc.slice(0, 20));
    // console.log("返回了：")
    // console.log(sortedDataDesc.slice(0, 20))
    return sortedDataDesc;
}

// 清理数据
function filDataDesc(dataDesc) {
    const uniqueMap = new Map();
    dataDesc.forEach(item => {
        const tmpId = `${item['uid']}_${item['品质']}`;
        if (!uniqueMap.has(tmpId) || uniqueMap.get(tmpId)['id'] < item['id']) {
            uniqueMap.set(tmpId, item);
        }
    });
    return Array.from(uniqueMap.values());
}



// 飞龙

async function getOrderDrawings_air(blueprint, 有飞龙分 = true) {
    const uid = blueprint['uid'];
    const itemData = Object.values(ITEM_JSON).find(v => v['uid'] === uid);

    if (!itemData) {
        console.log("没找到",uid)
        return null}


    const bpData = await getBp(uid);
    blueprint = { ...blueprint, ...bpData };
    if  (有飞龙分 && ! blueprint['飞龙威力'] )  {
        return null;
    }
    blueprint['品质'] = ZH_JSON[blueprint['tag1'] + '_name'];
    if (!blueprint['goldPrice'] ){
        blueprint['goldPrice']="-"
        blueprint['净利润'] ="-";
        blueprint['飞龙分单价'] = "-"
    }else {
        blueprint['净利润'] = itemData['value'] - blueprint['goldPrice'];
        blueprint['飞龙分单价'] = Math.floor(blueprint['净利润'] / blueprint['飞龙威力'])
    }
     if (!blueprint["tier"]){blueprint["tier"]=itemData['tier']} // 用于补充项目
    return blueprint;
}

// 加一个函数 遍历ITEM_JSON,将所有有飞龙分的项目补充进列表里.

async function 补充项目 (uid){
    const blueprint={"uid":uid,"goldPrice":null,"tag1":"common",
    id:`${new Date().getTime()}${uid}`} // 加一个虚拟的id,方便排除 别的id都是整数,这里变成字符串,不知道有没有影响.

    // console.log(blueprint)
    return  await getOrderDrawings_air(blueprint);
}


// 主函数
export  async function checkAir(tTypeFil = 'o', 等级范围 = null ,tag1Fil = ["common"] ) {


    console.log(`\n限制条件,等级范围:${等级范围} `);




    // 从API中获取数据
    // console.time('getall');
    const listAll = await getAll();
    // console.timeEnd('getall');

    // console.log(listAll)
    // console.time('fillist');
    const newList = filList(listAll, tTypeFil, 等级范围, tag1Fil,);
    // console.timeEnd('fillist');

    console.log(newList)
    const setList = [];

    for (const blueprint of newList) {
        const orderDrawing = await getOrderDrawings_air(blueprint);
        // console.log(orderDrawing)
        if (!orderDrawing) continue;


        // console.log(orderDrawing)
        setList.push(orderDrawing);
    }

    // 补充项目
    for (let uid in ITEM_JSON) {

        if (tTypeFil && ITEM_JSON[uid]['tType'] !== tTypeFil) continue;
        if (等级范围 && ! 等级范围.includes(ITEM_JSON[uid]['tier'] )) continue;

        if  (setList.find(item => item.uid === uid)){continue} // 判断是否已经存在

        const orderDrawing = await 补充项目(uid);

        // console.log(orderDrawing)
        if (!orderDrawing) continue;


        // console.log(orderDrawing)
        setList.push(orderDrawing);
    }

    // console.log(setList)
    // 清理数据
    const cleanedList = filDataDesc(setList);

    // 排序并展示前20条数据
    const sortedDataDesc = cleanedList.sort((a, b) => b['飞龙威力'] - a['飞龙威力']);
    // showData(sortedDataDesc.slice(0, 20));
    // console.log("返回了：")
    // console.log(sortedDataDesc)
    return sortedDataDesc;
}
