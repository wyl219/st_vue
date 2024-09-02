

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
  <label> <input type="radio" :value="true" v-model="useUTC" > 以UTC时间排序
    <input type="radio" :value="false" v-model="useUTC"> 以本地时间排序
  </label>
</div>
  <div>
    <a @click="show筛选=!show筛选">点击打开筛选,当前共筛选隐藏{{筛选隐藏数量}}项.</a>
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
import calendar from './calendar.js'
// import {hero} from './calendar.js'
import rili from './子日历.vue'
import shaixuan from './筛选组件.vue'
import {useCounterStore} from "@/stores/useCounterStore.js";
export default {
  components:{rili,
    shaixuan},
  computed:{
    装备类型(){
      return this.store.日历筛选
    },
    筛选隐藏数量(){
      if(Object.keys(this.装备类型).length>0){
        let l=Object.entries(this.装备类型).filter(([key, value]) => value === false).length
        return l
      }else{
        return 0
      }
    },
    },
  watch:{
    useUTC(){
      // console.log(2)
      this.store.set日历使用UTC时间(this.useUTC)
    }
  }
  ,
  methods:{
    async tt(){
      this.数据= await calendar()
      // console.log(this.数据)
    },
    切换筛选(装备类型){
      // console.log(装备类型)
      // this.装备类型=装备类型
      this.store.set日历筛选(装备类型)
      // console.log(this.装备类型)
    }
  },
  async created() {
    await this.tt()
  },
  data(){
    const store= useCounterStore()
    let useUTC=store.日历使用UTC时间

    return {
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