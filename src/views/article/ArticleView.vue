<template>
    <el-container style="flex-direction: column;">
        <el-row style="padding: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: './articleIndex'}">文章发布</el-breadcrumb-item>
                <el-breadcrumb-item>通知公告</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-container style="width: 1000px; margin: 20px auto;">
        <el-header height="auto" style="display: flex; flex-flow: column nowrap; align-items: center;">
            <div class="col title">{{form.title}}</div>
            <div class="col author">作者： {{form.author}}&nbsp;&nbsp;发布时间: {{form.createTime}}</div>
        </el-header>
        <el-main style="border-top: 1px dashed #999;">
            <div class="col col_content" v-html="form.content"></div>
        </el-main>
        <el-footer>
            <div class="col" style="min-height: 200px;">
                <el-table
                    :data="fileList"
                    border
                    stripe
                    size="small"
                    :header-cell-style="{background:'#ECF5FF',color:'#606266'}"
                    style="width: 100%"
                    height="300">
                <el-table-column
                        type="index"
                        align="center"
                        label=" "
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="filename"
                        align="left"
                        header-align="center"
                        :show-overflow-tooltip="true"
                        label="文件"></el-table-column>
                <el-table-column
                        prop="fileName"
                        align="left"
                        header-align="center"
                        :show-overflow-tooltip="true"
                        label="文件名称">
                    <template slot-scope="scope">
                        {{ getFileName(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        align="center"
                        width="100"
                        label="上传时间">
                    <template slot-scope="scope">
                        {{ getUpdateTime(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="orderNum"
                        align="center"
                        width="100"
                        label="排序号">
                    <template slot-scope="scope">
                        {{ getoOrderNum(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="130">
                    <template slot-scope="scope">
                        <el-tooltip content="在线预览" placement="top">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-view"
                                    @click="previewFile(scope.row)"
                                    circle
                                    plain></el-button>
                        </el-tooltip>
                        <el-tooltip content="下载" placement="top">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-download"
                                    @click="downloadFile(scope.row)"
                                    circle
                                    plain></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="showDelAlert(scope.row)"
                                    circle
                                    plain></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </el-footer>
        </el-container>
    </el-container>
</template>

<script>
//编辑框样式
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
export default {
    name: 'ArticleView',
    data() {
        return {
            fileList:[],
            bizPk: "",
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
        }
    },
    created() {
        let bizPk = this.$route.query.id;
        this.bizPk = bizPk;
        if (bizPk === undefined || bizPk === null || bizPk === '') {
            this.$message({
                type: 'info',
                message: '没有ID！'
            })
            return;
        }
        this.getTableData(bizPk);
        this.getFileList(bizPk);
    },
    methods: {
        getTableData(id) {
            this.$axios.get(
                "/api/article/"+id
            ).then(res => {
                this.form=res.data;
            }).catch(err => {
                this.$message.error(err)
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
                // this.$message.error(err)
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
                    this.getFileList(this.bizPk);
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
    p{
        margin: 0;
        padding: 0;
    }
    img{
        max-width: 100%;
    }
}
.col_content img{
    max-width: 100%;
}
.title{
    font-size: 24px;
    font-weight: 600;
}

</style>

<style scoped>
    .col_content img{
        max-width: 100%;
    }
</style>