<template>

  <div>
    <h1>飞龙小熊手</h1>

    <LevelInput
        @等级="设定等级"
        :rawLevel="等级范围.join(',')"
    >等级限制
    </LevelInput>

    <!--    <label>等级限制-->
    <!--    <input type="number" v-model="等级限制" placeholder="等级限制">-->
    <!--    </label>-->
    <br>
    <TableComponent1
        :表头="汇总表头"
        :原始数据="选择装备"
        :num=50
    />

    <a @click="tt()">点击更新</a>
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="(x)=>x['飞龙类别']==='武器'"
        @row-clicked="handleRowClicked"
        @row-cancel-clicked="handleRowCancelClicked"
    />
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="(x)=>x['飞龙类别']==='饰品'"
        @row-clicked="handleRowClicked"
        @row-cancel-clicked="handleRowCancelClicked"
    />
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"

        :筛选="(x)=> x['飞龙类别']==='护甲'"
        @row-clicked="handleRowClicked"
        @row-cancel-clicked="handleRowCancelClicked"
    />
    <TableComponent
        :表头="表头"
        :数据="数据"
        :默认排序列="默认排序列"
        :显示总行数="显示总行数"
        :默认排序方向="默认排序方向"
        :筛选="(x)=> x['飞龙类别']==='副甲'"
        @row-clicked="handleRowClicked"
        @row-cancel-clicked="handleRowCancelClicked"
    />
    <p>
      使用说明:<br>
      修改等级限制(即限制的最大等级,最小等级为最大等级-3),点击更新稍作等待即可.请勿重复点击.<br>
      选中装备行后,会红色高亮该装备,并纳入合计,点击取消即可取消选中.<br>
      市场价格数据来自 https://smartytitans.com/ ,有大约5分钟的延迟,购买前请认真核对实际市场价.<br>
      部分自带附魔装备数据可能与实际略有差别,这里只考虑了白色装备,净利润未考虑1.25倍.<br>
      屠龙大炮已计算1.2倍的加成.
    </p>
  </div>

</template>

<script>

import TableComponent from './表格组件.vue';
import TableComponent1 from './汇总表格组件.vue';
import {checkAir, 金币格式转换} from './com.js'
import LevelInput from "@/components/等级组件.vue";
import {useCounterStore} from "@/stores/useCounterStore.js";


export default {
  components: {
    LevelInput,
    TableComponent,
    TableComponent1
  },
  methods: {
    设定等级(new等级范围) {
      // console.log(new等级范围)
      // this.等级范围=new等级范围
      this.store.set飞龙等级限制(new等级范围)
      // console.log(this.等级范围)
      this.tt()
    },

    async tt() {

      this.数据 = []
      console.log(this.等级范围)
      this.数据 = await checkAir(undefined, this.等级范围);

    },
    handleRowClicked(row) {
      const lb = row['飞龙类别']

      this.选择装备.find(item => item[0] === lb)[1] = row

    },
    handleRowCancelClicked(row) {
      const lb = row['飞龙类别']
      this.选择装备.find(item => item[0] === lb)[1] = {}

    }
  },

  computed: {
    等级范围() {
      return this.store.飞龙等级限制
    }
  },
  data() {
    return {
      store: useCounterStore(),

      汇总表头: {
        "名称": "名称",
        "等级": "tier", "类别": "装备类别", "品质": "品质",
        "市场价": "goldPrice", "净利润": "净利润", "飞龙威力": "飞龙威力",
        "亲和": "亲和", "自带附魔": "自带附魔"
      }

      ,
      选择装备: [["武器", {}], ["饰品", {}],
        ["护甲", {}], ["副甲", {}],
        ["合计", {
          "名称": "",
          "goldPrice": 0,
          "净利润": 0,
          "飞龙威力": 0
        }]
        // , {"附魔": {}}
      ]
      ,

      表头: {
        "名称": "名称",
        "等级": "tier", "类别": "装备类别", "品质": "品质",
        "市场价": "goldPrice", "净利润": "净利润", "飞龙威力": "飞龙威力", "飞龙分单价": "飞龙分单价",
        "亲和": "亲和", "自带附魔": "自带附魔"
      },
      数据: [],
      默认排序列: "飞龙威力",
      默认排序方向: 'desc',
      显示总行数: 4,
    };
  },
};
</script>