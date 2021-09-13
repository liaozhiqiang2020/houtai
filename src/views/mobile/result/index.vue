<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="手机号" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入中奖人手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学员" prop="studentId">
        <el-select v-model="queryParams.studentId" placeholder="请选择学员">
          <el-option
            v-for="item in studentOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中奖时间" prop="drawDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.drawDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择中奖时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="奖品" prop="drawPrize">
        <el-input
          v-model="queryParams.drawPrize"
          placeholder="请输入奖品"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="几等奖" prop="drawAwards">
        <el-select v-model="queryParams.drawAwards" placeholder="请选择几等奖" clearable size="small">
          <el-option
            v-for="dict in drawAwardsOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否兑奖" prop="isCashPrize">
        <el-select v-model="queryParams.isCashPrize" placeholder="请选择是否兑奖" clearable size="small">
          <el-option
            v-for="dict in isCashPrizeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mobile:result:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mobile:result:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mobile:result:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:result:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="resultList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="中奖人" align="center" prop="studentName" :show-overflow-tooltip="true"/>
      <el-table-column label="手机号" align="center" prop="tel" :show-overflow-tooltip="true"/>
      <el-table-column label="中奖时间" align="center" prop="drawDate" width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.drawDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品" align="center" prop="drawPrize" :show-overflow-tooltip="true"/>
      <el-table-column label="几等奖" align="center" prop="drawAwards" :formatter="drawAwardsFormat" />
      <el-table-column label="是否兑奖" align="center" prop="isCashPrize" :formatter="isCashPrizeFormat" />
      <el-table-column label="兑奖操作人" align="center" prop="cashPrizePeople" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:result:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:result:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="duijiang2(scope.row)"
            v-hasPermi="['mobile:result:edit']"
          >兑奖
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改抽奖结果对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="中奖人手机号" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入中奖人手机号" />
        </el-form-item>
        <el-form-item label="中奖时间" prop="drawDate">
          <el-date-picker clearable size="small"
            v-model="form.drawDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择中奖时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="奖品" prop="drawPrize">
          <el-input v-model="form.drawPrize" placeholder="请输入奖品" />
        </el-form-item>
        <el-form-item label="几等奖" prop="drawAwards">
          <el-select v-model="form.drawAwards" placeholder="请选择几等奖">
            <el-option
              v-for="dict in drawAwardsOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否兑奖(0 未兑奖，1已兑奖)" prop="isCashPrize">
          <el-select v-model="form.isCashPrize" placeholder="请选择是否兑奖(0 未兑奖，1已兑奖)">
            <el-option
              v-for="dict in isCashPrizeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑奖操作人" prop="cashPrizePeople">
          <el-input v-model="form.cashPrizePeople" placeholder="请输入兑奖操作人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listResult, getResult, delResult, addResult, updateResult,duijiang, exportResult } from "@/api/mobile/result";
import {placeList,studentList,courseList,coachList} from "@/api/mobile/student";

export default {
  name: "Result",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 抽奖结果表格数据
      resultList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 几等奖字典
      drawAwardsOptions: [],
      //学员选项
      studentOptions:[],
      // 是否兑奖(0 未兑奖，1已兑奖)字典
      isCashPrizeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tel: null,
        drawDate: null,
        drawPrize: null,
        drawAwards: null,
        isCashPrize: null,
        cashPrizePeople: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getStduentOption();
    this.getDicts("draw_type").then(response => {
      this.drawAwardsOptions = response.data;
    });
    this.getDicts("is_draw_cash").then(response => {
      this.isCashPrizeOptions = response.data;
    });
  },
  methods: {
    /** 查询抽奖结果列表 */
    getList() {
      this.loading = true;
      listResult(this.queryParams).then(response => {
        this.resultList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询学员下拉列表
    getStduentOption(){
      studentList().then(response => {
        this.studentOptions = response;
        this.loading = false;
      });
    },
    // 几等奖字典翻译
    drawAwardsFormat(row, column) {
      return this.selectDictLabel(this.drawAwardsOptions, row.drawAwards);
    },
    // 是否兑奖(0 未兑奖，1已兑奖)字典翻译
    isCashPrizeFormat(row, column) {
      return this.selectDictLabel(this.isCashPrizeOptions, row.isCashPrize);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        tel: null,
        drawDate: null,
        drawPrize: null,
        drawAwards: null,
        isCashPrize: null,
        cashPrizePeople: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加抽奖结果";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getResult(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改抽奖结果";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateResult(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addResult(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除抽奖结果编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delResult(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 兑奖按钮操作 */
    duijiang2(row) {
      const ids = row.id || this.ids;
      console.log(ids);
      this.$confirm('是否确认兑奖', "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {

        return duijiang(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("兑奖成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有抽奖结果数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportResult(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
