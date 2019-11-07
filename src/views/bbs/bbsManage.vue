<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline queryForm">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="发布人"></el-input>
      </el-form-item>
      <el-form-item prop="title">
        <el-input v-model="searchMap.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item prop="category">
        <el-select v-model="searchMap.category" placeholder="分类">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="top">
        <el-select v-model="searchMap.top" placeholder="置顶">
          <el-option
            v-for="item in topOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="fetchData()">查询</el-button>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="openAdd(), isEdit = false">新增</el-button> -->
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="600px" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="username" label="发布人"></el-table-column>
      <el-table-column prop="create_time" label="发布时间"></el-table-column>
      <el-table-column prop="top" label="置顶"></el-table-column>
      <el-table-column prop="comment_num" label="评论" width="80px">
        <template slot-scope="scope">
          <router-link tag="a" :to="'/bbs-manage/comment/' + scope.row.id" class="table-link">详情</router-link>
         </template>
      </el-table-column>
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
      :title="'文章' + (isEdit ? '编辑' : '添加')"
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="pojo.title"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select class="pojo-category" v-model="pojo.category" placeholder="请选择" >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="置顶" prop="top">
          <el-switch
            class="top-switch"
            v-model="pojo.top"
            active-value=1
            inactive-value=0
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
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
// import {adminSearch, getAdminById ,adminIsExist, adminUpdate, adminDeleteById} from "@/apis/role"
import {bbsSearch, bbsUpdate, getbbsById, bbsDeleteById} from '@/apis/bbs'
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if(!(/^1[34578]\d{9}$/.test(value))){ 
        callback(new Error("手机号码有误，请重填"))
        return 
      } 
      callback()
    }
    return {
      topOptions: [{
        value: '0',
        label: '未置顶'
      }, {
        value: '1',
        label: '已置顶'
      }],
      categoryOptions: [{
        value: '育宠交流',
        label: '育宠交流'
      },{
        value: '宠物救济',
        label: '宠物救济'
      },{
        value: '寻宠启示',
        label: '寻宠启示'
      },{
        value: '问答中心',
        label: '问答中心'
      },{
        value: '资源下载',
        label: '资源下载'
      }],
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        username: "",
        title: '',
        top: '',
        category: ''
      },
      roleIds: [],
      pojo: {
        id: "",
        title: "",
        category: '',
        top: ""
      },
      rules: {
        title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
        category: [{required: true, message: '分类不能为空', trigger: 'blur'}]
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
      bbsSearch(this.currentPage - 1, this.pageSize, this.searchMap)
        .then(res => {
          if (res) {
            const resData = res.data;
            this.total = resData.data.total[0].count;
            this.list = resData.data.data;
            for (let i = 0; i < this.list.length; i++) {
              this.list[i].top = this.list[i].top == 0 ? '未置顶' : '已置顶'
            }
          }
      });
    },
    handleEdit(id) {
      this.openAdd();
      this.isLoading = true;
      getbbsById(id).then(res => {
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
          bbsDeleteById({id: id}).then(res => {
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
      this.$nextTick(() => {
        this.$refs["addForm"].resetFields();
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          bbsUpdate(this.pojo).then(resp => {
            const resData = resp.data;
            if (resData.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message.success(resData.msg);
            } else {
              this.$message.warning(resData.msg);
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
.top-switch {
  margin-right: 250px;
}
.table-link {
  color: rgb(109, 143, 177);
  text-decoration: none;
}

</style>

<style >
  .pojo-category .el-input--suffix .el-input__inner {
    padding-right: 125px;
  }
</style>