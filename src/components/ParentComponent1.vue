<template>
  <div>
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
    />
  </div>
</template>

<script>
import TableComponent from './表格组件.vue';

export default {
  components: {
    TableComponent,
  },
  data() {
    return {
      表头: { "名称": "name", "经验": "xp", "攻击": "atk" },
      数据: [
        {uid: 1, name: '张三', xp: 18, atk: 11},
        {uid: 2, name: '李四', xp: 19, atk: 12},
      ],
      默认排序列: "攻击",
      显示总行数: 20,
    };
  },
};
</script>