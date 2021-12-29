<template>
  <div style="height: 100%">
    <div style="height: 20%">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日结转
              </div>
              <count-to :start-val="0" :end-val="todayIncome" :duration="2000" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('shoppings')">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="shopping" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                昨日结转
              </div>
              <count-to :start-val="0" :end-val="lastdayIncome" :duration="2000" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="message" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                本月结转
              </div>
              <count-to :start-val="0" :end-val="monthIncome" :duration="2000" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                上月结转
              </div>
              <count-to :start-val="0" :end-val="lastMonthIncome" :duration="2000" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="height: 80%;margin: 0 auto;width: 100%;display:flex;justify-content:center;align-items:center;">
      <div id="echarts2" style="width: 600px;height: 400px">

      </div>
      <div id="echarts1" style="width: 600px;height: 400px">

      </div>

    </div>
  </div>
</template>

<script>
import {getTodayInComeJs, getMonthInComeJs, getLastMonthInComeJs, getLastDayInComeJs,getAllMonthInCome,getAllDayInCome} from "@/api/index";
import countTo from 'vue-count-to';

export default {
  name: "index",
  components: {countTo},
  data() {
    return {
      // 版本号
      version: "3.4.0",
      todayIncome: '0',
      lastdayIncome: '0',
      monthIncome: '0',
      lastMonthIncome: '0',
      allMonthInCome:[],
      allDaysInCome:[]
    };
  },
  created() {

    this.getTodayInCome();
    this.getMonthInCome();
    this.getLastMonthInCome();
    this.getLastDayInCome();
    this.getAllMonthInCome();
    this.getAllDayInCome();
  },
  mounted() {

  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    getTodayInCome() {
      //查询今日学费收入
      getTodayInComeJs().then(response => {
        this.todayIncome = response;
      });
    },
    getLastDayInCome() {
      //查询昨日学费收入
      getLastDayInComeJs().then(response => {
        this.lastdayIncome = response;
      });
    },
    getMonthInCome() {
      //查询本月学费收入
      getMonthInComeJs().then(response => {
        this.monthIncome = response;
      });
    },
    getLastMonthInCome() {
      //查询上月学费收入
      getLastMonthInComeJs().then(response => {
        this.lastMonthIncome = response;
      });
    },
    getAllMonthInCome() {
      //查询今年每月的收入
      getAllMonthInCome().then(response => {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          this.allMonthInCome[i] = [response[i].month,response[i].money];
        }
        console.log(this.allMonthInCome);
        this.drawLine();
        // this.allMonthInCome = response;
      });
    },
    getAllDayInCome() {
      //查询当月每日的收入
      getAllDayInCome().then(response => {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          this.allDaysInCome[i] = [response[i].days,response[i].money];
        }
        console.log(this.allDaysInCome);
        this.drawLine2();
        // this.allMonthInCome = response;
      });
    },
    drawLine() {
      var _self = this;

      var option = {
        animation: "auto",
        animationDuration: 3000,
        animationDurationUpdate: 500,
        title:{
          text:"今年结转统计",
          left:"center"
        },
        xAxis: {
          type: "category",
          name: "月份",
          axisTick: {
            alignWithLabel: true,
          },
          nameLocation: "middle",
          nameGap: 30,
          scale: true,
          axisLine: {
            onZero: false,
          },
          axisLabel: {
            formatter: function(value) {
              return value + "月";
            },
          },
        },
        yAxis: {
          type: "value",
          name: "结转",
          nameLocation: "middle",
          scale: true,
          nameGap: 50,
          axisLabel: {
            formatter: function(value) {
              return value + "";
            },
          },
        },
        grid: {
          left: 80,
          top:80
        },
        legend: [{
          orient: "horizontal", //vertical
          x: "right", //可设定图例在左、右、居中
          y: "bottom", //可设定图例在上、下、居中
          padding: [0, 50, 25, 0],
          icon: "rect", // 用矩形替换
          itemWidth: 25, //矩形宽度
          itemHeight: 6, //矩形高度
        }
        ],
        tooltip: {
          show: true, // 是否显示
          trigger: "axis", // 触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
          backgroundColor: "rgba(255,255,255,0.8)", //通过设置rgba调节背景颜色与透明度
          color: "black",
          borderWidth: "1",
          borderColor: "gray",
          textStyle: {
            color: "black",
          },
        },
        backgroundColor: "#FFF",
        series: [{
          symbol: 'none', //取消折点圆圈
          data: _self.allMonthInCome,
          type: 'line'
        }]
      };


      /*ECharts图表*/
      var myChart = this.$echarts.init(document.getElementById("echarts1"));
      myChart.setOption(option, true);
    },
    drawLine2() {
      var _self = this;

      var option = {
        animation: "auto",
        animationDuration: 3000,
        animationDurationUpdate: 500,
        title:{
          text:"当月结转统计",
          left:"center"
        },
        xAxis: {
          type: "category",
          name: "日期",
          axisTick: {
            alignWithLabel: true,
          },
          nameLocation: "middle",
          nameGap: 30,
          scale: true,
          axisLabel: {
            formatter: function(value) {
              return value + "号";
            },
          },
        },
        yAxis: {
          type: "value",
          name: "结转",
          nameLocation: "middle",
          scale: true,
          nameGap: 50,
          axisLabel: {
            formatter: function(value) {
              return value + "";
            },
          },
        },
        grid: {
          left: 80,
          top:80
        },
        legend: [{
          orient: "horizontal", //vertical
          x: "right", //可设定图例在左、右、居中
          y: "bottom", //可设定图例在上、下、居中
          padding: [0, 50, 25, 0],
          icon: "rect", // 用矩形替换
          itemWidth: 25, //矩形宽度
          itemHeight: 6, //矩形高度
        }
        ],
        tooltip: {
          show: true, // 是否显示
          trigger: "axis", // 触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
          backgroundColor: "rgba(255,255,255,0.8)", //通过设置rgba调节背景颜色与透明度
          color: "black",
          borderWidth: "1",
          borderColor: "gray",
          textStyle: {
            color: "black",
          },
        },
        backgroundColor: "#FFF",
        series: [{
          symbol: 'none', //取消折点圆圈
          data: _self.allDaysInCome,
          type: 'line'
        }]
      };


      /*ECharts图表*/
      var myChart = this.$echarts.init(document.getElementById("echarts2"));
      myChart.setOption(option, true);
    },
  },
};

</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

