<script >
export default {

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
    整合数据(){
      const cnTypeCount = {};
      let data=this.数据
      // 遍历每个角色的数据
      for (const key in data) {
        const cnTypes = data[key].cnType;

        // 统计每个 cnType 出现的次数
        cnTypes.forEach(cnType => {
          if (cnTypeCount[cnType]) {
            cnTypeCount[cnType]++;
          } else {
            cnTypeCount[cnType] = 1;
          }
        });
      }

      // 转换为数组形式
      const result = Object.entries(cnTypeCount).map(([key, value]) => {
        return [ key, value ];
      });

      return result;
    },
    筛选后数据(){
      // console.log(this.整合数据)

      if (this.装备类型.length<1) {

        return this.整合数据}

      const 筛选后数据 = this.整合数据.filter(item => {return this.装备类型[item[0]]})
      return 筛选后数据
    }
  },
  data(){
    return {
      氪金工人装备类型: {
        "重甲": false,
        "轻甲": false,
        "中甲": false,
        "重鞋": false,
        "轻鞋": false,
        "铁护手": false,
        "护腕": false,
        "头盔": false,
        "法师帽": false,
        "盗贼帽": false,
        "草药": false,
        "药水": false,
        "法术": false,
        "斧": false,
        "弓": false,
        "弩": false,
        "匕首": false,
        "火枪": true,
        "锤": false,
        "矛": false,
        "剑": false,
        "法杖": false,
        "魔杖": true,
        "护身符": false,
        "斗篷": true,
        "使魔": true,
        "戒指": false,
        "盾牌": false,
        "光环": true,
        "餐食": false,
        "甜点": true,
        "乐器": true
      },
    }
  }
}

</script>

<template>
<div>

<!--  <span v-for="(item, index)  in 整合数据" :key="index"-->
<!--        :class="{-->
<!--        [`times_${item[1]}`]: true,-->
<!--        '氪金线': 氪金工人装备类型[item[0]]-->
<!--      }"-->
<!--  > {{item[0]}}-->
<!--  </span>-->
<!--  <span >,</span>-->
  <span v-for="(item, index) in 筛选后数据" :key="index">
    <span :class="{
          [`times_${item[1]}`]: true,
          '氪金线': 氪金工人装备类型[item[0]]
        }">
      {{ item[0] }}</span>
    <span v-if="index < 筛选后数据.length - 1">,</span>
  </span>

</div>
</template>

<style scoped>
span .氪金线{

  text-shadow:
      1px 1px 1px gold,   /* 水平偏移 1px，垂直偏移 1px，模糊半径 2px，颜色金色 */
      -1px -1px 1px gold, /* 水平偏移 -1px，垂直偏移 -1px，模糊半径 2px，颜色金色 */
      1px -1px 1px gold,  /* 水平偏移 1px，垂直偏移 -1px，模糊半径 2px，颜色金色 */
      -1px 1px 1px gold;
}
span .times_1{
  color: black;
}
span .times_2{
  color: red;
  font-size: large;
}
span .times_3{
  color: purple;
  font-size: larger;
}
</style>