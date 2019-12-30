<template>
  <div class="login-container">
    <el-form ref="form" hide-required-asterisk :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">宠物领养网站</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="imageCode">
        <el-col :span="13">
          <el-input v-model="form.imageCode" placeholder="请输入验证码"></el-input>
        </el-col>
        <el-col :span="11">
          <validate-code class="code" ref="validate-code" @change="code => form.validateCode = code"></validate-code>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">登录</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import { login } from '@/apis/user'
import ValidateCode from '@/components/ValidateCode'
import md5 from 'md5'
export default {
  name: "Login",
  components: { 
    ValidateCode
  },
  data () {
    const validate = (rule, value, callback) => {
        if (value.toUpperCase() !== this.form.validateCode) {
          callback(new Error('验证码输入错误，请重新输入'))
        }
        callback()
    }

    return {
      form: {
        username: '',
        password: '',
        imageCode: '',
        // validateCode: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入有效账号', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入有效密码', trigger: 'blur'}
        ],
        imageCode: [
          { required: true, message: '请输入验证码', trigger: 'blur'},
          { validator: validate, trigger: 'blur' }
        ]
      },
      randomNum: Math.random(),
      showCode: false
    }
  },

  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。')
          return false
        }
      })
    },
    async login() {
      // 获取表单数据
      // 发送到后台
      await login({username: this.form.username, password: md5(this.form.password)}).then(res => {
        console.log(res);
        // 后台成功返回数据
        if (res.data.code === 1) {
          // 保存状态
          this.$store.dispatch('saveUser', res.data.data)
          this.$message.success(res.data.msg)
          this.$router.push({path: '/'})
          return
        }
        // 失败提示
        this.$message.error(res.data.msg)
      })
    }
  }
}
</script>

<style scoped>
.login-form{
  width: 420px;
  margin: 160px auto;
  background-color: rgb(255,255,255,0.8);
  padding: 30px 60px 30px 30px;
  border-radius: 10px;
}
.login-title{
  text-align: center;
  color: #303133;
  padding-left: 20px;
}
.login-container{
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login_bg.png");
  overflow: hidden;
}
.code{
  /* padding-left: 20px; */
  cursor: pointer;
}
</style>