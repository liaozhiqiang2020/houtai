<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="负责人" prop="contacts">
        <el-input
          v-model="queryParams.contacts"
          placeholder="请输入负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="contactsTel">
        <el-input
          v-model="queryParams.contactsTel"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="场地名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入场地名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="场地类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择场地类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
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
          v-hasPermi="['mobile:place:add']"
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
          v-hasPermi="['mobile:place:edit']"
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
          v-hasPermi="['mobile:place:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:place:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="placeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="地址" align="center" prop="address" :show-overflow-tooltip="true"/>
      <el-table-column label="提成" align="center" prop="commission" />
      <el-table-column label="负责人" align="center" prop="contacts" />
      <el-table-column label="电话" align="center" prop="contactsTel" :show-overflow-tooltip="true" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <el-table-column label="场地名" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="租金" align="center" prop="rent" />
      <el-table-column label="收租方式" align="center" prop="rentType" :formatter="rentTypeFormat" />
      <el-table-column label="签约时间" align="center" prop="signTime" />
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="场地类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:place:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:place:remove']"
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

    <!-- 添加或修改场地对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="提成" prop="commission">
          <el-input v-model="form.commission" placeholder="请输入提成" />
        </el-form-item>
        <el-form-item label="负责人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="负责人电话" prop="contactsTel">
          <el-input v-model="form.contactsTel" placeholder="请输入负责人电话" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="form.endTime" placeholder="请输入结束时间" />
        </el-form-item>
        <el-form-item label="场地名" prop="name">
          <el-input v-model="form.name" placeholder="请输入场地名" />
        </el-form-item>
        <el-form-item label="租金" prop="rent">
          <el-input v-model="form.rent" placeholder="请输入租金" />
        </el-form-item>
        <el-form-item label="收租方式" prop="rentType">
          <el-select v-model="form.rentType" placeholder="请选择收租方式">
            <el-option
              v-for="dict in rentTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约时间" prop="signTime">
          <el-input v-model="form.signTime" placeholder="请输入签约时间" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入开始时间" />
        </el-form-item>
        <el-form-item label="场地类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择场地类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
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
import { listPlace, getPlace, delPlace, addPlace, updatePlace, exportPlace } from "@/api/mobile/place";

export default {
  name: "Place",
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
      // 场地表格数据
      placeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 收租方式字典
      rentTypeOptions: [],
      // 场地类型字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        address: null,
        contacts: null,
        contactsTel: null,
        name: null,
        type: null
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
    this.getDicts("place_rent_type").then(response => {
      this.rentTypeOptions = response.data;
    });
    this.getDicts("place_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询场地列表 */
    getList() {
      this.loading = true;
      listPlace(this.queryParams).then(response => {
        this.placeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 收租方式字典翻译
    rentTypeFormat(row, column) {
      return this.selectDictLabel(this.rentTypeOptions, row.rentType);
    },
    // 场地类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
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
        commission: null,
        contacts: null,
        contactsTel: null,
        endTime: null,
        name: null,
        rent: null,
        rentType: null,
        signTime: null,
        startTime: null,
        type: null
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
      this.title = "添加场地";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlace(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改场地";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlace(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlace(this.form).then(response => {
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
      this.$confirm('是否确认删除场地编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPlace(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有场地数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPlace(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
