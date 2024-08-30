<template>
  <div>
    <h1>升级小熊手</h1>

    <LevelInput
        @等级="设定等级"
        :rawLevel="等级范围.join(',')"
    >等级限制</LevelInput>

    <label>日销售量
      <input type="number" :value="日销售量" @change="修改日销售量" placeholder="日销售量">
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
    <a v-if="金币消息.length>0" @click="设定金币消耗(金币消息[1])">{{金币消息[0]}}<br></a>
    <div>
      <a @click="tt($event)">点击更新</a>
      <a @click="show筛选=!show筛选">点击打开筛选</a>
      <shaixuan v-show="show筛选"
                :仅装备=false
                :家具筛选=true
                :氪金筛选=true
                :筛选字典="装备类型"
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
      由于未找到高品质装备准确的售价及经验计算方式,这里的数值可能有错误.<br>
      市场价格数据来自 https://smartytitans.com/ ,有大约5分钟的延迟,购买前请认真核对实际市场价.<br>
      日销售量,通常9地在合理的家具布置下,满货架客流量大约为350人每小时.低等级情况下可以用游戏时间*100来估算.<br>
      金币消耗为准备消耗掉的装备,本工具的计算方式是用市场价-基础价(不考虑里程碑加成),计算出净利润(或净亏损).用最大金币消耗除以净亏损,可以计算出现有金币能支持你购买并销售的最大数量.<br>
      用这个最大数量与日销售量做比较,取其小值乘以单装备经验,即为每日可获得的最大经验.<br>
      或者也可以任意输入数量及金币后点击更新,并点击提示部分自动把金币消耗设定为该等级的平均价格的3倍.(其含义为当售价不超过基本售价的4倍时,获取的经验不会受金币数量影响.)<br>
    </p>
  </div>

</template>

<script >
import LevelInput from './等级组件.vue';
import TableComponent from './表格组件.vue';
import {checkMo , 金币格式转换 } from './com.js'
import shaixuan from "@/components/筛选组件.vue";
import {useCounterStore} from "@/stores/useCounterStore.js";
import {getJson} from "./dataService.js"


export default {
  components: {
    shaixuan,
    TableComponent,
    LevelInput,
  },
  methods: {
    修改日销售量(event){
      this.store.set升级数量限制(event.target.value)
    },
    设定等级(new等级范围){
      // console.log(new等级范围)
      // this.等级范围=new等级范围
      this.store.set升级等级限制(new等级范围)
      // console.log(this.等级范围)
      this.tt()
    },
    设定金币消耗(new金币消耗){
      this.store.set升级金币限制(new金币消耗)
      this.tt()
    },

    handleInput(event) {
      const value =金币格式转换(event.target.value,true)
      // 更新原始值
      this.store.set升级金币限制(value)
      // this.rawValue = value;
    },
    async 判断金币数量(){
      let 金币列表= await getJson('平均价格');
      let 金币数量=this.rawValue
      let 日销售量=this.日销售量
      let 设定平均金币数量=Math.ceil(金币数量/日销售量)
      let 最大等级=Math.max(...this.等级范围)
      let 平均价格=Math.ceil(金币列表[最大等级]['平均价格'])
      console.log(平均价格)
      if(设定平均金币数量>平均价格*5){
        this.金币消息=[`当前的设定最大装备等级为${最大等级},该等级下不含黄金装备的平均价值为${平均价格},而你设置的平均价格为${设定平均金币数量},大于平均价格的${5}倍,点击这里将其设定为平均价格的3倍,并重新更新`,
          平均价格*3*日销售量]
      }else if(设定平均金币数量<平均价格*0.5){
        this.金币消息=[`当前的设定最大装备等级为${最大等级},该等级下不含黄金装备的平均价值为${平均价格},而你设置的平均价格为${设定平均金币数量},小于平均价格的${0.5}倍,点击这里将其设定为平均价格的3倍,并重新更新`,
          平均价格*3*日销售量]
      }else{
        this.金币消息=[]
      }
    },
    async tt(event) {
      // 判断金币数量
      await this.判断金币数量()
      this.数据=[]
      let 数据 = await checkMo(undefined,this.等级范围,undefined, this.日销售量, this.rawValue);
      this.数据 = 数据;

    },
    切换筛选(装备类型){
      // console.log(装备类型)
      // this.装备类型=装备类型
      this.store.set升级筛选(装备类型)
      // console.log(this.装备类型)
    }
  },

  computed: {
    装备类型(){
      return this.store.升级筛选
    },
    formattedValue() {

      // 清除非数字字符
      // const numericValue = this.rawValue.replace(/,/g, '');
      const numericValue =金币格式转换(this.rawValue)
      if (!numericValue) return '';
      // 转换为数字并添加千分位逗号
      // return Number(numericValue).toLocaleString();
      return numericValue
    },
    rawValue(){
      return this.store.升级金币限制
    },
    等级范围(){
      return this.store.升级等级限制
    },
    日销售量(){
      return this.store.升级数量限制
    },
  },
  data() {
    return {
      store:useCounterStore(),
      金币消息:[],
      show筛选:false,
      表头: { "名称": "名称",
        "等级": "tier","类别":"装备类别","品质":"品质",
        "市场价": "goldPrice", "净利润": "净利润","日最大经验":"日最大经验",
        "因数量限制":"数量限制","因金币限制":"金币限制"
      },
      数据: [

      ],
      // 装备类型:[],
      默认排序列: "日最大经验",
      显示总行数: 15,
    };
  },
};
</script>