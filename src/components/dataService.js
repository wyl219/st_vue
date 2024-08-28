import {useCounterStore} from "@/stores/useCounterStore.js";

const cache = {};
const URL_DICT={
    "heroes":"http://101.35.240.107/data/heroes.json",
    "items":"http://101.35.240.107/data/items.json",
    "itemType":"http://101.35.240.107/data/item_type.json",
    "i18nJson":"http://101.35.240.107/data/texts_zh.json",
    "平均价格":"http://101.35.240.107/data/平均价格.json",
    "all":'https://smartytitans.com/api/item/last/all'
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
    if (["all",'i18nJson'].includes(key)) {
        return 20 * 1000; // 20秒
    }
    return 12 * 60 * 60 * 1000; // 12小时
}



export async function getI18nJson() {
    const store= useCounterStore();
    const jsonData = await getJson('i18nJson',`http://101.35.240.107/data/texts_${store.lang}.json`)
    return jsonData['texts'];
}

export async function getAllItemsJson() {
    let lang = store.lang;
    const jsonData = await getJson('all', 'https://smartytitans.com/api/item/last/all');
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

// export async function getJson(key, url=null) {
//     if (!url){
//         url=URL_DICT[key]
//     }
//     try {
//         if (key && cache[key]) {
//             return cache[key]
//         }else{
//             let r=await fetchJson(url);
//             if(key){cache[key]=r}
//             return r
//         }
//
//     } catch (error) {
//         console.error(`加载数据${key}时出错:`, error);
//     }
// }
