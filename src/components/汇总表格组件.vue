

<template>
  <div>
    <table>
      <thead>
      <tr>
      <th  class="表序号">类别</th>
        <th  class="表内容"
            v-for="(value, key) in 表头"
            :key="key"

        >
          {{ key }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item, index) in  数据"
          :key="index"
          :class="{ 'alternate-row': index % 2 === 1 }"
          @mouseover="悬停行 = index"
          @mouseout="悬停行 = -1"
          :style="{ backgroundColor: 悬停行 === index ? 'yellow' : '' }"
      >
        <td class="表序号">{{ item[0] }}</td>
        <td v-for="(value, key) in 表头" :key="key"  class="表内容">{{  格式化表格内容(item[1],value)  }}</td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { 金币格式转换 } from './com.js'

export default {
  props: {
    表头: Object,
    原始数据: Array,
    num: Number
  },
  data() {
    return {
      悬停行: -1,
    };
  },
  computed: {
    数据(){
      const r=this.原始数据;
      const 汇总行=r.find(item=> item[0]==="合计")[1]
      let goldPrice=0
      let 净利润=0
      let 飞龙威力=0
      // console.log(this.num)
      汇总行['名称']=`各${this.num}个`
      for (const row of r.slice(0,r.length-1)){
        goldPrice+=row[1]['goldPrice']?row[1]['goldPrice']:0
        净利润+=row[1]['净利润']?row[1]['净利润']:0
        飞龙威力+=row[1]['飞龙威力']?row[1]['飞龙威力']:0
      }
      goldPrice*=this.num
      净利润*=this.num
      飞龙威力*=this.num
      汇总行['亲和']="距保底200K"
      汇总行['自带附魔']=`还差${金币格式转换(200000-飞龙威力)}`
      汇总行['净利润']=金币格式转换(净利润)
      汇总行['goldPrice']=金币格式转换(goldPrice)
      汇总行['飞龙威力']=金币格式转换(飞龙威力)
      return r;

    }

  },
  methods: {
    格式化表格内容(item,value){

      let r = item[value]
      if (typeof r === 'number') {
        // 将数字形式的r,改成千分位分隔,无小数部分的字符串

        if (value !== 'goldPrice' && Math.abs(r)>10**6 ){// 市场价还是保留原逗号分隔,方便对比

          r=金币格式转换(r)
        }else {
          r= r.toLocaleString();
        }
      }
      return r
    },


  }
}
</script>

<style scoped>
.highlight {
  background-color: red  !important;
}
table {
  width: 800px;
  border-collapse: collapse;
}

 .表序号{
  width: 100px;
   text-align: center;
}
 .表内容{
   width: 100px;
   text-align: center;
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
  background-color: #b9bab9;
}

.active {
  font-weight: bold;
}
</style>