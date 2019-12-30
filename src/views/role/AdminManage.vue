<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline queryForm">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="用户名"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="fetchData()">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="openAdd(), isEdit = false">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="600px" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
         <!--  <el-button size="mini" @click="handleEdit(scope.row.id), isEdit = true">编辑</el-button> -->
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="pojo.username" v-if="isEdit" :disabled="true"></el-input>
          <el-input v-model="pojo.username" v-else></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="pojo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
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

export default {
  data() {
    const checkUsername = (rule, value, callback) => {
      if (this.isEdit) {
        return callback()
      }
      adminIsExist(value).then(res => {
        const resData = res.data
        console.log(resData)
        if (resData.data === true) {
          return callback(new Error("帐号已存在"))
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
        username: "",
      },
      roleIds: [],
      pojo: {
        id: "",
        username: "",
        email: '',
        phone: ""
      },
      rules: {
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}, {validator: checkUsername, trigger: "blur" }],
        email: [{required: true, message: '邮箱不能为空', trigger: 'blur'}, { type: 'email', message: '必须是合法的邮箱格式', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }],
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
      adminSearch(this.currentPage - 1, this.pageSize, this.searchMap)
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
      getAdminById(id).then(res => {
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
          adminDeleteById({id: id}).then(res => {
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
          adminUpdate(this.pojo).then(resp => {
            const resData = resp.data;
            if (resData.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              if (!this.isEdit) {
                this.pojo.id = "";
                this.$message.success("添加用户成功，初始密码为123456");
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