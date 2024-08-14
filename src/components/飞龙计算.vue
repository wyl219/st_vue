<template>

  <div>
    <h1>飞龙小熊手</h1>
    <label>等级限制
    <input type="number" v-model="等级限制" placeholder="等级限制">
    </label>
    <br>


    <a @click="tt()">点击更新</a>
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="['飞龙类别', '武器']"
    />
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="['飞龙类别', '饰品']"
    />
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="['飞龙类别', '护甲']"
    />
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="['飞龙类别', '副甲']"
    />
    <p>
      使用说明:<br>
      修改等级限制(即限制的最大等级),点击更新稍作等待即可.请勿重复点击.<br>
      市场价格数据来自 https://smartytitans.com/ ,有大约5分钟的延迟,购买前请认真核对实际市场价.<br>

    </p>
  </div>

</template>

<script >
import TableComponent from './表格组件.vue';
import {checkAir , 金币格式转换 } from './com.js'


export default {
  components: {
    TableComponent,
  },
  methods: {
    handleInput(event) {
      // 获取输入值并清除逗号
      // const value = event.target.value.replace(/,/g, '');
      console.log(event)
      const value =金币格式转换(event.target.value,true)
      console.log(value)
      // 更新原始值
      this.rawValue = value;
    },
    async tt() {
      this.数据=[]
      let 数据 = await checkAir(undefined,this.等级限制);
      this.数据 = 数据;
      console.log(数据)
    }
  },

  computed: {
    formattedValue() {
      // 清除非数字字符
      // const numericValue = this.rawValue.replace(/,/g, '');
      const numericValue =金币格式转换(this.rawValue)
      console.log(numericValue)
      if (!numericValue) return '';

      // 转换为数字并添加千分位逗号
      // return Number(numericValue).toLocaleString();
      return numericValue
    },
  },
  data() {
    return {
      rawValue: 1000000, // 存储原始的输入值
      等级限制:7,
      日销售量:200,
      // 最大金币消耗:1000000,

      表头: { "名称": "名称",
        "等级": "tier","类别":"装备类别","品质":"品质",
        "市场价": "goldPrice", "净利润": "净利润","飞龙威力":"飞龙威力","飞龙分单价":"飞龙分单价",
        "亲和":"亲和","自带附魔":"自带附魔"
      },
      数据: [

      ],
      默认排序列: "飞龙威力",
      默认排序方向:'desc',
      显示总行数: 4,
    };
  },
};
</script>