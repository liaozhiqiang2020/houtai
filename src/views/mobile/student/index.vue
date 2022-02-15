<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家长电话" prop="parentTel">
        <el-input
          v-model="queryParams.parentTel"
          placeholder="请输入家长电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="缴费方式" prop="chargeType">
        <el-select v-model="queryParams.chargeType" placeholder="请选择缴费方式">
          <el-option
            v-for="dict in chargeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成人" prop="chargeType">
        <el-select v-model="queryParams.adult" placeholder="请选择是否成人">
          <el-option
            v-for="dict in adultOptions"
            :key="parseInt(dict.dictValue)"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属场地" prop="placeId">
        <el-select v-model="queryParams.placeId" placeholder="请选择">
          <el-option
            v-for="item in placeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input
          v-model="queryParams.parentTel"
          placeholder="请输入电话"
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
          v-hasPermi="['mobile:student:add']"
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
          v-hasPermi="['mobile:student:edit']"
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
          v-hasPermi="['mobile:student:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:student:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange"
              :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="家长电话" align="center" prop="parent_tel" :show-overflow-tooltip="true"/>
<!--      <el-table-column label="当前状态" align="center" prop="study_status" :formatter="studyStatusFormat" :show-overflow-tooltip="true"/>-->
      <el-table-column label="当前状态" align="center" key="study_status" prop="study_status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.study_status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="缴费方式" align="center" prop="charge_type" :formatter="chargeTypeFormat"/>
      <el-table-column label="剩余金额" align="center" prop="money" :show-overflow-tooltip="true" />
      <el-table-column label="剩余课时" align="center" prop="class_hours" :show-overflow-tooltip="true"/>
      <el-table-column label="是否成人" align="center" prop="adult" :formatter="adultFormat" :show-overflow-tooltip="true"/>
      <el-table-column label="报名时间" align="center" prop="registr_time" :show-overflow-tooltip="true"/>
      <el-table-column label="所属场地" align="center" prop="place_name" :show-overflow-tooltip="true"/>
      <el-table-column label="电话" align="center" prop="tel" :show-overflow-tooltip="true"/>
      <el-table-column label="家长名" align="center" prop="parent_name" :show-overflow-tooltip="true"/>
      <el-table-column label="年龄" align="center" prop="age" :show-overflow-tooltip="true"/>
<!--      <el-table-column label="学号" align="center" prop="sn" :show-overflow-tooltip="true"/>-->
      <el-table-column label="身份证号" align="center" prop="id_card" :show-overflow-tooltip="true"/>
      <el-table-column label="招生人" align="center" prop="sale_name"  :show-overflow-tooltip="true"/>
<!--      <el-table-column label="招生人电话" align="center" prop="sale_tel"  :show-overflow-tooltip="true"/>-->
      <el-table-column label="最后抽奖时间" align="center" prop="last_draw_date"  :show-overflow-tooltip="true"/>
      <el-table-column label="总抽奖次数" align="center" prop="draw_count"  :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:student:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:student:remove']"
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

    <!-- 添加或修改学员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="家长电话" prop="parentTel">
          <el-input v-model="form.parentTel" placeholder="请输入家长电话" />
        </el-form-item>
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
        <el-form-item label="缴费方式" prop="chargeType">
          <el-select v-model="form.chargeType" placeholder="请选择缴费方式">
            <el-option
              v-for="dict in chargeTypeOptions"
              :key="parseInt(dict.dictValue)"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名时间" prop="registrTime">
          <el-date-picker clearable size="small"
                          v-model="form.registrTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择报名时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否成人" prop="adult">
          <el-select v-model="form.adult" placeholder="请选择是否成人">
            <el-option
              v-for="dict in adultOptions"
              :key="parseInt(dict.dictValue)"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入剩余金额" />
        </el-form-item>
        <el-form-item  label="招生人" prop="saleId">
          <el-select v-model="form.saleId" placeholder="请选择">
            <el-option
              v-for="item in coachSaleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招生人" prop="saleName">
          <el-input v-model="form.saleName" disabled="disabled" placeholder="请输入招生人" />
        </el-form-item>
<!--        <el-form-item label="招生人电话" prop="saleTel">-->
<!--          <el-input v-model="form.saleTel" placeholder="请输入招生人电话" />-->
<!--        </el-form-item>-->
        <el-form-item v-if="form.chargeType==2" label="单节价格" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入单节价格" />
        </el-form-item>
        <el-form-item v-if="form.chargeType==2" label="剩余课时" prop="classHours">
          <el-input v-model="form.classHours" placeholder="请输入剩余课时" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="学号" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="当前状态" prop="studyStatus">
          <el-select v-model="form.studyStatus" placeholder="请选择当前状态">
            <el-option
              v-for="dict in studyStatusOptions"
              :key="parseInt(dict.dictValue)"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
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
import { listStudent, getStudent, delStudent, addStudent, updateStudent, exportStudent ,placeList,queryCoachSale,updateStudentStatus} from "@/api/mobile/student";

export default {
  name: "Student",
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
      // 学员表格数据
      studentList: [],
      // 缴费方式字典
      chargeTypeOptions: [],
      adultOptions: [],
      //场地选项
      placeOptions:[],
      //销售选项
      coachSaleOptions:[],
      //当前状态
      studyStatusOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        parentTel: null,
        placeId: null,
        tel: null,
        saleName: null,
        saleTel:null,
        saleId:null,
        studyStatus:null
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
    this.getCoachSaleOption();
    this.getDicts("student_charge_type").then(response => {
      this.chargeTypeOptions = response.data;
    });
    this.getDicts("student_adult").then(response => {
      this.adultOptions = response.data;
    });
    this.getDicts("student_study_status").then(response => {
      this.studyStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询学员列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams.placeId);
      listStudent(this.queryParams).then(response => {
        this.studentList = response.rows;
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
    //查询销售下拉列表
    getCoachSaleOption(){
      queryCoachSale().then(response => {
        this.coachSaleOptions = response;
        this.loading = false;
      });
    },
    // 缴费方式字典翻译
    chargeTypeFormat(row, column) {
      return this.selectDictLabel(this.chargeTypeOptions, row.charge_type);
    },
    // 当前状态字典翻译
    studyStatusFormat(row, column) {
      return this.selectDictLabel(this.studyStatusOptions, row.study_status);
    },
    // 是否成人字典翻译
    adultFormat(row, column) {
      return this.selectDictLabel(this.adultOptions, row.adult);
    },
    tableRowClassName(row,rowIndex){
      if (row.row.money<200 && row.row.study_status==0) {
        return 'red';
      }
      return '';
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.study_status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateStudentStatus(row.id,row.study_status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.study_status = row.study_status === "0" ? "1" : "0";
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
        address: null,
        age: null,
        classHours: null,
        name: null,
        parentName: null,
        parentTel: null,
        placeId: null,
        registrTime: null,
        sn: null,
        tel: null,
        idCard: null,
        money: null,
        saleName: null,
        saleTel:null,
        unitPrice: null,
        placeOptions:[]
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
      this.open = true;
      this.title = "添加学员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getPlaceOption();
      const id = row.id || this.ids
      getStudent(id).then(response => {
        this.form = response.data;
        this.form.placeId = parseInt(response.data.placeId);
        this.open = true;
        this.title = "修改学员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log(this.form);
            updateStudent(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStudent(this.form).then(response => {
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
      this.$confirm('是否确认删除学员编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStudent(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStudent(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

<style>
  .el-table .red{
    background-color: pink;
  }

  /*.el-table tbody tr {*/
  /*  pointer-events:none;*/
  /*}*/
</style>
