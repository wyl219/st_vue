<template>
  <div>
    <h1>升级小熊手</h1>

    <LevelInput
        @等级="设定等级"
        :rawLevel="等级范围.join(',')"
    >等级限制</LevelInput>

    <label>日销售量
      <input type="number" v-model="日销售量" placeholder="日销售量">
    </label>
    <br>
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



    <div>
      <a @click="tt($event)">点击更新</a>
      <a @click="show筛选=!show筛选">点击打开筛选</a>
      <shaixuan v-show="show筛选"
                :仅装备=false
                :家具筛选=true
                :氪金筛选=true
                @切换筛选="切换筛选($event)"
      />
    </div>


    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :装备类型筛选="装备类型"
    />
    <p>
      使用说明:<br>
      修改等级限制(即限制的最大等级,最小等级为最大等级-3)和日销售量,最大金币消耗后,点击更新稍作等待即可.请勿重复点击.<br>
      市场价格数据来自 https://smartytitans.com/ ,有大约5分钟的延迟,购买前请认真核对实际市场价.<br>
      日销售量,通常9地在合理的家具布置下,满货架客流量大约为350人每小时.低等级情况下可以用游戏时间*100来估算.<br>
      金币消耗为准备消耗掉的装备,本工具的计算方式是用市场价-基础价(不考虑里程碑加成),计算出净利润(或净亏损).用最大金币消耗除以净亏损,可以计算出现有金币能支持你购买并销售的最大数量.<br>
      用这个最大数量与日销售量做比较,取其小值乘以单装备经验,即为每日可获得的最大经验.<br>
    </p>
  </div>

</template>

<script >
import LevelInput from './等级组件.vue';
import TableComponent from './表格组件.vue';
import {checkMo , 金币格式转换 } from './com.js'
import shaixuan from "@/components/筛选组件.vue";


export default {
  components: {
    shaixuan,
    TableComponent,
    LevelInput,
  },
  methods: {
    设定等级(new等级范围){
      // console.log(new等级范围)
      this.等级范围=new等级范围
      // console.log(this.等级范围)
      this.tt()
    },
    handleInput(event) {
      const value =金币格式转换(event.target.value,true)

      // 更新原始值
      this.rawValue = value;
    },
    async tt(event) {

      this.数据=[]
      let 数据 = await checkMo(undefined,this.等级范围,undefined, this.日销售量, this.rawValue);
      this.数据 = 数据;

    },
    切换筛选(装备类型){
      // console.log(装备类型)
      this.装备类型=装备类型
      // console.log(this.装备类型)
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
      等级范围:[5,6,7],
      日销售量:200,
      // 最大金币消耗:1000000,
      show筛选:false,
      表头: { "名称": "名称",
        "等级": "tier","类别":"装备类别","品质":"品质",
        "市场价": "goldPrice", "净利润": "净利润","日最大经验":"日最大经验",
        "因数量限制":"数量限制","因金币限制":"金币限制"
      },
      数据: [

      ],
      装备类型:[],
      默认排序列: "日最大经验",
      显示总行数: 15,
    };
  },
};
</script>