

<template>
<div>
  <div >
    <a v-show="主要材料筛选" v-for="(value, key) in 主要材料装备类型" :key="key" @click="big筛选(value,$event)"  class="大类别">{{key}}</a>
  </div>
  <div >
    <a v-show="家具筛选" v-for="(value, key) in 家具类别筛选" :key="key" @click="big筛选(value,$event)"  class="大类别">{{key}}</a>
  </div>

  <div >
    <a    v-for="(value, key) in 仅装备?装备类型:物品类型" :key="key" class="小类别"  @click="small筛选(key,$event)"
       :class="{
         'disabled':! 物品类型[key],
         '氪金线':氪金工人装备类型[key]
       }"
    >{{key}}</a>
  </div>
  <a v-show="氪金筛选" @click="特殊筛选('氪金',$event)"  class="大类别"> 氪金线</a>
  <a @click="特殊筛选('反选',$event)"  class="大类别"> 反选</a>
  <a @click="特殊筛选('全选',$event)"  class="大类别"> 全选</a>
  <a  @click="特殊筛选('全不选',$event)"  class="大类别"> 全不选</a>
</div>
</template>
<!--这里的大筛选逻辑错误-->
<script >
import {getI18nItemTypeData} from "@/components/dataService.js";



export default {

  props:{
    筛选字典:{
      type:Object,
      default:()=>({}),
    },

    氪金筛选:{
      type:Boolean,
      default:()=>false,
    },
    家具筛选:{
      type:Boolean,
      default:()=>false,
    },
    主要材料筛选:{
      type:Boolean,
      default:()=>false,
    },
    仅装备:{
      type:Boolean,
      default:()=>false,
    },
  },



  computed:{
物品类型(){

  if (Object.keys(this.筛选字典).length>0){
    return this.筛选字典
  }else{
    return this.r物品类型
  }
}
  },
  async mounted(){
    await this.getTypeJson()
  },
  methods: {

    async getTypeJson(){
      let t =await getI18nItemTypeData()
      this.r物品类型=t['物品类型']
      this.家具类别筛选=t['家具类别筛选']
      this.装备类型=t['装备类型']
      this.主要材料装备类型=t['主要材料装备类型']
      this.氪金工人装备类型=t['氪金工人装备类型']

    },


    big筛选(values,event){

      if(event.target.classList.contains('disabled')){
        for(let key in values){this.物品类型[key]=true}
        event.target.classList.remove('disabled')
      }else{
        for(let key in values){this.物品类型[key]=false}
        event.target.classList.add('disabled')
      }

      this.返回筛选()
    },
    特殊筛选(key,event){

     if(key === '全选'){
        for(let key in this.物品类型){this.物品类型[key]=true}
       console.log(this.物品类型)
      }
      if(key === '全不选'){
        for(let key in this.物品类型){this.物品类型[key]=false}
      }
      if(key === '反选'){
        for(let key in this.物品类型){this.物品类型[key]=!this.物品类型[key]}
      }
      if(key === '氪金') {
        console.log(event.target)
        if(event.target.classList.contains('disabled')){
          for(let key in this.氪金工人装备类型){
            if(this.氪金工人装备类型[key]){
            this.物品类型[key]=true
            }
          }
          event.target.classList.remove('disabled')

        }else{
          for(let key in this.氪金工人装备类型){
            if(this.氪金工人装备类型[key]){
              this.物品类型[key]=false
            }
          }
          event.target.classList.add('disabled')

        }
      }

      this.返回筛选()
    },
    small筛选(key,event){
      this.物品类型[key]=!this.物品类型[key]
      this.返回筛选()
    },
    返回筛选(){
      // console.log("装备类型变动")
      // console.log(this.装备类型)
      this.$emit('切换筛选',this.物品类型)
    }
  },
  watch:{

  },

  data() {
    return {
      r物品类型: {},
      装备类型: {},
      家具类别筛选:{},
      氪金工人装备类型: {},
      主要材料装备类型: {},


    }
  },


}


</script>



<style scoped>
a.大类别{
  font-size: large;
  color: blue;
}
a.小类别{
  font-size: small;
  color: black;
}
a.disabled{
  text-decoration:line-through;
  color: gray;
}
a.氪金线{
  text-shadow:
      1px 1px 1px gold,   /* 水平偏移 1px，垂直偏移 1px，模糊半径 2px，颜色金色 */
      -1px -1px 1px gold, /* 水平偏移 -1px，垂直偏移 -1px，模糊半径 2px，颜色金色 */
      1px -1px 1px gold,  /* 水平偏移 1px，垂直偏移 -1px，模糊半径 2px，颜色金色 */
      -1px 1px 1px gold;
}
</style>