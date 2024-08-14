<template>
  <div>
    <h1>升级小熊手</h1>
    <label>等级限制
    <input type="number" v-model="等级限制" placeholder="等级限制">
    </label>
    <br>
    <label>日销售量
      <input type="number" v-model="日销售量" placeholder="日销售量">
    </label>
    <br>
<!--    <label>最大金币消耗-->
<!--      <input type="number" v-model="最大金币消耗" placeholder="最大金币消耗">-->
<!--    </label>-->
    <label>
      最大金币消耗
      <input
          type="text"
          :value="formattedValue"
          @change ="handleInput"
          placeholder="最大金币消耗"
      />
    </label>
    <br>

    <a @click="tt()">点击更新</a>
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
    />
    <p>
      使用说明:<br>
      修改等级限制(即限制的最大等级)和日销售量,最大金币消耗后,点击更新稍作等待即可.请勿重复点击.<br>
      市场价格数据来自 https://smartytitans.com/ ,有大约5分钟的延迟,购买前请认真核对实际市场价.<br>
      日销售量,通常9地在合理的家具布置下,满货架客流量大约为350人每小时.低等级情况下可以用游戏时间*100来估算.<br>
      金币消耗为准备消耗掉的装备,本工具的计算方式是用市场价-基础价(不考虑里程碑加成),计算出净利润(或净亏损).用最大金币消耗除以净亏损,可以计算出现有金币能支持你购买并销售的最大数量.<br>
      用这个最大数量与日销售量做比较,取其小值乘以单装备经验,即为每日可获得的最大经验.<br>
    </p>
  </div>

</template>

<script >
import TableComponent from './表格组件.vue';
import {checkMo , 金币格式转换 } from './com.js'


export default {
  components: {
    TableComponent,
  },
  methods: {
    handleInput(event) {
      // 获取输入值并清除逗号
      // const value = event.target.value.replace(/,/g, '');

      const value =金币格式转换(event.target.value,true)

      // 更新原始值
      this.rawValue = value;
    },
    async tt() {
      this.数据=[]
      let 数据 = await checkMo(undefined,this.等级限制,undefined, this.日销售量, this.rawValue);
      this.数据 = 数据;

    }
  },

  computed: {
    formattedValue() {
      // 清除非数字字符
      // const numericValue = this.rawValue.replace(/,/g, '');
      const numericValue =金币格式转换(this.rawValue)

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
        "市场价": "goldPrice", "净利润": "净利润","日最大经验":"日最大经验",
        "因数量限制":"数量限制","因金币限制":"金币限制"
      },
      数据: [

      ],
      默认排序列: "日最大经验",
      显示总行数: 15,
    };
  },
};
</script>