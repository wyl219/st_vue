
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
<!--    <h3 v-if="筛选">{{筛选[1]}}</h3>-->
    <div>
      <button @click="第一页" :class="{ disabled: 当前页 === 0 }" :disabled="当前页 === 0">第一页</button>
      <button @click="上一页" :class="{ disabled: 当前页 === 0 }" :disabled="当前页 === 0">上一页</button>

      <span>当前为第{{ 当前页 + 1 }}页 总{{ 总页数 }}页</span><span>,当前条件下总计{{排序数据.length}}项</span>
      <button @click="下一页" :class="{ disabled: 当前页 >= 总页数 - 1 }" :disabled="当前页 >= 总页数 - 1">下一页</button>
    </div>
    <table>
      <thead>
      <tr>
        <th class="表序号">序号</th>
        <th  class="表内容"
            v-for="(value, key) in 表头"
            :key="key"
            @click="排序(value)"
            :class="{ active: 当前排序列 === value }"
        >
          {{ key }}
        </th>
        <th  class="表内容" v-if="模块==='升级'">
        排除该订单
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item, index) in 分页数据"
          :key="item.id"
          :class="{ 'alternate-row': index % 2 === 1,
           highlight:item.id===sel_id
          }"
          @mouseover="悬停行 = index"
          @mouseout="悬停行 = -1"
          :style="{ backgroundColor: 悬停行 === index ? 'yellow' : '' }"

          @click="handleRowClick(item,$event)"
      >
        <td  class="表序号">{{获取序号(item)+1}}</td>
        <td v-for="(value, key) in 表头" :key="key"  class="表内容">{{ 格式化表格内容(item,value) }}</td>
        <td  v-if="模块==='升级'" class="表内容" @click="排除(item,$event)"> <a v-show="item.id" >排除</a></td>
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
    数据: Array,
    默认排序列: String,
    显示总行数: {
      type: Number,
      default: 20,
    },
    默认排序方向: String,
    筛选:Function,
    装备类型筛选:{
      type:Object,
      default: ()=>{return {}}

    },
    模块:String,
  },
  watch : {
    筛选数据(){

      if(this.筛选数据.length>0){
        this.handleRowClick(this.筛选数据[0],"")

      }
    }

  }
  ,
  data() {
    return {
      排除ID:[],
      当前排序列: this.默认排序列,
      排序方向: 'desc',
      当前页: 0,
      悬停行: -1,
      sel_id:0
    };
  },
  computed: {
    排序数据() {
      let sortedData = this.数据.slice().sort((a, b) => {
        if (!this.排序方向){
          this.排序方向 = this.默认排序方向;
        }
        if (this.排序方向 === 'asc') {
          // this.排序方向 = 'desc'
          return a[this.当前排序列] > b[this.当前排序列] ? 1 : -1;

        } else {
          // this.排序方向 = 'asc'
          return a[this.当前排序列] < b[this.当前排序列] ? 1 : -1;

        }
      });

      // 这里加上排除
      if(this.排除ID.length>0){
        const 排除的ID列表 = this.排除ID.map(item => item.id);
        sortedData = sortedData.filter(item => !排除的ID列表.includes(item.id));
      }
      if( this.筛选){
        sortedData=sortedData.filter(item => this.筛选(item));
      }

      return sortedData;
    },
    筛选数据(){
      let r=this.排序数据;

      // // 这里加上排除
      // if(this.排除ID.length>0){
      //   const 排除的ID列表 = this.排除ID.map(item => item.id);
      //   r = r.filter(item => !排除的ID列表.includes(item.id));
      // }

      if(Object.keys(this.装备类型筛选).length>1){

        r=r.filter(item =>

          this.装备类型筛选[item['装备类别']]);

      }

      // console.log(r)

      return r

    }
    ,
    分页数据() {
      const start = this.当前页 * this.显示总行数;
      let  t=this.筛选数据.slice(start, start + this.显示总行数);

      if (t.length < this.显示总行数) {
        for (let i = t.length; i < this.显示总行数; i++)
          t.push({});
      }
      // console.log(t)
      return t;
    },
    总页数() {

      return Math.max(1,Math.ceil(this.筛选数据.length / this.显示总行数));

    },
  },
  methods: {

    获取序号(obj){

      let r
      r=this.排序数据.findIndex(item => item.id === obj.id)
      return r
    }
    ,
    排除(item,event){
      //将其转换为时间戳 "2024-08-30T10:45:22.806Z"
      // new Date(item.updatedAt);
      // console.log()
      this.排除ID.push({"id":item.id,"updatedAt":new Date(item.updatedAt).getTime()})
      let 十分钟前 = Date.now() - 10 * 60 * 1000;
      this.排除ID.filter(item => item.updatedAt> 十分钟前)
      // console.log(this.排除ID)
    },


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
    handleRowClick(item,event) {
      // console.log(item)
      if(!item.id)return;
      if(item.id===this.sel_id){
        this.sel_id=0
        // 返回当前行的item
        this.$emit('row-cancel-clicked', item);
      }else{
        this.sel_id=item.id
        // 返回当前行的item
        this.$emit('row-clicked', item);
      }


    },
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
    第一页() {
      this.当前页=0

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
.highlight {
  background-color: red  !important;
}
table {
  width: 800px;
  border-collapse: collapse;
}

 .表序号{
  width: 50px;
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
  color: blue;
}
</style>