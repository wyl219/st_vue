// src/stores/useCounterStore.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        模块选择: 1, // 初始值为1
        lang:"zh",
        飞龙等级限制:[5,6,7],
        日历筛选:{},
        日历显示时间:[0,12,16,20],
        日历使用UTC时间:false,
        升级等级限制:[5,6,7],
        升级数量限制:200,
        升级金币限制:10**6,
    }),
    actions: {
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
        set日历筛选(日历筛选) {
            this.日历筛选 = 日历筛选},
        set日历显示时间(日历显示时间) {
            this.日历显示时间 = 日历显示时间
        },
        set日历使用UTC时间(日历UTC时间) {

            const 原始日历显示时间=JSON.stringify([0,12,16,20])

            this.日历使用UTC时间 = 日历UTC时间
            if (日历UTC时间){
                // 使用utc时间
                console.log(原始日历显示时间)
                this.set日历显示时间( JSON.parse(原始日历显示时间))
            }else{
                // 使用本地时间排序
                // 本地时间差值
                let 临时时间=JSON.parse(原始日历显示时间)
                let 本地时间差值 = new Date().getTimezoneOffset() / 60
                for (let i = 0; i < 临时时间.length; i++) {
                    let time =临时时间[i]
                    time-= 本地时间差值
                    if (time<0){time+=24}else if(time>=24){time-=24}
                    临时时间[i] = time
                }
                // 再对列表排序
                临时时间.sort((a, b) => a - b)
                // 再将其转换成UTC时间
                this.set日历显示时间(临时时间.map((item) => item + 本地时间差值))
            }
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
