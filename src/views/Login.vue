<template>
  <div class="body">
    <div class="header">
      <!-- <img width="160" src="./../assets/logo.png" alt=""> -->
      <!-- <p class="title">登录</p> -->
    </div>
    <LoginCard :loading="loading" @clickLogin="clickLogin($event,{})" />
  </div>
</template>

<script>
import LoginCard from "./../components/LoginCard.vue";
import { setToken,setLoginToken } from "./../assets/js/auth.js";
export default {
   mounted () {
    const that = this;
    window.onresize = () => {
      return (() => {
        // console.log(window.innerWidth);
      })()
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    clickLogin(userInfo) {
      this.loading=true;
      sessionStorage.setItem("isLogin", true);
      this.$axios
        .post("/api/login/check?code="+ userInfo.code+"&pwd="+ userInfo.pwd)
        .then(response => {
          console.log(response);
          if (response.status==200) {
            // sessionStorage.setItem("token", response.headers.token);
            this.$store.commit("user/setProp",response.data.role);
            sessionStorage.setItem("logined", true);
            sessionStorage.setItem("login_name", response.data.name);
            this.$router.replace('/home');
            // window.location.replace('./home');
          }else{
            if(response.status==244){
                //用户密码错误
                this.$message.error("用户密码错误,或者停用");
            }else{
              this.$message.error("异常！!失败");
              // console.log("error:" + error.toString());
            }
          }
          this.loading=false;
        })
        .catch(error => {
          this.$message.error("异常！");
          this.loading=false;
          console.log("error:" + error.toString());
        });
    }
  },
  components: {
    LoginCard
  }
};
</script>

<style>
  html,body{
    height: 100%;
  }
</style>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100%;
  background-color: #3E4E67;
}
.header {
  padding: 20px 0;
  height: 188px;
  color: #f0f4f8;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-around;
  @media only screen and (min-width: 1024px) {
    align-items: center;
  }
  .title{
    padding: 0;
    margin: 0;
    font-size: 26px;
  }
  h1,
  h2,
  h3 {
    color: #f0f4f8;
    padding: 0;
    margin: 0;
  }
  .links {
    display: flex;
    font-family: "Open Sans";
    span {
      padding: 0 10px;
      font-size: 18px;
      border-right: 1px solid #9fb3c8;
      &:last-child {
        border-right: none;
      }
    }
  }
  .version {
    font-family: "Open Sans";
    padding: 0 10px;
    color: #9fb3c8;
    font-size: 12px;
    margin-top: 5px;
  }
  .logo {
    font-family: "Open Sans";
    letter-spacing: 3px;
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .logo .part-2 {
    color: #d64545;
  }
}
</style>
