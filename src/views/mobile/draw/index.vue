<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['mobile:draw:add']"
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
          v-hasPermi="['mobile:draw:edit']"
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
          v-hasPermi="['mobile:draw:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:draw:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="drawList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="一等奖" align="center" prop="firstName" :show-overflow-tooltip="true"/>
      <el-table-column label="概率" align="center" prop="firstChance" />
      <el-table-column label="二等奖" align="center" prop="secondName" :show-overflow-tooltip="true"/>
      <el-table-column label="概率" align="center" prop="secondChance" />
      <el-table-column label="三等奖" align="center" prop="thirdName" :show-overflow-tooltip="true"/>
      <el-table-column label="概率" align="center" prop="thirdChance" />
      <el-table-column label="四等奖" align="center" prop="fourName" :show-overflow-tooltip="true"/>
      <el-table-column label="概率" align="center" prop="fourChance" />
      <el-table-column label="五等奖" align="center" prop="fiveName" :show-overflow-tooltip="true"/>
      <el-table-column label="概率" align="center" prop="fiveChance" />
      <el-table-column label="几节课一抽" align="center" prop="classCount" :show-overflow-tooltip="true"/>
      <el-table-column label="活动开始时间" align="center" prop="startDate" width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:draw:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:draw:remove']"
          >删除</el-button>
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

    <!-- 添加或修改幸运抽奖对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="一等奖" prop="firstName">
          <el-input v-model="form.firstName" placeholder="请输入一等奖" />
        </el-form-item>
        <el-form-item label="概率" prop="firstChance">
          <el-input v-model="form.firstChance" placeholder="请输入概率" />
        </el-form-item>
        <el-form-item label="二等奖" prop="secondName">
          <el-input v-model="form.secondName" placeholder="请输入二等奖" />
        </el-form-item>
        <el-form-item label="概率" prop="secondChance">
          <el-input v-model="form.secondChance" placeholder="请输入概率" />
        </el-form-item>
        <el-form-item label="三等奖" prop="thirdName">
          <el-input v-model="form.thirdName" placeholder="请输入三等奖" />
        </el-form-item>
        <el-form-item label="概率" prop="thirdChance">
          <el-input v-model="form.thirdChance" placeholder="请输入概率" />
        </el-form-item>
        <el-form-item label="四等奖" prop="thirdName">
          <el-input v-model="form.fourName" placeholder="请输入四等奖" />
        </el-form-item>
        <el-form-item label="概率" prop="thirdChance">
          <el-input v-model="form.fourChance" placeholder="请输入概率" />
        </el-form-item>
        <el-form-item label="五等奖" prop="thirdName">
          <el-input v-model="form.fiveName" placeholder="请输入五等奖" />
        </el-form-item>
        <el-form-item label="概率" prop="thirdChance">
          <el-input v-model="form.fiveChance" placeholder="请输入概率" />
        </el-form-item>
        <el-form-item label="几节课一抽" prop="classCount">
          <el-input v-model="form.classCount" placeholder="请输入几节课一抽" />
        </el-form-item>
        <el-form-item label="活动开始时间" prop="startDate">
          <el-date-picker clearable size="small"
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="活动开始时间">
          </el-date-picker>
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
import { listDraw, getDraw, delDraw, addDraw, updateDraw, exportDraw } from "@/api/mobile/draw";

export default {
  name: "Draw",
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
      // 幸运抽奖表格数据
      drawList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
  },
  methods: {
    /** 查询幸运抽奖列表 */
    getList() {
      this.loading = true;
      listDraw(this.queryParams).then(response => {
        this.drawList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        firstName: null,
        firstChance: null,
        secondName: null,
        secondChance: null,
        thirdName: null,
        thirdChance: null,
        fourName: null,
        fourChance: null,
        fiveName: null,
        fiveChance: null,
        startDate: null
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
      this.title = "添加幸运抽奖";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDraw(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改幸运抽奖";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDraw(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDraw(this.form).then(response => {
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
      this.$confirm('是否确认删除幸运抽奖编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDraw(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有幸运抽奖数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDraw(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
