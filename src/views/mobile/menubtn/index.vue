<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="按钮名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入按钮名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单角色" prop="menuRole">
        <el-select v-model="queryParams.menuRole" placeholder="请选择菜单角色" clearable size="small">
          <el-option
            v-for="dict in menuRoleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否禁用" prop="menuRole">
        <el-select v-model="queryParams.useFlag" placeholder="请选择是否禁用">
          <el-option
            v-for="dict in useFlagOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
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
          v-hasPermi="['mobile:menubtn:add']"
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
          v-hasPermi="['mobile:menubtn:edit']"
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
          v-hasPermi="['mobile:menubtn:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mobile:menubtn:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="menubtnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="按钮名称" align="center" prop="name" />
<!--      <el-table-column label="按钮图片" align="center" prop="imgUrl" :show-overflow-tooltip="true"/>-->
      <el-table-column label="图片" align="center" prop="imgUrl" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imgUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="菜单角色" align="center" prop="menuRole" :formatter="menuRoleFormat" />
      <el-table-column label="跳转页面" align="center" prop="targetUrl" :show-overflow-tooltip="true"/>
      <el-table-column label="是否禁用" align="center" prop="useFlag" :formatter="useFlagFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:menubtn:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:menubtn:remove']"
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

    <!-- 添加或修改首页按钮权限对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="按钮名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入按钮名称" />
        </el-form-item>
        <el-form-item label="按钮图片">
          <imageUpload v-model="form.imgUrl"/>
        </el-form-item>
        <el-form-item label="菜单角色" prop="menuRole">
          <el-select v-model="form.menuRole" placeholder="请选择菜单角色">
            <el-option
              v-for="dict in menuRoleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转页面" prop="targetUrl">
          <el-input v-model="form.targetUrl" placeholder="请输入跳转页面" />
        </el-form-item>
        <el-form-item label="是否禁用" prop="menuRole">
          <el-select v-model="form.useFlag" placeholder="请选择是否禁用">
            <el-option
              v-for="dict in useFlagOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
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
import { listMenubtn, getMenubtn, delMenubtn, addMenubtn, updateMenubtn, exportMenubtn } from "@/api/mobile/menubtn";
import ImageUpload from '@/components/ImageUpload';

export default {
  name: "Menubtn",
  components: {
    ImageUpload,
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
      // 首页按钮权限表格数据
      menubtnList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单角色字典
      menuRoleOptions: [],
      // 禁用启用字典
      useFlagOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        imgUrl: null,
        menuRole: null,
        targetUrl: null
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
    this.getDicts("menu_btn_type").then(response => {
      this.menuRoleOptions = response.data;
    });
    this.getDicts("menu_btn_use").then(response => {
      this.useFlagOptions = response.data;
    });
  },
  methods: {
    /** 查询首页按钮权限列表 */
    getList() {
      this.loading = true;
      listMenubtn(this.queryParams).then(response => {
        this.menubtnList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 菜单角色字典翻译
    menuRoleFormat(row, column) {
      return this.selectDictLabel(this.menuRoleOptions, row.menuRole);
    },
    // 禁用启用字典翻译
    useFlagFormat(row, column) {
      return this.selectDictLabel(this.useFlagOptions, row.useFlag);
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
        name: null,
        imgUrl: null,
        menuRole: null,
        targetUrl: null
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
      this.title = "添加首页按钮权限";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMenubtn(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改首页按钮权限";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMenubtn(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMenubtn(this.form).then(response => {
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
      this.$confirm('是否确认删除首页按钮权限编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMenubtn(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有首页按钮权限数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMenubtn(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
