<template>
  <div id="app">
    <div>
      <a v-if="this.mo!==1" @click="this.mo=1">切换升级小熊手</a>
      <a v-if="this.mo!==2" @click="this.mo=2">切换飞龙小熊手</a>
      <a v-if="this.mo!==3" @click="this.mo=3">切换勇士小熊手</a>
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

export default {
  name: 'App',
  components: {
    ParentComponent,
    ParentComponent1,
    calendar,
  },
  data() {
    return {
      mo:1
      // 数据
    };
  },
  computed: {
    转换提示(){
      if(this.mo){
        return "点击切换飞龙小熊手"
      }else{
        return "点击切换升级小熊手"
      }
    }
  }

,
  methods: {
    // 方法
  },
  mounted() {
    // 组件挂载后
  }
};
</script>

<style>
/* 全局样式 */
</style>
