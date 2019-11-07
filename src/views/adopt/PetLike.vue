<template>
  <div>
    <el-page-header @back="goBack" class="go-back" content="喜欢详情页">
    </el-page-header>
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline queryForm">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="发布人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="fetchData()">查询</el-button>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="openAdd(), isEdit = false">新增</el-button> -->
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="600px" border style="width: 700px; margin: 0 auto;">
      <el-table-column type="index" label="序号" width="67px"></el-table-column>
      <el-table-column prop="username" label="喜欢人"></el-table-column>
      <el-table-column prop="create_time" label="发布时间"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import {likeSearch,likeDeleteById} from '@/apis/pet'
export default {
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        username: ""
      },
      roleIds: [],
      isLoading: false
    };
  },

  created() {
    this.fetchData();
  },

  components: {},

  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    fetchData() {
      let id = this.$route.params.id
      likeSearch(this.currentPage - 1, this.pageSize, this.searchMap, id)
        .then(res => {
          if (res) {
            const resData = res.data;
            this.total = resData.data.total[0].count;
            this.list = resData.data.data;
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
          likeDeleteById({id: id}).then(res => {
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
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          likeUpdate(this.pojo).then(resp => {
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
.go-back {
  margin-top: 30px;
  padding-left: 20px;
}
</style>

<style >
  .pojo-category .el-input--suffix .el-input__inner {
    padding-right: 125px;
  }
</style>