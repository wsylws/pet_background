<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline queryForm">
      <el-form-item prop="id">
        <el-input v-model="searchMap.id" placeholder="序号"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="fetchData()">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="openAdd(), isEdit = false">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="579px" border style="width: 50%; margin: 0 auto;">
      <el-table-column type="index" label="序号" width="200px"></el-table-column>
      <el-table-column prop="imgUrl" label="轮播图">
        <template slot-scope="scope">
          <img class="carousel-img" :src="scope.row.imgUrl">
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
      :title="'用户' + (isEdit ? '编辑' : '添加')"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-upload
        class="avatar-uploader"
        ref='upload'
        :action= domain 
        :http-request = upqiniu
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="pojo.imgUrl" :src="pojo.imgUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { carouselSearch, getCarouselById ,carouselUpdate, checkCarousel, carouselIsExist, carouselDeleteById } from '@/apis/carousel'
import { getToken, uploadQiNiu } from '@/apis/upload'

export default {
  data() {
    // const checkBreed = (rule, value, callback) => {
    //   if (this.isEdit) {
    //     return callback()
    //   }
    //   breedIsExist(value).then(res => {
    //     const resData = res.data
    //     console.log(resData)
    //     if (resData.data === true) {
    //       return callback(new Error("该品种已存在"))
    //     }
    //     return callback()
    //   })
    // }

    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 4,
      searchMap: {
        id: ""
      },
      roleIds: [],
      pojo: {
        id: "",
        imgUrl: ''
      },
      isEdit: false,
      dialogFormVisible: false,
      isLoading: false,
      token: {},
      // 七牛云的上传地址
      domain: 'https://upload-z2.qiniup.com',
      // 七牛云空间的外链默认域名
      qiniuaddr: 'pet.wangshiyu.online',
    };
  },

  created() {
    this.fetchData();
  },

  components: {},

  methods: {
    handleAvatarSuccess(res, file) {
      this.pojo.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isJPG && isLt3M;
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
      carouselSearch(this.currentPage - 1, this.pageSize, this.searchMap)
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
      getCarouselById(id).then(res => {
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
          carouselDeleteById({id: id}).then(res => {
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
    },
    updateData(formName) {
      carouselUpdate(this.pojo).then(resp => {
        const resData = resp.data;
        if (resData.flag) {
          this.fetchData();
          this.dialogFormVisible = false;
          if (!this.isEdit) {
            this.pojo.id = "";
            this.$message.success("添加轮播图成功");
          } else {
            this.$message.success(resData.msg);
          }
        } else {
          this.$message.warning(resData.msg);
        }
      });
    },
    // 上传文件到七牛云
    upqiniu (req) {
      console.log(req)
      const config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      let filetype = ''
      if (req.file.type === 'image/png') {
        filetype = 'png'
      } else {
        filetype = 'jpg'
      }
      const keyname = 'lunbo' + '/' + new Date() + Math.floor(Math.random() * 100) + '.' + filetype
      getToken().then(res => {
        console.log(res)
        const formdata = new FormData()
        formdata.append('file', req.file)
        formdata.append('token', res.data)
        formdata.append('key', keyname)
        uploadQiNiu(formdata).then(res => {
          this.pojo.imgUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
        })
      })
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
.carousel-img {
  width: 60%;
  height: 60%;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}
.avatar-uploader-icon:hover {
   border-color: #409EFF;
 }
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
