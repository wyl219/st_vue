

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
import {getJson} from "@/components/dataService.js";



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
    return{
      "重甲": true,
      "轻甲": true,
      "中甲": true,
      "重鞋": true,
      "轻鞋": true,
      "铁护手": true,
      "护腕": true,
      "头盔": true,
      "法师帽": true,
      "盗贼帽": true,
      "草药": true,
      "药水": true,
      "法术": true,
      "斧": true,
      "弓": true,
      "弩": true,
      "匕首": true,
      "火枪": true,
      "锤": true,
      "矛": true,
      "剑": true,
      "法杖": true,
      "魔杖": true,
      "护身符": true,
      "斗篷": true,
      "使魔": true,
      "戒指": true,
      "盾牌": true,
      "符文石": true,
      "附魔": true,
      "月光石": true,
      "光环": true,
      "餐食": true,
      "甜点": true,
      "材料": true,
      "乐器": true
    }
  }
}
  },
  methods: {
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
      // 物品类型: {
      //   "重甲": true,
      //   "轻甲": true,
      //   "中甲": true,
      //   "重鞋": true,
      //   "轻鞋": true,
      //   "铁护手": true,
      //   "护腕": true,
      //   "头盔": true,
      //   "法师帽": true,
      //   "盗贼帽": true,
      //   "草药": true,
      //   "药水": true,
      //   "法术": true,
      //   "斧": true,
      //   "弓": true,
      //   "弩": true,
      //   "匕首": true,
      //   "火枪": true,
      //   "锤": true,
      //   "矛": true,
      //   "剑": true,
      //   "法杖": true,
      //   "魔杖": true,
      //   "护身符": true,
      //   "斗篷": true,
      //   "使魔": true,
      //   "戒指": true,
      //   "盾牌": true,
      //   "符文石": true,
      //   "附魔": true,
      //   "月光石": true,
      //   "光环": true,
      //   "餐食": true,
      //   "甜点": true,
      //   "材料": true,
      //   "乐器": true
      // },
      装备类型: {
        "重甲": true,
        "轻甲": true,
        "中甲": true,
        "重鞋": true,
        "轻鞋": true,
        "铁护手": true,
        "护腕": true,
        "头盔": true,
        "法师帽": true,
        "盗贼帽": true,
        "草药": true,
        "药水": true,
        "法术": true,
        "斧": true,
        "弓": true,
        "弩": true,
        "匕首": true,
        "火枪": true,
        "锤": true,
        "矛": true,
        "剑": true,
        "法杖": true,
        "魔杖": true,
        "护身符": true,
        "斗篷": true,
        "使魔": true,
        "戒指": true,
        "盾牌": true,
        "光环": true,
        "餐食": true,
        "甜点": true,
        "乐器": true
      },
      家具类别筛选: {
        "护甲架": {
          "重甲": true,
          "轻甲": true,
          "中甲": true,
          "重鞋": true,
          "轻鞋": true,
          "铁护手": true,
          "护腕": true,
          "头盔": true,
          "法师帽": true,
          "盗贼帽": true,
          "斗篷": true
        },
        "垂直货架": {
          "斧": true,
          "锤": true,
          "矛": true,
          "剑": true,
          "法杖": true
        },
        "货架": {
          "草药": true,
          "药水": true,
          "法术": true,
          "护身符": true,
          "使魔": true,
          "戒指": true,
          "光环": true,
          "餐食": true,
          "甜点": true
        },
        "桌子": {
          "弓": true,
          "弩": true,
          "匕首": true,
          "火枪": true,
          "魔杖": true,
          "乐器": true
        }
      },
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
        "光环": true,
        "餐食": false,
        "甜点": true,
        "乐器": true
      },
      主要材料装备类型: {
        "铁法": {
          "光环": true
        },
        "铁珠": {
          "剑": true,
          "火枪": true,
          "重甲": true,
          "重鞋": true,
          "铁护手": true,
          "头盔": true,
          "护身符": true,
          "戒指": true
        },
        "铁": {
          "匕首": true
        },
        "木法": {
          "锤": true,
          "法杖": true
        },
        "木珠": {
          "斧": true,
          "矛": true,
          "弓": true,
          "魔杖": true,
          "弩": true,
          "盾牌": true
        },
        "草法": {
          "乐器": true,
          "草药": true,
          "药水": true,
          "法术": true,
          "餐食": true,
          "甜点": true
        },
        "草珠": {
          "使魔": true
        },
        "皮法": {
          "中甲": true,
          "轻甲": true,
          "轻鞋": true,
          "护腕": true,
          "法师帽": true,
          "盗贼帽": true
        },
        "皮珠": {
          "斗篷": true
        }
      }


    }
  },

  mounted() {
  }
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