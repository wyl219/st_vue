<script >

import {calendarByTime,特殊事件} from './calendar.js'
import {getI18nJson} from "@/components/dataService.js";
import {useCounterStore,useNoPersistCounterStore} from "@/stores/useCounterStore.js";
export default {

  props:{

    装备类型:{
      type: Object,
      default: () => ({}),  // 默认值为空对象
    },
    时间戳:{
      type: Number,
      default: 0,  // 默认值为空对象
    },

    特殊事件:{
      type: Boolean,
      default: false,
    }
  },
  async mounted() {
    await this.getData();
    await this.get特殊事件();
  },
  methods:{
    async getData(){
      this.i18nJson=await getI18nJson()
      this.新数据= await calendarByTime(this.时间戳)
},
    async get特殊事件(){
      this.特殊时间信息= await 特殊事件(this.时间戳)
    }
  } ,
  computed:{
    //  新数据(){
    // return this.getData()
    // },


     整合数据(){

       if(this.特殊事件){

         return this.特殊时间信息
       }

      // this.新数据
      const rawTypeCount = {};
      let data=  this.新数据




      // console.log(data)
      // 遍历每个角色的数据
       let 原始数据=""
      for (const key in data) {
        // console.log(key)

        const rawType = data[key].rawType;// console.log(rawType)
        const replacedItems = rawType.map(item => this.i18nJson[item] || null);
        原始数据+= this.i18nJson[key+"_name"] + ':' + replacedItems.join(' ') + '\n';
        // console.log(this.原始数据)
        // console.log(replacedItems)
        // 统计每个 cnType 出现的次数
        replacedItems.forEach(cnType => {
          if (rawTypeCount[cnType]) {
            rawTypeCount[cnType]++;
          } else {
            rawTypeCount[cnType] = 1;
          }
        });
      }
       this.原始数据=原始数据
       console.log(this.原始数据)
      // 转换为数组形式
      const result = Object.entries(rawTypeCount).map(([key, value]) => {
        return [ key, value ];
      });


      return result;
    },
    筛选后数据(){
      if(this.特殊事件) {
        return  this.整合数据
      }

      let 筛选后数据

      if (Object.keys(this.装备类型).length<1) {
        筛选后数据= this.整合数据
        }else {

        筛选后数据 = this.整合数据.filter(item => {
          return this.装备类型[item[0]]
        })
      }
      // console.log(筛选后数据)
      this.noPersistStore.增加日历数据(this.时间戳,筛选后数据)
      // console.log(this.noPersistStore.日历数据)
      return 筛选后数据
    }
  },
  data(){
    return {
      原始数据:null,
      特殊时间信息:"",
      i18nJson:null,
      store:useCounterStore(),
      noPersistStore:useNoPersistCounterStore(),
      新数据:null,
      氪金工人装备类型: {
        "重甲": false,
        "轻甲": false,
        "中甲": false,
        "重鞋": false,
        "轻鞋": false,
        "铁护手": false,
        "护腕": false,
        "头盔": false,
        "法师帽": false,
        "盗贼帽": false,
        "草药": false,
        "药水": false,
        "法术": false,
        "斧": false,
        "弓": false,
        "弩": false,
        "匕首": false,
        "火枪": true,
        "锤": false,
        "矛": false,
        "剑": false,
        "法杖": false,
        "魔杖": true,
        "护身符": false,
        "斗篷": true,
        "使魔": true,
        "戒指": false,
        "盾牌": false,
        "光环之歌": true,
        "餐食": false,
        "甜点": true,
        "乐器": true
      },
    }
  }
}

</script>

<template>
<div :title="this.原始数据">


  <span v-for="(item, index) in 筛选后数据" :key="index">
    <span :class="{
          [`times_${item[1]}`]: true,
          '氪金线': 氪金工人装备类型[item[0]]
        }"
          v-html="item[0]">

      </span>
    <span v-if="index < 筛选后数据.length - 1">,</span>
  </span>

</div>
</template>

<style scoped>
span .氪金线{

  text-shadow:
      1px 1px 1px gold,   /* 水平偏移 1px，垂直偏移 1px，模糊半径 2px，颜色金色 */
      -1px -1px 1px gold, /* 水平偏移 -1px，垂直偏移 -1px，模糊半径 2px，颜色金色 */
      1px -1px 1px gold,  /* 水平偏移 1px，垂直偏移 -1px，模糊半径 2px，颜色金色 */
      -1px 1px 1px gold;
}
span .times_1{
  color: black;
}
span .times_2{
  color: red;
  font-size: large;
}
span .times_3{
  color: purple;
  font-size: larger;
}
span {
  display: inline; /* 确保 span 行为正常 */
  white-space: normal; /* 允许文本自动换行 */
  word-break: normal; /* 在需要时换行 */
  overflow-wrap: break-word; /* 处理长单词换行 */
}

</style>