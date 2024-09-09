

<template>
<div>
  <p>
    说明:
    <br>
    这里忽略了所有的临时勇士,包括国王和皮匠.并且隐藏了无勇士的时间段
    <br>
    氪金线图纸显示为<span style=" text-shadow:1px 1px 1px gold,-1px -1px 1px gold,1px -1px 1px gold,-1px 1px 1px gold;">金色阴影</span>.
    <span style="color:red;font-size: large" >红色中号字</span>表示在这个时间段该装备同时有两个勇士需求.
    <span style="color:purple;font-size: larger" >紫色大号字</span>表示同时有三个勇士需求.
  </p>
  <p>注意:这里<span style="color: red;font-size:large ">保存了你之前设定的筛选</span>,如果有部分装备类型不显示,请在筛选中点击"全选" </p>


  <label> <input type="radio" :value="true" v-model="useUTC" > 每天从0点开始
    <input type="radio" :value="false" v-model="useUTC"> 每天从-4点(前一天20点)

    <div>
      选中汇总:
      <br>
      <span v-for="([key, value], index) in 汇总数据" :key="index">
  {{ key }}:{{ value }}<span v-if="index < 汇总数据.length - 1">,</span>
</span>


    </div>


  </label>
</div>
  <div>
    <a @click="show筛选=!show筛选">点击打开筛选</a>
    <shaixuan v-show="show筛选"
              :仅装备=true
              :主要材料筛选=true
              :氪金筛选=true
              :筛选字典="装备类型"
              @切换筛选="切换筛选($event)"
    />
  </div>
<rili
    :数据="数据"
    :装备类型="装备类型"
/>
</template>
<script >
// import calendar from './calendar.js'
// import {hero} from './calendar.js'
import rili from './子日历.vue'
import shaixuan from './筛选组件.vue'
import {useCounterStore,useNoPersistCounterStore} from "@/stores/useCounterStore.js";
export default {
  components:{rili,
    shaixuan},
  computed:{
    装备类型(){
      // this.汇总数据
      return this.store.日历筛选
    },


    汇总数据(){


      if (Object.keys(this.noPersistStore.日历数据).length===0){
        return []
      }

      let 选中的时间戳数组=this.noPersistStore.选中时间戳

      if (选中的时间戳数组.length===0){
        return [["选中若干个时间单元格以汇总统计",""]]
      }



      let data={}
      for (let selectedTime of 选中的时间戳数组){
        let data1=this.noPersistStore.日历数据[selectedTime]
        for (let arr of data1){
          if(arr[0] in data){
            data[arr[0]]+=arr[1]
          }else{
            data[arr[0]]=arr[1]
          }

        }
      }

      // return data

      // 使用 Object.entries 将对象转换为 [key, value] 数组，并按 value 进行排序
      let sortedArray = Object.entries(data).sort((a, b) => b[1] - a[1]);

      return sortedArray; // 返回排序后的数组

    },


    },
  watch:{
    useUTC(){
      // console.log(2)
      this.store.set日历使用时间(this.useUTC)
    }
  },
  // async created() {
  //   this.装备类型= await this.store.get日历筛选()
  //
  // }
  // ,
  methods:{
    // async tt(){
    //   this.数据= await calendar()
    //   // console.log(this.数据)
    // },
    async 切换筛选(装备类型){
      // console.log(装备类型)
      // this.装备类型=装备类型
      this.store.set日历筛选(装备类型)
      // this.装备类型= await this.store.get日历筛选()
      // console.log(this.装备类型)
    }
  },
  // async created() {
  //   await this.tt()
  // },
  data(){
    const store= useCounterStore()
    let useUTC=store.日历使用时间

    return {
      // 装备类型:{},
      noPersistStore:useNoPersistCounterStore(),
      store,
      数据:{},
      show筛选:false,
      useUTC,


    }
  }

}
</script>
<style scoped>

</style>