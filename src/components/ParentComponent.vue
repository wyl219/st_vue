<template>
  <div>
    <InputComponent
        :inputs="inputs"
        @updateValues="handleUpdateValues"
    />
  </div>
</template>

<script>
import InputComponent from './InputComponent.vue';

export default {
  components: {
    InputComponent,
  },
  data() {
    return {
      inputs: [
        {name: 'input1', type: 'text'},
        {name: 'input2', type: 'password'},
      ],
      values: {},
    };
  },
  methods: {
    handleUpdateValues(values) {
      this.values = values;
      console.log('Updated Values:', this.values);
    },
  },
};
</script>