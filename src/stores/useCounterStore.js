// src/stores/useCounterStore.js
import { defineStore } from 'pinia';
// import {getI18nJson} from "@/components/dataService.js";
// const raw物品类型= {
//     "item_type_armorheavy": true,
//     "item_type_armorlight": true,
//     "item_type_armormedium": true,
//     "item_type_boots": true,
//     "item_type_feet": true,
//     "item_type_gauntlets": true,
//     "item_type_bracers": true,
//     "item_type_helmet": true,
//     "item_type_hat": true,
//     "item_type_roguehat": true,
//     "item_type_herb": true,
//     "item_type_potion": true,
//     "item_type_scrolls": true,
//     "item_type_axe": true,
//     "item_type_bow": true,
//     "item_type_crossbow": true,
//     "item_type_dagger": true,
//     "item_type_gun": true,
//     "item_type_mace": true,
//     "item_type_spear": true,
//     "item_type_sword": true,
//     "item_type_staff": true,
//     "item_type_wand": true,
//     "item_type_amulet": true,
//     "item_type_cloak": true,
//     "item_type_familiar": true,
//     "item_type_ring": true,
//     "item_type_shield": true,
//     "item_type_rune": true,
//     "item_type_tag": true,
//     "item_type_moonstone": true,
//     "item_type_aurastone": true,
//     "item_type_meal": true,
//     "item_type_dessert": true,
//     "item_type_component": true,
//     "item_type_instrument": true
// }
// const rawDict={}

export const useNoPersistCounterStore = defineStore('noPersistCounter', {

    state:()=>({
        选中时间戳:[],
        日历数据:{}
    }),

    getters:{

    },

        actions: {
            是否已选中(时间戳){
                return this.选中时间戳.includes(时间戳)
            },
            增加日历数据(时间戳,数据){
                this.日历数据[时间戳]=数据
            }
            ,
            修改选中时间戳(时间戳) {
                const index = this.选中时间戳.indexOf(时间戳);

                if (index !== -1) {
                    // 如果时间戳在数组中，删除
                    this.选中时间戳.splice(index, 1);
                } else {
                    // 如果时间戳不在数组中，添加
                    this.选中时间戳.push(时间戳);
                }
            }
        },


//     persist: {
//     enabled: true, // 启用持久化
//         strategies: [
//         {
//             key: '日历', // 自定义存储的 key
//             storage: sessionStorage, // 使用 localStorage
//         },
//     ],
// },
    }

)


export const useCounterStore = defineStore('counter', {
    state: () => ({
        模块选择: 1, // 初始值为1
        lang:"zh",
        飞龙等级限制:[5,6,7],
        // raw日历筛选:{},
        日历筛选:{},
        升级筛选:{},
        日历显示时间:[-8,-4,0,12],
        日历使用时间:true,
        升级等级限制:[5,6,7],
        升级数量限制:200,
        升级金币限制:10**6,

    }),

    actions: {
        // async get日历筛选(){
        //     if (Object.keys(this.raw日历筛选).length===0){
        //         return {}
        //     }else{
        //         this.日历筛选= await this.翻译筛选(this.raw日历筛选,"get")
        //     }
        // },

        set日历筛选(data){
            this.日历筛选=data
        },

        // async set日历筛选(日历筛选) {
        //     this.raw日历筛选 = await this.翻译筛选(日历筛选,"set")
        //     this.日历筛选= await this.翻译筛选(this.raw日历筛选,"get")
        //     // this.日历筛选=日历筛选
        // },
        //
        // async 翻译筛选(dct,flag){
        //     let r={}
        //     const i18nJson= await getI18nJson()
        //     // console.log(i18nJson)
        //     // console.log(dct)
        //     // console.log(flag)
        //     if (flag==='get'){ //
        //         for (let key of Object.keys(dct)){
        //             // console.log(key)
        //             // console.log( i18nJson[key])
        //             if (key.includes("_")){
        //                 let newKey=i18nJson[key]
        //                 if (newKey){r[newKey]=dct[key]}
        //
        //             }else {
        //
        //                r[key]=dct[key]
        //
        //             }
        //         }
        //     }else if (flag==='set'){
        //         for (let key of Object.keys(dct)){
        //             // console.log(key)
        //             // console.log( Object.keys(i18nJson).find(key1 => i18nJson[key1] === key))
        //             if (key.includes("_")){
        //                 r[key]=dct[key]
        //             }else {
        //                 let newKey=Object.keys(i18nJson).find(key1 => i18nJson[key1] === key)
        //                 if (newKey){if (newKey){r[newKey]=dct[key]}}
        //
        //             }
        //         }
        //
        //     }else {
        //         console.log("翻译筛选flag错误")
        //         r={}
        //     }
        //     console.log(flag)
        //     console.log(r)
        //     return r
        //
        // },





        修改模块(模块编号) {
            this.模块选择 = 模块编号; // 增加计数器
        },
        setLang(newLang) {
            console.log(newLang)
            this.lang = newLang;
        },
        set升级等级限制(r) {
            this.升级等级限制 = r
        },
        set升级数量限制(r) {
            this.升级数量限制 = r
        },
        set升级金币限制(r) {
            this.升级金币限制 = r
        },
        set飞龙等级限制(等级限制) {
            this.飞龙等级限制 = 等级限制
        },

        set升级筛选(升级筛选) {
            this.升级筛选 = 升级筛选},

        set日历显示时间(日历显示时间) {
            this.日历显示时间 = 日历显示时间
        },
        set日历使用时间(日历时间) {

            this.日历使用时间 = 日历时间

            if (日历时间){
                this.set日历显示时间( [-8,-4,0,12])
            }else{
                this.set日历显示时间( [-12,-8,-4,0])
            }
            //
            // const 原始日历显示时间=JSON.stringify([0,12,16,20])
            //
            //
            // if (日历UTC时间){
            //     // 使用utc时间
            //     console.log(原始日历显示时间)
            //     this.set日历显示时间( JSON.parse(原始日历显示时间))
            // }else{
            //     // 使用本地时间排序
            //     // 本地时间差值
            //     let 临时时间=JSON.parse(原始日历显示时间)
            //     let 本地时间差值 = new Date().getTimezoneOffset() / 60
            //     for (let i = 0; i < 临时时间.length; i++) {
            //         let time =临时时间[i]
            //         time-= 本地时间差值
            //         if (time<0){time+=24}else if(time>=24){time-=24}
            //         临时时间[i] = time
            //     }
            //     // 再对列表排序
            //     临时时间.sort((a, b) => a - b)
            //     // 再将其转换成UTC时间
            //     this.set日历显示时间(临时时间.map((item) => item + 本地时间差值))
            // }
        }
    },
    persist: {
        enabled: true, // 启用持久化
        strategies: [
            {
                key: '泰坦小熊手', // 自定义存储的 key
                storage: localStorage, // 使用 localStorage
            },
        ],
    },
});
