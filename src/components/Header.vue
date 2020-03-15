<template>
  <div id="hhMainDiv" style="height: 100%;">
    <el-row style="height: 100%;">
      <el-col :span="12" style="height: 100%;">
        <div class="head-wrap">
          <!-- <img src="./../assets/logo.png" alt style="height: 50px;" /> -->
        </div>
      </el-col>
      <el-col :span="12" style="height: 100%;">
        <el-dropdown
          placement="bottom"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            {{ userName }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog width="600px" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="pwdform" :rules="rules" ref="pwdform" label-width="100px">
        <el-form-item label="当前密码" prop="pwd">
          <el-input type="password" v-model="pwdform.pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新的密码" prop="pwdNew">
          <el-input type="password" v-model="pwdform.pwdNew" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="pwdRe">
          <el-input type="password" v-model="pwdform.pwdRe" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('pwdform')">取 消</el-button>
        <el-button type="primary" @click="submitForm('pwdform')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="enptyDiaDiv">
      <el-dialog
        closed="true"
        closable="false"
        :visible.sync="enptyDialogVisible"
        width="0"
        height="0"
      ></el-dialog>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.pwdform.pwdRe !== "") {
                this.$refs.pwdform.validateField("pwdRe");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.pwdform.pwdNew) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            enptyDialogVisible: false,
            dialogFormVisible: false,
            todoTotal: 0,
            pwdform: {
                pwd: "",
                pwdNew: "",
                pwdRe: ""
            },
            rules: {
                pwdNew: [{ validator: validatePass, trigger: "blur" }],
                pwdRe: [{ validator: validatePass2, trigger: "blur" }]
            },
            userName: "zeke",
        };
    },
    name:'Header',
    methods:{
        //修改密码点确定
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                this.pwdform.pwd;
                this.pwdform.pwdNew;
                let param = {
                    oldPassword: this.pwdform.pwd,
                    newPassword: this.pwdform.pwdNew
                };
                //退出登录
                this.$axios
                    .post("/api/login/updatePassword", this.$qs.stringify(param))
                    .then(response => {
                    if (response.data.succeed) {
                        this.$message({
                        message: "更新密码成功！",
                        type: "success"
                        });
                        this.dialogFormVisible = false;
                        this.$refs[formName].resetFields();
                    } else {
                        this.$message.error(
                        response.data.msg ? response.data.msg : "失败"
                        );
                    }
                    })
                    .catch(error => {
                    this.$message.error("异常，请联系管理员！");
                    console.log("error:" + error.toString());
                    });
                } else {
                return false;
                }
            });
        },
        resetForm(formName) {
            //修改密码点取消
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        handleCommand(command) {
            if (command === "logout") {
                //退出登录
                this.$axios
                .post("/api/login/logout")
                .then(response => {
                    sessionStorage.setItem("logined", false);
                    this.$router.replace("/login");
                })
                .catch(error => {
                    this.$message.error("异常，请联系管理员！");
                    console.log("error:" + error.toString());
                });
            } else {
                //updatePwd
                this.dialogFormVisible = true;
            }
        },
    }
}
</script>

<style lang="scss">
    .el-dropdown{
        padding-right: 2rem;
        float: right;
        height: 100%;
        cursor: pointer;
        .el-dropdown-link{
            color: #eff4fe;
            height: 100%;
            font-size: 16px;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }
    }

</style>