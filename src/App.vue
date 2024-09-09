<template>
  <div id="app">
    <div>
<!--      <select  :value="语言" @change="setLang">-->
<!--        <option value="zh">中文</option>-->
<!--        <option value="en">English</option>-->
<!--        <option value="de">Deutsch</option>-->
<!--      </select>-->
      <a v-if="this.mo!==1" @click="()=>修改模块(1)">切换升级小熊手</a>
      <a v-if="this.mo!==2" @click="()=>修改模块(2)">切换飞龙小熊手</a>
      <a v-if="this.mo!==3" @click="()=>修改模块(3)">切换勇士小熊手</a>
      作者:布兰妮和铁扇公主#94360@撕裂者
    </div>

    <br>
    <div>
      <ParentComponent v-if="mo===1" />
      <ParentComponent1 v-if="mo===2" />
      <calendar v-if="mo===3" />
    </div>
  </div>
</template>

<script>
import ParentComponent from './components/日最大经验.vue';
import ParentComponent1 from './components/飞龙计算.vue';
import calendar from './components/日历.vue';
import {computed} from "vue";
import {useCounterStore} from "@/stores/useCounterStore.js";
import {onMounted} from "vue";


export default {
  components: {
    ParentComponent,
    ParentComponent1,
    calendar,
  },


  setup(){
    const store = useCounterStore();

    // onMounted(async()=>{
    //   let r =await store.get日历筛选()
    //   console.log(r)
    //     }
    //
    // )

    let mo=computed(() => store.模块选择)

    let 语言=computed(() => store.lang)

    const setLang=(event)=>{
      // console.log(event.target.value)
      store.setLang(event.target.value)
      store.set日历筛选({})
      window.location.reload();
    }

    return{
      语言,
      mo,
      修改模块:store.修改模块,
      setLang,
    }
  },



//
//   components: {
//     ParentComponent,
//     ParentComponent1,
//     calendar,
//   },
//   data() {
//     return {
//       mo:1
//       // 数据
//     };
//   },
//   computed: {
//     转换提示(){
//       if(this.mo){
//         return "点击切换飞龙小熊手"
//       }else{
//         return "点击切换升级小熊手"
//       }
//     }
//   }
//
// ,
//   methods: {
//     // 方法
//   },
//   mounted() {
//     // 组件挂载后
//   }
};
</script>

<style>
/* 全局样式 */
</style>
