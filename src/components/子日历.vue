<template>
  <div class="calendar">

    <div class="calendar-time-header">
      <div class="calendar-time"></div> <!-- 空白单元格用于对齐 -->
      <div v-for="date in dates" :key="date" class="calendar-date">
        {{ date }}
      </div>
    </div>
    <div class="calendar-body">
      <div v-for="hour in hours" :key="hour" class="calendar-row">
        <div class="calendar-time">{{ hour }}:00</div>
        <div v-for="date in dates" :key="date" class="calendar-cell">
          <CellComponent
                         :数据="数据[getTimestamp(date, hour)]"

          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CellComponent from './CellComponent.vue'; // 假设每个单元格的组件叫做CellComponent

export default {
  components: { CellComponent },
  props:{
    数据: {
      type: Object,
      default: () => ({}),  // 默认值为空对象
    },
  },
  methods:{
    // 生成对应单元格的时间戳
    getTimestamp(date, hour) {

      const [year,month, day] = date.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day, hour);
      return dateObj.getTime();
    },
  },
  data() {
    const today = new Date();
    const dates = [];
    const hours = Array.from({length: 24}, (_, i) => i);

    // 生成从今天开始的7天日期数组
    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toLocaleDateString());
    }

    return {
      dates,
      hours,
    };
  },
};
</script>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: 100px repeat(4, 1fr);
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
</style>
