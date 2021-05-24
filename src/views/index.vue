<template>
  <div class="app-container home">
    <div class="content-wrapper">
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="info-box">
                <span class="info-box-icon bg-green"><i class="fa fa-check" aria-hidden="true"></i></span>

                <div class="info-box-content">
<!--                  <span class="info-box-text">今日教练人数</span>-->
<!--                  <span class="info-box-number">-->
<!--                                <p style="font-size: 30px;">-->
<!--                                    <a href="#" target="_blank" id="nmoDevice">1</a>人-->
<!--                                </p>-->
<!--                            </span>-->
                </div>
                <!-- /.info-box-content -->
              </div>
              <!-- /.info-box -->
            </div>
            <!-- /.col -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="info-box">

                        <span class="info-box-icon bg-yellow">
                            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        </span>
                <div class="info-box-content">
                  <span class="info-box-text">本月学费收入</span>
                  <span class="info-box-number">
                                <p style="font-size: 30px;">
                                    <a href="#" target="_blank" id="expDevice">{{monthIncome}}</a>元
                                </p>
                            </span>

                  <div style="position: absolute; left:360px; top:3px;">
                    <p style="font-size: 24px; color: lightgray;">
                      <i class="fa fa-refresh test" aria-hidden="true"></i>
                    </p>
                  </div>
                </div>
                <!-- /.info-box-content -->
              </div>
              <!-- /.info-box -->
            </div>
            <!-- /.col -->

            <!-- fix for small devices only -->
            <div class="clearfix visible-sm-block"></div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="info-box">
                <span class="info-box-icon bg-green"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">今日学费收入</span>
                  <span class="info-box-number">
                                <p style="font-size: 30px;">
                                <a href="#" target="_blank" id="yedInc">{{todayIncome}}</a>元
                                </p>
                            </span>
                </div>
                <!-- /.info-box-content -->
              </div>
              <!-- /.info-box -->
            </div>
            <!-- /.col -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="info-box">

                <span class="info-box-icon bg-navy"><i class="ion ion-ios-people-outline"></i></span>

                <div class="info-box-content">
<!--                  <span class="info-box-text">今日报名人数</span>-->
<!--                  <span class="info-box-number">-->
<!--                                <p style="font-size: 30px;">-->
<!--                                <a href="#" target="_blank" id="orderCount">0</a>人-->
<!--                                </p>-->
<!--                            </span>-->
                </div>


              </div>

            </div>

          </div>

        </div>
      </section>
    </div>

  </div>
</template>

<script>
import { getTodayInComeJs,getMonthInComeJs} from "@/api/index";

export default {
  name: "index",
  data() {
    return {
      // 版本号
      version: "3.4.0",
      todayIncome:'0',
      monthIncome:'0'
    };
  },
  created() {
    this.getTodayInCome();
    this.getMonthInCome();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    getTodayInCome(){
      //查询今日学费收入
      getTodayInComeJs().then(response => {
          this.todayIncome = response;
      });
    },
    getMonthInCome(){
      //查询本月学费收入
      getMonthInComeJs().then(response => {
        this.monthIncome = response;
      });
    }
  },
};

</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

