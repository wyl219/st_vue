
<!-- 写一个vue3表格组件 将父组件传入的数据依次展示出来
父组件传入的数据格式为：
参数1: 代表表头的显示内容和对应的key值 {"名称":"name","经验":"xp","攻击":"atk"}
参数2:
[{uid:1,name:'张三',xp:18,atk:11},{uid:2,name:'李四',xp:19,atk:12}]
参数3: 代表表头是否可以排序 {"名称":true,"经验":true,"攻击":true}
参数4: 代表表头是否可以筛选 {"名称":true,"经验":true,"攻击":true}
参数5: 代表默认排序的列 "攻击"
参数6: 代表默认排序的顺序 "asc"
参数7: 代表显示的总行数,默认为20
表头为白色,内容为黑色,表头字体为微软雅黑,内容字体为宋体
其余每行的背景色交替为白色和灰色,鼠标悬停时背景色变为黄色
-->

<!-- 写一个vue3表格组件 将父组件传入的数据依次展示出来
父组件传入的数据格式为：
参数1: 代表表头的显示内容和对应的key值 {"名称":"name","经验":"xp","攻击":"atk"}
参数2:
[{uid:1,name:'张三',xp:18,atk:11},{uid:2,name:'李四',xp:19,atk:12}]
参数3: 代表默认排序的列 "攻击"
参数4: 代表显示的总行数,默认为20
表头为白色,内容为黑色,表头字体为微软雅黑,内容字体为宋体
其余每行的背景色交替为白色和灰色,鼠标悬停时背景色变为黄色
所有变量及函数名都使用中文,所有注释也使用中文
-->


<template>
  <div>
    <table>
      <thead>
      <tr>
        <th
            v-for="(value, key) in 表头"
            :key="key"
            @click="排序(value)"
            :class="{ active: 当前排序列 === value }"
        >
          {{ key }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item, index) in 分页数据"
          :key="item.uid"
          :class="{ 'alternate-row': index % 2 === 1 }"
          @mouseover="悬停行 = index"
          @mouseout="悬停行 = -1"
          :style="{ backgroundColor: 悬停行 === index ? 'yellow' : '' }"
      >
        <td v-for="(value, key) in 表头" :key="key">{{ item[value] }}</td>
      </tr>
      </tbody>
    </table>
    <div>
      <button @click="上一页">上一页</button>
      <button @click="下一页">下一页</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    表头: Object,
    数据: Array,
    默认排序列: String,
    显示总行数: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      当前排序列: this.默认排序列,
      排序方向: 'asc',
      当前页: 0,
      悬停行: -1,
    };
  },
  computed: {
    排序数据() {
      const sortedData = this.数据.slice().sort((a, b) => {
        if (this.排序方向 === 'asc') {
          return a[this.当前排序列] > b[this.当前排序列] ? 1 : -1;
        } else {
          return a[this.当前排序列] < b[this.当前排序列] ? 1 : -1;
        }
      });
      return sortedData;
    },
    分页数据() {
      const start = this.当前页 * this.显示总行数;
      return this.排序数据.slice(start, start + this.显示总行数);
    },
  },
  methods: {
    排序(列) {
      if (this.当前排序列 === 列) {
        this.排序方向 = this.排序方向 === 'asc' ? 'desc' : 'asc';
      } else {
        this.当前排序列 = 列;
        this.排序方向 = 'asc';
      }
    },
    上一页() {
      if (this.当前页 > 0) {
        this.当前页--;
      }
    },
    下一页() {
      if ((this.当前页 + 1) * this.显示总行数 < this.排序数据.length) {
        this.当前页++;
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: white;
  color: black;
  font-family: 'Microsoft YaHei', sans-serif;
  cursor: pointer;
}

td {
  color: black;
  font-family: 'SimSun', serif;
}

.alternate-row {
  background-color: gray;
}

.active {
  font-weight: bold;
}
</style>