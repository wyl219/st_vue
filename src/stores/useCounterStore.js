// src/stores/useCounterStore.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        模块选择: 1, // 初始值为1
        lang:"zh",
        飞龙等级限制:[5,6,7],
    }),
    actions: {
        修改模块(模块编号) {
            this.模块选择 = 模块编号; // 增加计数器
        },
        setLang(newLang) {
            console.log(newLang)
            this.lang = newLang;
        },
        set飞龙等级限制(等级限制) {
            this.飞龙等级限制 = 等级限制

        },
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
