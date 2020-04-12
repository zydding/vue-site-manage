<template>
<div :style="pageStyle">
    <div class="row header">
        
    </div>
    <el-container style="width: 1000px; margin: 20px auto 0px;">
    <el-header height="80px" style="display: flex; flex-flow: column nowrap; align-items: center;">
        <div class="col title">{{form.title}}</div>
        <div class="col author">作者： {{form.author}}&nbsp;&nbsp;发布时间: {{form.createTime}}</div>
    </el-header>
    <el-main style="border-top: 1px dashed #999;">
        <div class="col col_content ql-editor" v-html="form.content"></div>
    </el-main>
    <el-footer height="208px">
    </el-footer>
    </el-container>
    <div class="model8" style="display: none;">
        滇ICP备05000252 流量统计 昆明安泰得软件股份有限公司 版权所有 Copyright2012-2014 atidesoft.com Inc.All rights reserved
    </div>
</div>
</template>

<script>
//编辑框样式
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
export default {
    name: "newsViewFromHome",
    data() {
        return {
            loginProjectName: "",
            homeLogoUrl: "",
            fileList:[],
            myDate:"",
            isShowDown: false,
            isShowApp: false,
            form: {
                author: "",
                title: "",
                summary: "",
                content: "",
                topDate: '',
                origin: '',
                isOuter: 0,
                isTop: 0,
                isImage: 0,
                newFormFlag: 1,
                id: ""
            },
            pageStyle: "",
        }
    },
    created() {
        let bizPk = this.$route.query.id;
        if (bizPk === undefined || bizPk === null || bizPk === '') {
            this.$message({
                type: 'info',
                message: '没有ID！'
            })
            return;
        }
        this.getTableData(bizPk);
        this.getFileList(bizPk);
        // let dateVal;
        // dateVal = new Date();
        // this.myDate = this.dateFmtC(dateVal);
        this.dateChange();
        this.getConfigList();
        // console.log(this.getWinHeight());
        //用来控制底部高度，不能小于window高度
        this.pageStyle = {
            "min-height":this.getWinHeight() + "px",
            "position": "relative"
        };
    },
    methods: {
        getWinHeight() {
            if (window.innerHeight) {
                return window.innerHeight;
            }
            if (document.compatMode === "CSS1Compat") {
                return window.document.documentElement.clientHeight;
            }
            return window.document.body.clientHeight;
        },
        dateChange(){
            let that_ = this;
            let dateVal;
            var interval = setInterval(()=>{
                dateVal = new Date();
                // console.log(that_.dateFmtC(dateVal));
                // this.$set(that_.myDate,'b',2)
                that_.myDate = that_.dateFmtC(dateVal);
            },1000)
        },
        //日期格式化(yyyy年MM月dd日 hh时mm分)
        dateFmtC(value) {
            if (null != value && "" != value) {
                var date = new Date(value);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                if (m < 10) {
                    m = "0" + m;
                }
                var d = date.getDate();
                if (d < 10) {
                    d = "0" + d;
                }
                var h=date.getHours();
                if (h < 10) {
                    h = "0" + h;
                }
                var mm=date.getMinutes();
                if (mm < 10) {
                    mm = "0" + mm;
                }
                var ss=date.getSeconds();
                if (ss < 10) {
                    ss = "0" + ss;
                }
                var str = "星期" + "日一二三四五六".charAt(date.getDay());
                return y + '年' + m + '月' + d +'日' +' ' + str + ' ' + h + ':' + mm;
            } else {
                return "";
            }
        },
        getConfigList(id) {
            this.$axios.get(
                "/loginConfig/getList"
            ).then(res => {
                if(res.data.rows.length>0){
                    let loginConfig = res.data.rows[0];
                    if(loginConfig.homeLogoUrl){
                        this.homeLogoUrl = "/fs/files/download/"+loginConfig.homeLogoUrl;
                    }
                    if(loginConfig.loginProjectName){
                        this.loginProjectName = loginConfig.loginProjectName;
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        getTableData(id) {
            this.$axios.get(
                "/processapprovalnew/cms/getAllcontent?id="+id
            ).then(res => {
                this.form=res.data.data;
            }).catch(err => {
                console.log(err);
            })
        },
        //获取id
        getFileList(formId){
            this.fileList =[];
            this.$axios.get(
                "/fs/files/search?metaData.formId="+formId
            ).then(res => {
                this.fileList = res.data;
            }).catch(err => {
                // console.log(err);
            })
        },
        //转换上传时间
        getUpdateTime(data) {
            var date = new Date(data.updateTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            return Y+M+D;
        },
        //获取文件名称
        getFileName(data) {
            if(data.metaData.fileName !== null){
                return data.metaData.fileName
            }else{
                return ""
            }
        },
        //获取排序号
        getoOrderNum(data) {
            if(data.metaData.orderNum !== null){
                return data.metaData.orderNum
            }else{
                return ""
            }
        },
        //删除数据提示
        showDelAlert(data) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                cancelButtonClass: "btn-custom-cancel",
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delForm(data)
            }).catch(()=>{})
        },
        //删除数据
        delForm(data) {
            this.axios.delete(`/fs/files/delete/${data.id}`).then(res => {
                if (res.data.succeed) {
                    this.getTableData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                } else {
                    this.$message({
                        message: res.data.msg,
                        showClose: true,
                        type: 'error'
                    })
                }
            }).catch(error => {
                console.log('error:' + error.toString())
            })
        },
        //下载文件
        downloadFile(data) {
            window.open(`/fs/files/download/${data.id}?asAttachment=true`)
        },
        //在线预览
        previewFile(data) {
            window.open(`/fs/files/view?metaData.formId=${data.metaData.formId}&id=${data.id}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.col{
    padding: 5px 0;
    font-size: 14px;
    img{
        max-width: 100%;
    }
}
.title{
    font-size: 24px;
    font-weight: 600;
}
</style>
<style>
    .col_content img{
        max-width: 100%;
    }
</style>

