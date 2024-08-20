<template>
  <div class="container">
    <div class="left-panel">
      <div class="selector">
        <label>选择相纸尺寸</label>
        <select v-model="相纸尺寸">
          <option value="4R">4R (4*6 英寸)</option>
          <option value="3R">3R (3*5 英寸)</option>
        </select>
      </div>
      <div class="selector">
        <label>选择设备DPI</label>
        <select v-model="DPI">
          <option value="300">300 DPI</option>
          <option value="600">600 DPI</option>
        </select>
      </div>
      <div class="selector">
        <label>组合方式</label>
        <select v-model="布局方式">
          <option v-for="(value, key) in 布局选项[相纸尺寸]" :key="key" :value="key">{{ key }}</option>
        </select>
      </div>
      <div>
        <button @click="选择照片">选择照片</button>
      </div>
      <div class="thumbnail-container">
        <div v-for="(image, index) in 预览图片" :key="index" class="thumbnail">
          <img :src="image" :alt="'照片 ' + (index + 1)" />
        </div>
      </div>
    </div>

    <div class="right-panel">
      <div class="preview-container">
        <div
            v-for="(row, rowIndex) in 布局选项[相纸尺寸][布局方式].rows"
            :key="rowIndex"
            class="preview-row"
        >
          <div
              v-for="(size, colIndex) in row"
              :key="colIndex"
              :style="获取缩放样式(size, 布局图片索引[rowIndex][colIndex])"
              @click="切换照片(rowIndex, colIndex)"
              class="preview-image"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      相纸尺寸: "4R", // 默认相纸尺寸
      DPI: 300, // 默认DPI
      布局方式: "1寸*8+2寸*4", // 默认布局方式
      当前预览图片: "", // 当前显示的图片
      预览图片: [], // 存储所有选择的图片
      当前图片索引: 0, // 当前正在预览的图片索引
      布局图片索引: [], // 记录每个布局中当前显示的图片索引
      布局选项: {
        "4R": {
          "1寸*8+2寸*4": {
            orientation: "正", // 高度大于宽度
            rows: [
              ["1寸", "1寸", "1寸", "1寸"],
              ["1寸", "1寸", "1寸", "1寸"],
              ["2寸侧", "2寸侧"],
              ["2寸侧", "2寸侧"],
            ],
          },
        },
        "3R": {
          "1寸*4+2寸*2": {
            orientation: "正",
            rows: [
              ["1寸侧", "1寸侧"],
              ["1寸侧", "1寸侧"],
              ["2寸", "2寸"],
            ],
          },
        },
      },
    };
  },
  methods: {
    // 选择照片功能
    选择照片() {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.accept = "image/*";
      input.onchange = (event) => {
        const files = Array.from(event.target.files);
        this.预览图片 = files.map((file) => URL.createObjectURL(file));
        this.当前预览图片 = this.预览图片[0]; // 默认显示第一张图片
        this.初始化布局图片索引();
      };
      input.click();
    },
    // 初始化布局中每个图片的索引
    初始化布局图片索引() {
      this.布局图片索引 = this.布局选项[this.相纸尺寸][this.布局方式].rows.map(row => row.map(() => 0));
    },
    // 切换单个照片功能
    切换照片(rowIndex, colIndex) {
      // 获取当前图片的索引
      const 当前索引 = this.布局图片索引[rowIndex][colIndex];
      // 计算下一个图片的索引
      const 新索引 = (当前索引 + 1) % this.预览图片.length;
      // 更新对应位置的图片索引
      this.布局图片索引[rowIndex][colIndex] = 新索引;
    },
    // 计算图片实际尺寸
    计算图片实际尺寸(尺寸描述) {
      const 英寸尺寸 = {
        "1寸": { width: 1, height: 1.5 },
        "2寸": { width: 1.5, height: 2 },
        "1寸侧": { width: 1.5, height: 1 }, // 旋转90度
        "2寸侧": { width: 2, height: 1.5 }, // 旋转90度
      };
      const 英寸宽高 = 英寸尺寸[尺寸描述];
      return {
        width: 英寸宽高.width * this.DPI,
        height: 英寸宽高.height * this.DPI,
      };
    },
    // 计算缩放比例，保持原比例
    计算缩放比例(图片宽度, 图片高度, 容器宽度, 容器高度) {
      const 宽度比例 = 容器宽度 / 图片宽度;
      const 高度比例 = 容器高度 / 图片高度;
      const 缩放比例 = Math.min(宽度比例, 高度比例);
      return 缩放比例;
    },
    // 获取缩放后的样式
    获取缩放样式(尺寸描述, 图片索引) {
      const { width, height } = this.计算图片实际尺寸(尺寸描述);
      const 容器宽度 = 300; // 固定宽度300px
      const 缩放比例 = this.计算缩放比例(width, height, 容器宽度, height);

      return {
        width: `${width * 缩放比例}px`,
        height: `${height * 缩放比例}px`,
        backgroundImage: `url(${this.预览图片[图片索引]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    },
  },
  watch: {
    // 当布局方式或相纸尺寸发生变化时，更新预览
    布局方式() {
      this.初始化布局图片索引();
    },
    相纸尺寸() {
      this.初始化布局图片索引();
    },
  },
  mounted() {
    this.初始化布局图片索引(); // 初始加载时初始化一次
  },
};
</script>


<style scoped>
.container {
  display: flex;
}
.left-panel {
  width: 200px;
  margin-right: 20px;
}
.selector {
  margin-bottom: 10px;
}
.thumbnail-container {
  display: flex;
  flex-wrap: wrap;
}
.thumbnail {
  width: 100px;
  height: 150px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.right-panel {
  flex-grow: 1;
}
.preview-container {
  display: flex;
  flex-direction: column;
}
.preview-row {
  display: flex;
  margin-bottom: 10px;
}
.preview-image {
  width: 300px; /* 固定宽度 */
  height: 300px; /* 固定高度 */
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
