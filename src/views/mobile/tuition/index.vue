<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="课程名" prop="courseId">-->
<!--        <el-select v-model="queryParams.courseId" placeholder="请选择课程名" clearable size="small">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="场地" prop="placeId">
        <el-select v-model="queryParams.placeId" placeholder="请选择">
          <el-option
            v-for="item in placeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
          v-hasPermi="['mobile:tuition:add']"
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
          v-hasPermi="['mobile:tuition:edit']"
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
          v-hasPermi="['mobile:tuition:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:tuition:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tuitionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学员名" align="center" prop="studentName" />
      <el-table-column label="场地名" align="center" prop="placeName" />
      <el-table-column label="缴费时间" align="center" prop="payTime" />
<!--      <el-table-column label="开票类型" align="center" prop="billingType" />-->
<!--      <el-table-column label="缴费方式" align="center" prop="chargeType" />-->
<!--      <el-table-column label="课程名" align="center" prop="courseId" />-->
<!--      <el-table-column label="是否开票" align="center" prop="invoice" />-->
      <el-table-column label="缴费金额" align="center" prop="payMoney" />
      <el-table-column label="备注" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:tuition:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:tuition:remove']"
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

    <!-- 添加或修改缴费信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="开票类型" prop="billingType">-->
<!--          <el-select v-model="form.billingType" placeholder="请选择开票类型">-->
<!--            <el-option label="请选择字典生成" value="" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="缴费方式" prop="chargeType">-->
<!--          <el-select v-model="form.chargeType" placeholder="请选择缴费方式">-->
<!--            <el-option label="请选择字典生成" value="" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="课程名" prop="courseId">-->
<!--          <el-select v-model="form.courseId" placeholder="请选择课程名">-->
<!--            <el-option label="请选择字典生成" value="" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="所属场地" prop="placeId">
          <el-select v-model="form.placeId" placeholder="请选择">
            <el-option
              v-for="item in placeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员名" prop="studentId">
          <el-select v-model="form.studentId" placeholder="请选择学员">
            <el-option
              v-for="item in studentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="是否开票" prop="invoice">-->
<!--          <el-select v-model="form.invoice" placeholder="请选择是否开票">-->
<!--            <el-option label="请选择字典生成" value="" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="缴费金额" prop="payMoney">
          <el-input v-model="form.payMoney" placeholder="请输入缴费金额" />
        </el-form-item>
        <el-form-item label="缴费时间" prop="payTime">
          <el-input v-model="form.payTime" placeholder="请输入缴费时间" />
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注" />
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
import { listTuition, getTuition, delTuition, addTuition, updateTuition, exportTuition } from "@/api/mobile/tuition";
import {placeList,studentList} from "@/api/mobile/student";

export default {
  name: "Tuition",
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
      // 缴费信息表格数据
      tuitionList: [],
      //场地选项
      placeOptions:[],
      studentOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseId: null,
        placeId: null,
        studentId: null
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
    this.getPlaceOption();
    this.getStduentOption();
  },
  methods: {
    /** 查询缴费信息列表 */
    getList() {
      this.loading = true;
      listTuition(this.queryParams).then(response => {
        this.tuitionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询场地下拉列表
    getPlaceOption(){
      placeList().then(response => {
        this.placeOptions = response;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        billingType: null,
        chargeType: null,
        courseId: null,
        description: null,
        invoice: null,
        payMoney: null,
        payTime: null,
        placeId: null,
        studentId: null
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
      this.getPlaceOption();
      this.getStduentOption();
      this.open = true;
      this.title = "添加缴费信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getPlaceOption();
      this.getStduentOption();
      const id = row.id || this.ids
      getTuition(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改缴费信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTuition(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTuition(this.form).then(response => {
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
      this.$confirm('是否确认删除缴费信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTuition(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有缴费信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTuition(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
