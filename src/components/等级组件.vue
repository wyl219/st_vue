
<template>
<div>
  <label>
    <slot></slot>
    <input :value="showLevel"  @change="处理等级并返回($event)">
    <a @click="等级输入说明=!等级输入说明">显示等级输入说明</a>
    <div v-show="等级输入说明">
      当输入单个数字时,最低等级将设定为n-3
      <br/>
      当输入两个数字(中间用空格或逗号分开).将视为等级范围,例如输入5,7视为5到7级,输入7,7视为仅7级.
      <br/>
      输入多个数字时,将视为指定等级,例如输入5,7,9视为5,7,9级
    </div>

  </label>
</div>
<!--  <a @click="console.log(showLevel)">点击输出</a>-->
</template>


<script>
export default {
  emits: ['等级'],
  props:{
    rawLevel:String
  },
  methods:{
    处理等级并返回(event){
      let v=event.target.value
      // 用正则表达式提取出输入中的所有数字
      let numbers = v.match(/\d+/g) || [];

      let max
      let min
      let r
      console.log(numbers,numbers.length)
      if(numbers.length===0){
        max=0
        min=0
        r=[]
      }else if (numbers.length===1){
        max=numbers[0]
        min=max-2
        r=Array.from({ length: max -min+1 }, (_, i) => i +min);
      }else if (numbers.length===2){
        max=Math.max(...numbers)
        min=Math.min(...numbers)
        r=Array.from({ length: max -min+1 }, (_, i) => i +min);
      }else {
        max=Math.max(...numbers)
        min=Math.min(...numbers)
        numbers= numbers.map(number => parseInt(number, 10));
        r=numbers.sort((a, b) => a - b)

      }

      console.log(r)
      if (1<=min&& max<=14){
        this.inputLevel = r.toString()
        this.$emit('等级',r)
      } else{
        this.$forceUpdate();

        alert("请输入1-14之间的数字")
      }

    }
  }
  ,computed:{
    showLevel(){
      if(this.inputLevel){
        return this.inputLevel
      }else {
        return this.rawLevel
      }
    }
  },
  data(){
    return{
      inputLevel:null,
      等级输入说明:false
    }
  }
}

</script>

<style scoped>

</style>