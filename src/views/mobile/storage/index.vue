<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品分类" prop="brand">
        <el-select v-model="queryParams.type" placeholder="请选择商品分类">
          <el-option
            v-for="dict in goodsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
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
          v-hasPermi="['mobile:storage:add']"
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
          v-hasPermi="['mobile:storage:edit']"
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
          v-hasPermi="['mobile:storage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="inStorage"
          v-hasPermi="['mobile:storage:edit']"
        >入库
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="outStorage"
          v-hasPermi="['mobile:storage:edit']"
        >出库
        </el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品名" align="center" prop="name" />
      <el-table-column label="分类" align="center" prop="type" :formatter="goodsTypeFormat"/>
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="库存量" align="center" prop="inventory" />
      <el-table-column label="商品描述" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="图片" align="center" prop="imgUrl" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed- width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mobile:storage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mobile:storage:remove']"
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

    <!-- 添加或修改商品库存对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="商品分类" prop="brand">
          <el-select v-model="form.type" placeholder="请选择商品分类">
            <el-option
              v-for="dict in goodsTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="库存量" prop="inventory">
          <el-input v-model="form.inventory" placeholder="请输入库存量" />
        </el-form-item>
        <el-form-item label="商品描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="图片">
          <imageUpload v-model="form.imgUrl"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 入库对话框 -->
    <el-dialog :title="title" :visible.sync="inStorageView" width="500px" append-to-body>
      <el-form ref="form2" :model="form2"  label-width="80px">

        <el-form-item label="数量" prop="value1">
          <el-input v-model="form2.value1" placeholder="请输入数量" onkeyup="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inStorageSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 出库对话框 -->
    <el-dialog :title="title" :visible.sync="outStorageView" width="500px" append-to-body>
      <el-form ref="form3" :model="form3"  label-width="80px">

        <el-form-item label="数量" prop="value1">
          <el-input v-model="form3.value1" placeholder="请输入数量" onkeyup="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="outStorageSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listStorage, getStorage, delStorage, addStorage, updateStorage, inStorageFun,outStorageFun,findStorageSelectList } from "@/api/mobile/storage";
import ImageUpload from '@/components/ImageUpload';
import {placeList} from "@/api/mobile/student";

export default {
  name: "Storage",
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
      // 商品库存表格数据
      storageList: [],
      storageOptions:[],
      goodsTypeOptions:[],
      inStorageView:false,
      outStorageView:false,
      storageId:'',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        brand: null,
      },
      // 表单参数
      form: {},
      form2: {
        value1:''
      },
      form3: {
        value1:''
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询商品库存列表 */
    getList() {
      this.loading = true;
      listStorage(this.queryParams).then(response => {
        this.storageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 商品分类字典翻译
    goodsTypeFormat(row, column) {
      return this.selectDictLabel(this.goodsTypeOptions, row.type);
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
        brand: null,
        price: null,
        inventory: null,
        remark: null,
        imgUrl: null
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
      this.title = "添加商品库存";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStorage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品库存";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStorage(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStorage(this.form).then(response => {
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
      this.$confirm('是否确认删除商品库存编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStorage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 入库 */
    inStorage(row) {

      this.storageId=row.id || this.ids[0]
      this.inStorageView = true

    },
    inStorageSubmit(){
      this.$refs['form2'].validate((valid) => {
        if(valid){
          var data={
            "id":this.storageId,
            "inventory":this.form2.value1
          }
          inStorageFun(data).then((response) => {
            if(response.code == 200){
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.inStorageView = false
              this.getList()
            }else{
              this.$message.error('提交失败');
            }
          })
        }
      })
    },

    /** 出库 */
    outStorage(row) {
      this.storageId=row.id || this.ids[0]
      this.outStorageView = true
    },
    outStorageSubmit(){
      this.$refs['form3'].validate((valid) => {
        if(valid){
          var data={
            "id":this.storageId,
            "inventory":this.form3.value1
          }
          outStorageFun(data).then((response) => {
            if(response.code == 200){
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.outStorageView = false
              this.getList()
            }else{
              this.$message.error('提交失败');
            }
          })
        }
      })
    },
  }

};
</script>
