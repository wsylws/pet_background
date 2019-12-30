<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline queryForm">
      <el-form-item prop="title">
        <el-input v-model="searchMap.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="发布人"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="searchMap.status" placeholder="领养状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="fetchData()">查询</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="579px" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="pet_desc" label="宠物描述"></el-table-column>
      <el-table-column prop="status" label="领养状态">
        <template slot-scope="scope">
          <span>{{scope.row.status == 0 ? '待领养' : '已领养'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="breed" label="宠物品种">
        <template slot-scope="scope">
          {{scope.row.breed}}<span v-if="scope.row.breed_name">/{{scope.row.breed_name}}</span>
         </template>
      </el-table-column>
      <el-table-column prop="city" label="城市">
        <template slot-scope="scope">
          <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.county}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="telephone" label="联系方式"></el-table-column>
      <el-table-column prop="create_time" label="发布时间"  width="160px"></el-table-column>
      <el-table-column prop="username" label="发布人"></el-table-column>
      <el-table-column prop="send_check" label="审核">
        <template slot-scope="scope">
          <span>{{scope.row.send_check == 0 ? '待审核' : '已审核'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comment_num" label="评论" width="80px">
        <template slot-scope="scope">
          <router-link tag="a" :to="'/petAdopt-manage/comment/' + scope.row.id" class="table-link">详情</router-link>
         </template>
      </el-table-column>
      <el-table-column prop="like_num" label="喜欢" width="80px">
        <template slot-scope="scope">
          <router-link tag="a" :to="'/petAdopt-manage/like/' + scope.row.id" class="table-link">详情</router-link>
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
      :layout="'total,  prev, pager, next, jumper'"
      :total="total"
    ></el-pagination>

    <el-dialog
      :title="'宠物' + (isEdit ? '编辑' : '添加')"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        v-loading="isLoading"
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
        <el-form-item label="领养状态" prop="status">
          <el-select class="pojo-status" v-model="pojo.status" placeholder="请选择" >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核" prop="send_check">
          <el-switch
            class="check-switch"
            v-model="pojo.send_check"
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
import {adoptSearch, getAdoptById, adoptUpdate, adoptDeleteById} from "@/apis/pet"

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
      checkOptions: [{
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '已审核'
      }],
      statusOptions: [{
        value: '0',
        label: '待领养'
      }, {
        value: '1',
        label: '已领养'
      }],
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        username: "",
        title: '',
        status: ''
        
      },
      roleIds: [],
      pojo: {
        id: "",
        username: "",
        email: '',
        phone: "",
        send_check: ''
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
      adoptSearch(this.currentPage - 1, this.pageSize, this.searchMap)
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
      getAdoptById(id).then(res => {
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
          adoptDeleteById({id: id}).then(res => {
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
          adoptUpdate(this.pojo).then(resp => {
            const resData = resp.data;
            if (resData.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message.success(resData.message);
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
.table-link {
  color: rgb(109, 143, 177);
  text-decoration: none;
}
.check-switch {
  margin-right: 250px;
}
</style>

<style>
  .pojo-status .el-input--suffix .el-input__inner {
    padding-right: 125px;
  }
  .cell{
    max-height: 28px !important;
    overflow: hidden !important;
  }
</style>