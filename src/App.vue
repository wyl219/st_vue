<template>
  <div id="app">
    <a @click="this.mo=! this.mo">{{转换提示}}</a>

    <br>
    <ParentComponent v-if="mo" />
    <ParentComponent1 v-if="! mo" />
  </div>
</template>

<script>
import ParentComponent from './components/日最大经验.vue';
import ParentComponent1 from './components/飞龙计算.vue';

export default {
  name: 'App',
  components: {
    ParentComponent,
    ParentComponent1
  },
  data() {
    return {
      mo:true
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
