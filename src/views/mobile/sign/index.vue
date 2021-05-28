<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId" placeholder="请选择">
          <el-option
            v-for="item in courseOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="教练" prop="userId">
        <el-select v-model="queryParams.userId" placeholder="请选择">
          <el-option
            v-for="item in coachOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签到时间" prop="signTime">
        <el-input
          v-model="queryParams.signTime"
          placeholder="请输入签到时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['mobile:sign:add']"
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
          v-hasPermi="['mobile:sign:edit']"
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
          v-hasPermi="['mobile:sign:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:sign:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="signList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学员" align="center" prop="studentName" :show-overflow-tooltip="true"/>
      <el-table-column label="签到时间" align="center" prop="signTime" :show-overflow-tooltip="true"/>
      <el-table-column label="教练" align="center" prop="coachName" :show-overflow-tooltip="true"/>
      <el-table-column label="课程名" align="center" prop="courseName" :show-overflow-tooltip="true"/>
      <el-table-column label="场地名" align="center" prop="placeName" :show-overflow-tooltip="true"/>
      <el-table-column label="本节价格" align="center" prop="money" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" prop="remarks" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:sign:edit']"
          >修改</el-button>

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

    <!-- 添加或修改学员签到对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="签到时间" prop="signTime">
          <el-input v-model="form.signTime" placeholder="请输入签到时间" />
        </el-form-item>

        <el-form-item label="本节价格" prop="money">
          <el-input v-model="form.money" placeholder="请输入本节价格" />
        </el-form-item>
        <el-form-item label="课程名" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择课程">
            <el-option
              v-for="item in courseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="2" v-model="form.remarks" placeholder="请输入备注" />
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
import { listSign, getSign, delSign, addSign, updateSign, exportSign } from "@/api/mobile/sign";
import {placeList,studentList,courseList,coachList} from "@/api/mobile/student";


export default {
  name: "Sign",
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
      // 学员签到表格数据
      signList: [],
      //场地选项
      placeOptions:[],
      //学员选项
      studentOptions:[],
      //课程选项
      courseOptions:[],
      //教练选项
      coachOptions:[],
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
        signTime: null,
        studentId: null,
        userId: null,
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
    this.getCourseOption();
    this.getCoachOption();
  },
  methods: {
    /** 查询学员签到列表 */
    getList() {
      this.loading = true;
      listSign(this.queryParams).then(response => {
        this.signList = response.rows;
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
    //查询课程下拉列表
    getCourseOption(){
      courseList().then(response => {
        this.courseOptions = response;
        this.loading = false;
      });
    },
    //查询教练下拉列表
    getCoachOption(){
      coachList().then(response => {
        this.coachOptions = response;
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
        courseId: null,
        placeId: null,
        signTime: null,
        status: "0",
        studentId: null,
        userId: null,
        money: null,
        remarks: null
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
      this.title = "添加学员签到";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSign(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学员签到";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSign(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSign(this.form).then(response => {
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
      this.$confirm('是否确认删除学员签到编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSign(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学员签到数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSign(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
