

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
<rili
    :数据="数据"

/>
</template>
<script >
import calendar from './calendar.js'
// import {hero} from './calendar.js'
import rili from './子日历.vue'
export default {
  components:{rili},
  methods:{
    async tt(){
      this.数据= await calendar()
      console.log(this.数据)
    }
  },
  async created() {
    await this.tt()
  },
  data(){
    return {
      数据:{}
    }
  }

}
</script>
<style scoped>

</style>