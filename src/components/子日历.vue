<template>
  <div class="calendar">

    <tr class="calendar-time-header">
      <th class="calendar-time"></th> <!-- 空白单元格用于对齐 -->
      <th v-for="date in dates" :key="date" class="calendar-date">
        {{ date }}
      </th>
    </tr>
    <table class="calendar-body">
      <tr class="calendar-row" >
<!--        特殊事件,满月,boss更新,闪回以及周期活动-->
        <td class="calendar-time"> 特殊事件 </td>
        <td v-for="date in dates" :key="date" class="calendar-cell">

          <CellComponent

              :特殊事件="true"

              :时间戳="getTimestamp(date, 0)"

          />
        </td>

      </tr>



      <tr v-for="hour in hours" :key="hour" class="calendar-row">
        <td class="calendar-time">{{ getLocalHour(hour) }}</td>
        <td v-for="date in dates" :key="date" class="calendar-cell"
        :class=" {'金色外框' : noPersistStore.是否已选中(getTimestamp(date, hour))}"
            @click="选中时间戳(getTimestamp(date, hour))"
        >

          <CellComponent

                         :装备类型="装备类型"
                         :时间戳="getTimestamp(date, hour)"

          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import CellComponent from './CellComponent.vue';
import {useCounterStore,useNoPersistCounterStore} from "@/stores/useCounterStore.js"; // 假设每个单元格的组件叫做CellComponent

export default {
  components: { CellComponent },
  props:{
    数据: {
      type: Object,
      default: () => ({}),  // 默认值为空对象
    },
    装备类型:{
      type: Object,
      default: () => ({}),  // 默认值为空对象
    }
  },
  computed:{




    hours(){
      return  this.store.日历显示时间
    }
  },
  methods:{
    选中时间戳(时间戳){
      this.noPersistStore.修改选中时间戳(时间戳)
    },


    // 根据UTC小时数,生成本地小时数
    getLocalHour(utcHour) {
      const offset = new Date().getTimezoneOffset()/60;
      // console.log(offset)
      let localHour =  utcHour -offset ;
      let sAdd=""
      if(localHour < 0){
        localHour+=24
        sAdd="(-1D)"
      }else if(localHour>=24){
        localHour-=24
        sAdd="(+1D)"
      }
      let s=`${localHour}:00${sAdd}\n(UTC${utcHour}:00)`
      return s

    },
    // 生成对应单元格的时间戳
    getTimestamp(date, hour) {

      const [year,month, day] = date.split('/').map(Number);
      // const dateObj = new Date(year, month - 1, day, hour);


      // return dateObj.getTime();

      return Date.UTC(year, month - 1, day, hour);
    },
  },
  data() {
    const today = new Date();
    const dates = [];
    const store= useCounterStore()

    const noPersistStore = useNoPersistCounterStore()
    // const hours = Array.from({length: 24}, (_, i) => i);

    // const hours = [-8,-4,0,12]
    // const hours = [0,12,16,20]
    // const hours =store.日历显示时间

    // 生成从今天开始的7天日期数组
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i -1);
      dates.push(date.toLocaleDateString());
    }
    console.log(dates)

    return {
      store,
      dates,
      noPersistStore
      // hours,
    };
  },
};
</script>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: 100px repeat(5, 1fr);
  grid-template-rows: auto;
  gap: 1px;
}

.calendar-time-header {
  display: contents;
}

.calendar-time-header .calendar-time {
  background-color: #f0f0f0;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.calendar-date {
  text-align: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  width: 200px;
}

.calendar-body {
  display: contents;
}

.calendar-row {
  display: contents;
}

.calendar-time {
  text-align: right;
  padding: 10px;
  border-right: 1px solid #ccc;
  background-color: #f0f0f0;
}

.calendar-cell {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  width: 200px;
}

.金色外框 {
  border: 2px solid gold; /* 例如，用金色边框 */
  /* 你可以添加其他样式，如背景色、阴影等 */
}
</style>
