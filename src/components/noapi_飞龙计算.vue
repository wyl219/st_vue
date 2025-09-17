<template>

  <div>
    <h1>飞龙小熊手 (本地版)</h1>

    <LevelInput
        @等级="设定等级"
        :rawLevel="等级范围.join(',')"
    >等级限制
    </LevelInput>

    <br>
    <TableComponent1
        :表头="汇总表头"
        :原始数据="选择装备"
        :num=50
    />

    <a @click="tt()">点击更新</a>
    <TableComponent
        :模块="'飞龙'"
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
        :模块="'飞龙'"
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
        :模块="'飞龙'"
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
        :模块="'飞龙'"
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
      此为本地版本，不包含市场价格相关数据.<br>
      屠龙大炮已计算1.2倍的加成.
    </p>
  </div>

</template>

<script>

import TableComponent from './表格组件.vue';
import TableComponent1 from './汇总表格组件.vue';
import {金币格式转换} from './com.js'
import LevelInput from "@/components/等级组件.vue";
import {useCounterStore} from "@/stores/useCounterStore.js";

// 本地版checkAir函数，不依赖外部API
async function checkAirLocal(tTypeFil = 'o', 等级范围 = null, tag1Fil = ["common"]) {
    try {
        // 从本地加载必要的JSON数据
        const ITEM_JSON = await fetch('/src/components/data/items.json').then(res => res.json());
        const ZH_JSON = await fetch('/src/components/data/texts_zh.json').then(res => res.json()).then(data => data.texts);
        const itemType = await fetch('/src/components/data/item_type.json').then(res => res.json());
        
        // 过滤函数
        function filListLocal(listAll, tTypeFil, 等级范围, tag1Fil) {
            return listAll.filter(item => {
                if (tTypeFil && item['tType'] !== tTypeFil) return false;
                if (等级范围 && (!等级范围.includes(item['tier']))) {
                    return false;
                }
                if (!item['tag1']) item['tag1'] = 'common';
                if (tag1Fil && !tag1Fil.includes(item['tag1'])) return false;
                return true;
            });
        }
        
        // 获取蓝图信息
        async function getBpLocal(uid) {
            let itemData = JSON.parse(JSON.stringify(ITEM_JSON[uid]));  // Deep copy
            
            let 名称;
            try {
                名称 = ZH_JSON[`${uid}_name`];
            } catch (error) {
                名称 = '未找到';
            }
            
            const 装备类别 = ZH_JSON[itemType[itemData['type']]];
            
            let 单工人经验;
            if (itemData['worker3']) {
                单工人经验 = Math.floor(itemData['craftXp'] / 3);
            } else if (itemData['worker2']) {
                单工人经验 = Math.floor(itemData['craftXp'] / 2);
            } else {
                单工人经验 = itemData['craftXp'];
            }
            
            let 飞龙威力, 飞龙类别;
            if (!["符文石", "月光石", "材料", "光环", "使魔"].includes(装备类别)) {
                飞龙威力 = Math.floor(
                    (itemData['atk'] * 0.8 + itemData['def'] * 1.2 + itemData['hp'] * 5) *
                    (1 + itemData['eva'] * 10 + itemData['crit'] * 10)
                );
                if(uid==="artifactgun")飞龙威力*=1.2; // 屠龙大炮特殊加成
                飞龙类别 = {
                    "a": "护甲",
                    "b": "副甲",
                    "g": "副甲",
                    "h": "副甲",
                    "w": "武器",
                    "u": "饰品",
                    "x": "饰品",
                    "f": "饰品",
                    "z": "附魔",
                }[itemData['type'][0]];
            } else {
                飞龙威力 = 0;
                飞龙类别 = "不可用";
            }
            
            let 亲和="";
            let t_亲和=[];
            if (itemData['elementAffinity']){
                t_亲和.push(ZH_JSON["element_"+itemData['elementAffinity']]);
            }
            if (itemData['spiritAffinity']){ 
                try {
                    t_亲和.push(ZH_JSON[itemData['spiritAffinity']+"_name_o"]);
                } catch (e) {
                    // 忽略亲和数据缺失的情况
                }
            }
            if (t_亲和.length>0){
                亲和=t_亲和.join(',');
            }
            
            let 自带附魔 = false;
            if (itemData["lTag2"]||itemData["lTag3"]){
                自带附魔=true;
            }
            
            return {
                itemData,
                名称,
                装备类别,
                飞龙威力,
                飞龙类别,
                单工人经验,
                亲和,
                自带附魔,
                tier: itemData['tier']
            };
        }
        
        // 获取项目数据
        async function getProjectData(uid) {
            const blueprint = {"uid": uid, "tag1": "common"};
            try {
                return await getBpLocal(uid);
            } catch (error) {
                console.error(`获取项目 ${uid} 失败:`, error);
                return null;
            }
        }
        
        // 清理数据
        function filDataDescLocal(dataDesc) {
            const uniqueMap = new Map();
            dataDesc.forEach(item => {
                const tmpId = `${item['uid']}`;
                if (!uniqueMap.has(tmpId)) {
                    uniqueMap.set(tmpId, item);
                }
            });
            return Array.from(uniqueMap.values());
        }
        
        // 准备要处理的项目列表
        const projectList = [];
        for (let uid in ITEM_JSON) {
            const itemData = ITEM_JSON[uid];
            // 过滤出有效的装备类型
            if (tTypeFil && itemData['tType'] !== tTypeFil) continue;
            if (等级范围 && !等级范围.includes(itemData['tier'])) continue;
            
            const project = await getProjectData(uid);
            if (project && project['飞龙威力'] > 0 && project['飞龙类别'] !== '不可用') {
                projectList.push(project);
            }
        }
        
        // 清理数据并按飞龙威力降序排序
        const cleanedList = filDataDescLocal(projectList);
        const sortedDataDesc = cleanedList.sort((a, b) => b['飞龙威力'] - a['飞龙威力']);
        
        return sortedDataDesc;
    } catch (error) {
        console.error('checkAirLocal函数执行出错:', error);
        throw error;
    }
}

export default {
  components: {
    LevelInput,
    TableComponent,
    TableComponent1
  },
  methods: {
    设定等级(new等级范围) {
      this.store.set飞龙等级限制(new等级范围)
      this.tt()
    },

    async tt() {
      this.数据 = []
      this.数据 = await checkAirLocal(undefined, this.等级范围);
    },
    handleRowClicked(row) {
      const lb = row['飞龙类别']
      if (lb && this.选择装备.find(item => item[0] === lb)) {
        this.选择装备.find(item => item[0] === lb)[1] = row
      }
    },
    handleRowCancelClicked(row) {
      const lb = row['飞龙类别']
      if (lb && this.选择装备.find(item => item[0] === lb)) {
        this.选择装备.find(item => item[0] === lb)[1] = {}
      }
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
        "等级": "tier", "类别": "装备类别", 
        "飞龙威力": "飞龙威力",
        "亲和": "亲和", "自带附魔": "自带附魔"
      },

      选择装备: [["武器", {}], ["饰品", {}],
        ["护甲", {}], ["副甲", {}],
        ["合计", {
          "名称": "",
          "飞龙威力": 0
        }]
      ],

      表头: {
        "名称": "名称",
        "等级": "tier", "类别": "装备类别", 
        "飞龙威力": "飞龙威力", 
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