<!--写一个vue3组件,内有若干个input标签,根据父组件传入的参数确定标签数量及标签名
传入的参数格式为: [{name: 'input1', type: 'text'}, {name: 'input2', type: 'password'}]
父组件可以读取子组件的值
所有的变量、方法、注释均用中文名,但是组件及标签名用英文.
-->
<template>
  <div>
    <div v-for="(input, index) in inputs" :key="index">
      <label :for="input.name">{{ input.name }}</label>
      <input
          :type="input.type"
          :id="input.name"
          v-model="inputValues[input.name]"
          @input="updateValues"
      />
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  props: {
    inputs: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const inputValues = reactive({});

    // 初始化 inputValues
    props.inputs.forEach(input => {
      inputValues[input.name] = '';
    });

    // 更新值并通知父组件
    const updateValues = () => {
      emit('updateValues', inputValues);
    };

    return {
      inputValues,
      updateValues,
    };
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 5px;
}

input {
  margin-bottom: 10px;
}
</style>