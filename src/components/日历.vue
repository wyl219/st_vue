

<template>
<div>
  <p>
    说明:
    <br>
    这里忽略了所有的临时勇士,包括国王和皮匠.
    <br>
    氪金线图纸显示为<span style=" text-shadow:1px 1px 1px gold,-1px -1px 1px gold,1px -1px 1px gold,-1px 1px 1px gold;">金色阴影</span>.
    <span style="color:red;font-size: large" >红色中号字</span>表示在这个时间段该装备同时有两个勇士需求.
    <span style="color:purple;font-size: larger" >紫色大号字</span>表示同时有三个勇士需求.
  </p>
</div>
  <div>
    <a @click="show筛选=!show筛选">点击打开筛选</a>
    <shaixuan v-show="show筛选"
              :仅装备=true
              :主要材料筛选=true
              :氪金筛选=true
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
export default {
  components:{rili,
    shaixuan},
  methods:{
    async tt(){
      this.数据= await calendar()
      // console.log(this.数据)
    },
    切换筛选(装备类型){
      // console.log(装备类型)
      this.装备类型=装备类型
      console.log(this.装备类型)
    }
  },
  async created() {
    await this.tt()
  },
  data(){
    return {
      数据:{},
      show筛选:false,
      装备类型:[]
    }
  }

}
</script>
<style scoped>

</style>