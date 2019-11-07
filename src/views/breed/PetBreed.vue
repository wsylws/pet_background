<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline queryForm">
      <el-form-item prop="breed">
        <el-input v-model="searchMap.breed" placeholder="宠物品种"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="fetchData()">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="openAdd(), isEdit = false">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="579px" border style="width: 50%; margin: 0 auto;">
      <el-table-column type="index" label="序号" width="200px"></el-table-column>
      <el-table-column prop="breed_name" label="宠物品种"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id), isEdit = true">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageNav"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="'total, prev, pager, next, jumper'"
      :total="total"
    ></el-pagination>

    <el-dialog
      :title="'用户' + (isEdit ? '编辑' : '添加')"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        v-loading="isLoading"
        :rules="rules"
        :model="pojo"
        status-icon
        label-position="labelPosition"
        label-width="100px"
        ref="addForm"
        style="width: 400px"
      >
        <el-form-item label="宠物品种" prop="breed_name">
          <el-input v-model="pojo.breed_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {adminSearch, getAdminById ,adminIsExist, adminUpdate, adminDeleteById} from "@/apis/role"
import { breedSearch, getBreedById ,breedUpdate, checkBreed, breedIsExist, breedDeleteById } from '@/apis/pet'

export default {
  data() {
    const checkBreed = (rule, value, callback) => {
      if (this.isEdit) {
        return callback()
      }
      breedIsExist(value).then(res => {
        const resData = res.data
        console.log(resData)
        if (resData.data === true) {
          return callback(new Error("该品种已存在"))
        }
        return callback()
      })
    }
    const validatePhone = (rule, value, callback) => {
      if(!(/^1[34578]\d{9}$/.test(value))){ 
        callback(new Error("手机号码有误，请重填"))
        return 
      } 
      callback()
    }
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        breed: "",
      },
      roleIds: [],
      pojo: {
        id: "",
        breed_name: ''
      },
      rules: {
        breed_name: [{required: true, message: '宠物品种不能为空', trigger: 'blur'}, {validator: checkBreed, trigger: "blur" }]
      },
      isEdit: false,
      dialogFormVisible: false,
      isLoading: false
    };
  },

  created() {
    this.fetchData();
  },

  components: {},

  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    fetchData() {
      breedSearch(this.currentPage - 1, this.pageSize, this.searchMap)
        .then(res => {
          if (res) {
            const resData = res.data;
            this.total = resData.data.total[0].count;
            this.list = resData.data.data;
          }
      });
    },
    handleEdit(id) {
      this.openAdd();
      this.isLoading = true;
      getBreedById(id).then(res => {
        this.isLoading = false;
        const resData = res.data;
        if (resData.flag) {
          this.pojo = resData.data[0];
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          breedDeleteById({id: id}).then(res => {
            const resData = res.data;
            this.$message({
              message: resData.msg,
              type: resData.flag ? "success" : "error"
            });
            if (resData.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openAdd() {
      this.dialogFormVisible = true;
      this.pojo.id = "";
      this.$nextTick(() => {
        this.$refs["addForm"].resetFields();
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          breedUpdate(this.pojo).then(resp => {
            const resData = resp.data;
            if (resData.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              if (!this.isEdit) {
                this.pojo.id = "";
                this.$message.success("添加宠物品种成功");
              } else {
                this.$message.success(resData.message);
              }
            } else {
              this.$message.warning(resData.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.pageNav {
  text-align: center;
  margin-top: 20px;
}
.queryForm {
  margin-top: 20px;
}
</style>