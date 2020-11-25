<template>
  <div class="div-login">
    <div class="login">
      <!-- <el-card> -->
        <el-form
          class="login-form"
          :model="model"
          :rules="rules"
          ref="form"
          @submit.native.prevent="login"
        >
          <h2>登录</h2>
          <el-form-item prop="code">
            <el-input v-model="model.code" placeholder="用户名:visitor" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="model.password"
              placeholder="密码:12345"
              type="password"
              prefix-icon="el-icon-s-goods"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login-button"
              type="primary"
              native-type="submit"
              block
            >登录</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-popover
              ref="popover"
              placement="bottom"
              title=""
              width="120"
              trigger="click"
              content="">
              <img class="login__app" src="/apk/qrcode.png" id="appQrCode" width="150" height="150">
            </el-popover>
            <el-button title="下载App" class="download-btn el-icon-goods" v-popover:popover></el-button>
            <el-button title="帮助中心" class="download-btn1 el-icon-question" ></el-button>
            <el-button title="信息反馈" class="download-btn1 el-icon-s-promotion" ></el-button>
          </el-form-item> -->
        </el-form>
    </div>
    <div class="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Footer from "./Footer.vue";
export default {
  components: {
    Footer
  },
  name: "login",
  props:{
    loading: Boolean,
  },
  data() {
    return {
      validCredentials: {
        code: "lightscope",
        password: "lightscope"
      },
      model: {
        code: "visitor",
        password: "12345"
      },
      //输入限制规则
      rules: {
        code: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ]
      }
    };
  },
  methods: {
    async login() {
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      //check-login
      this.$emit("clickLogin", {
        code: this.model.code,
        pwd: this.model.password
      });
    }
  }
};
</script>

<style>
.div-login .download-btn{
    float: right;
    padding: 0;
    font-size: 20px;
    border: 0;
    color: #BFBFC1;
}

.div-login .download-btn1{
    margin-left: 0;
    float: right;
    margin-right: 20px;
    padding: 0;
    font-size: 20px;
    border: 0;
    color: #BFBFC1;
}

.div-login .el-input__inner{
  background-color: #F1F2F7;
  border: 0 !important;
  outline: 0 !important;
}

.div-login .el-input__inner:hover{
  border: 0;
}

.div-login .el-input__prefix{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  left: 0 !important;
  background-color: #15B695 !important;
}
.div-login .el-input__icon{
  font-size: 20px;
  width: 40px !important;
  color: #fff !important;
}
.div-login .el-input--prefix .el-input__inner{
  padding-left: 45px !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.div-login{
  position: absolute;
  top: 228px;
  bottom: 0;
  left: 0;
  width: 100%;
}
.el-form-item__content{
  .login-button{
    margin-top: 10px !important;
    background-color: #15B695 !important;
    border: 0;
  }
}
.footer {
  height: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
  p {
    margin: 0;
    padding: 0;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    color: #6EA8DF;
  }
}
.login {
  overflow: hidden;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 6%;
  left: 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  form{
    position: relative;
    border-radius: 5px;
    width: 360px;
    background-color: #4D5C79;
    padding: 10px 20px;
    margin: 0;
    h2 {
      font-family: "Open Sans";
      letter-spacing: 1px;
      font-family: Roboto, sans-serif;
      padding-bottom: 10px;
      text-align: center;
      font-size: 18px;
      color: #fff;
    }
  }
}
.login__shadow{
  z-index: -1;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: rotate(45deg);
  transform-origin: left bottom;
  height: 160%;
}

.login-button {
  width: 100%;
  margin-top: 40px;
}
.forgot-password {
  margin-top: 10px;
}
</style>
