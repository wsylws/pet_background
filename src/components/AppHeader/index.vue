<template>
    <div class="header">
      <a href="/">
        <img class="logo" src="@/assets/logo.png" width="25px">
        <span class="company">后台管理</span>
      </a>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="avatar" :src="avatar" width="25px">
          {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog title="修改密码" width="500px" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
          label-width="100px" style="width: 400px">
          <el-form-item label="原密码" prop="oldPass">
            <el-input v-model="ruleForm.oldPass" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input v-model="ruleForm.pass" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
            <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
import { checkPwd, updatePwd } from '@/apis/user'
import md5 from 'md5'

export default {
  data() {
    const validateOldPass = (rule, value, callback) => {
      checkPwd({id: this.id, password: md5(value)}).then(res => {
        const resData = res.data
        if (resData.flag) {
          callback()
        } else {
          callback(new Error(resData.msg))
        }
      })
    }
    const validatePass = (rule, value, callback) => {
      if (value != this.ruleForm.pass) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      username: this.$store.state.username,
      avatar: this.$store.state.avatar,
      id: this.$store.state.id,
      rules: {
        oldPass: [
          {required: true, message: '旧密码不能为空', trigger: 'blur'},
          {validator: validateOldPass, trigger: 'blur'},
        ],
        pass: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
        ],
        checkPass: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {validator: validatePass, trigger: 'change'},
        ]
      }
    }
  },

  components: {},

  methods: {
    handleCommand(command){
      switch (command) {
        case 'a':
          this.handlePwd()
          break;
        case 'b':
          this.handleLogout()
          break;
        default:
          break;
      }
    },
    handleLogout() {
      this.$store.dispatch('clearUser')
      this.$message.success("退出登录")
      this.$router.push('/login')
    },
    handlePwd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updatePwd({id: this.id, password: md5(this.ruleForm.pass)}).then(res => {
            const resData = res.data
            this.$message({
              message: resData.msg,
              type: resData.flag ? 'success' : 'warning'
            })
            if (resData.flag) {
              this.handleLogout()
              this.dialogFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.logo{
  vertical-align: middle;
  padding: 0px 5px 5px 40px;
  width: 35px;
  height: 25px;
  
}
.avatar {
  vertical-align: middle;
  border-radius: 50%;
}
.company{
  position: absolute;
}
.el-dropdown{
  z-index: 1;
  float: right;
  margin-right: 40px;
}
.el-dropdown-link{
  cursor: pointer;
}
</style>