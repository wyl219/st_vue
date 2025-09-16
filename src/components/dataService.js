import {useCounterStore} from "@/stores/useCounterStore.js";

const cache = {};
const URL_DICT = {
    "heroes": "/src/components/data/heroes.json",
    "items": "/src/components/data/items.json",
    "itemType": "/src/components/data/item_type.json",
    "i18nJson": "/src/components/data/texts_zh.json",
    "平均价格": "/src/components/data/平均价格.json",
    "all": 'https://smartytitans.com/api/item/last/all',
    "rawItemTypeData": "/src/components/data/raw_item_type_data.json",
    "flashQuests": "/src/components/data/flash_quests.json",
    "quests": "/src/components/data/quests.json",
    "item_type_data": "/src/components/data/item_type_data.json",
    "item_type_zh": "/src/components/data/item_type_zh.json",
    "enJson": "/src/components/data/texts_en.json",
    "zhJson": "/src/components/data/texts_zh.json",
}
const rawDict={}


export async function getI18nItemTypeData() {
    const i18nJson = await getI18nJson();
    const rawItemTypeData = await getJson('rawItemTypeData');
    // console.log(rawItemTypeData);
    const r = {}; // 生成新的对象
    for (let [k1, v1] of Object.entries(rawItemTypeData)) {
        r[k1] = {} // 最外层的 物品类型 等
        for (let [k2, v2] of Object.entries(v1)) {
            // console.log(k2,v2)
            let v;
            if (typeof v2 === 'object' && v2 !== null) { // 如果v2还是对象
                v = {}
                for (let [k3, v3] of Object.entries(v2)) {
                    if (k3.includes('_')) { // 如果key是带下划线的
                        v[i18nJson[k3]] = v3
                        rawDict[i18nJson[k3]]=k3
                    } else {
                        v = v3
                    }
                }
            } else {
                v = v2
            }
            if (k2.includes('_')) { // 如果key是带下划线的
                r[k1][i18nJson[k2]] = v// 家具分类
                rawDict[i18nJson[k2]]=k2
            } else {
                r[k1][k2] = v //材料分类,这里应该做一个新的字典
            }
        }
    }
    return r
}


async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`网络响应不是 OK: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('获取 JSON 数据失败:', error);
        throw error;
    }
}

// 根据 key 设置不同的缓存时间
function getCacheDuration(key) {
    if (["all", 'i18nJson'].includes(key)) {
        return 20 * 1000; // 20秒
    }
    return 12 * 60 * 60 * 1000; // 12小时
}


export async function getI18nJson() {
    const store = useCounterStore();
    const jsonData = await getJson('i18nJson')
    return jsonData['texts'];
}

export async function getAllItemsJson() {
    const jsonData = await getJson('all');
    return jsonData['data'];
}

export async function getJson(key, url = null) {
    if (!url) {
        url = URL_DICT[key];
    }
    const CACHE_DURATION = getCacheDuration(key);
    try {
        const now = new Date();

        // 检查缓存是否存在，且缓存时间是否在有效期内
        if (!cache[key] || (now - cache[key][1]) > CACHE_DURATION) {
            cache[key] = [await fetchJson(url), now]; // 更新缓存
        }

        return cache[key][0]; // 返回缓存数据
    } catch (error) {
        console.error(`加载数据 ${key} 时出错:`, error);
        throw error;
    }
}
