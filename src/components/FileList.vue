<template>
    <div style="height: 100%">
        <div class="csflHeaderDiv">
            <!-- <el-button size="small" @click="addForm" type="primary" plain><i class="el-icon-plus"></i>新增</el-button> -->
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/api/file/upload"
                    :before-upload="beforeAvatarUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :data="{'bizPk': (this.parentMsg && this.parentMsg.bizPk)?this.parentMsg.bizPk:'','bizType': this.parentMsg.bizType,'orderNum': this.tableData.length+1,}"
                    :limit="1"
                    :headers="{'Zeke_Up':'1'}"
                    :auto-upload="true"
                    :show-file-list="false"
                    >
                <el-button
                :disabled="(this.parentMsg && this.parentMsg.bizPk)?false: true"
                 plain slot="trigger" size="small" type="primary">添加附件</el-button>
                <!-- <div slot="tip" class="el-upload__tip" style="width: 60%; width: -webkit-calc(100% - 100px); width: calc(100% - 100px);float: right; margin-top: 0px;">文件:（必选，且只能选择一个文件）</div> -->
            </el-upload>
        </div>
        <div class="csflContentDiv">
            <el-table
                    :data="tableData"
                    border
                    stripe
                    size="small"
                    :header-cell-style="{background:'#ECF5FF',color:'#606266'}"
                    style="width: 100%"
                    height="100%">
                <el-table-column
                        type="index"
                        align="center"
                        label=" "
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="originalName"
                        align="left"
                        header-align="center"
                        :show-overflow-tooltip="true"
                        label="文件名">
                    <template slot-scope="scope">
                        {{ getFileName(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="fileSize"
                        align="center"
                        width="100"
                        label="文件大小(B)">
                </el-table-column>
                <el-table-column
                        prop="suffix"
                        align="center"
                        width="100"
                        label="文件类别">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        align="center"
                        width="100"
                        label="上传时间">
                </el-table-column>
                <!-- <el-table-column
                        prop="orderNum"
                        align="center"
                        width="100"
                        label="排序号">
                    <template slot-scope="scope">
                        {{ getoOrderNum(scope.row) }}
                    </template>
                </el-table-column> -->
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
    </div>
</template>

<script>
    export default {
        name: "FileList",
        props: {
            parentMsg: {
                bizPk: '',
            },
            type: '',
            autoUpdate: Boolean,
        },
        data() {
            return {
                tableData: [],
            }
        },
        methods: {
            //获取table数据
            getTableData() {
                this.axios.get(
                    "/api/file/getFileList?bizPk=" + this.parentMsg.bizPk+"&bizType="+this.parentMsg.bizType+"&page=1&row=100"
                ).then(res => {
                    this.tableData = res.data.content;
                }).catch(error => {
                    console.log('error:' + error.toString())
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
                return data.originalName?data.originalName:data.filename;
            },
            //获取排序号
            getoOrderNum(data) {
                return data.orderNum? data.orderNum: "";
            },
            beforeAvatarUpload(file){
                if(this.parentMsg.bizPk){
                    return true;
                }else{
                    this.$message.error('业务数据不存在！请添加数据后添加附件!');
                    return false;
                }
                let fileName = file.name.toLowerCase();
                const isExcel = (fileName.indexOf(".png")!=-1 || fileName.indexOf(".jpeg")!=-1 || fileName.indexOf(".jpg")!=-1
                || fileName.indexOf(".doc")!=-1 || fileName.indexOf(".docx")!=-1 || fileName.indexOf(".xlsx")!=-1
                || fileName.indexOf(".pdf")!=-1);
                if (!isExcel) {
                    this.$message.error('支持上传doc、docx、xlsx、pdf、png、jpeg、jpg等格式文件!');
                }
                return isExcel;

                //限定文件上传大小
                const isLt200M= file.size / 1024/ 1024< 200;
                if (!isLt200M) {
                    this.$message.error('上传文件大小不能超过 200M!');
                }
                return isLt200M;
            },
            //上传成功
            uploadSuccess() {
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                });
                this.getTableData()
                this.$refs.upload.uploadFiles = []
            },
            //上传失败
            uploadError(err) {
                this.$message({
                    message: err,
                    showClose: true,
                    type: 'error'
                })
            },
            //删除数据提示
            showDelAlert(data) {
                this.$confirm('此操作将永久删除该数据 '+(data.originalName?data.originalName:data.filename)+', 是否继续?', '提示', {
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
                this.axios.delete(
                    '/api/file/deleteFileList?id=' + data.id
                ).then(res => {
                    if (res) {
                        this.getTableData();
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
                window.open(`/api/file/getStream?id=`+data.id)
            },
            //点击图片
            handlePreview(file){
                window.open(window.location.origin + "/api/file/view?id=" + file.id);
            },
        },
        watch: {
            parentMsg:{
                handler(newVal,oldVal) {
                    // console.log("newValue",newVal,a);
                    //自动更新
                    if(this.autoUpdate){
                        if (newVal && newVal.bizPk) {
                            this.getTableData()
                        }else{
                            this.tableData=[];
                        }
                    }else{
                        if (newVal && newVal.bizPk && oldVal && newVal.bizPk!=oldVal.bizPk) {
                            this.getTableData()
                        }else{
                            this.tableData=[];
                        }
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="less">
    .csflHeaderDiv {
        /* height: 40px; */
        padding: 0 0 10px 0;
        box-sizing: border-box;
    }
    .csflContentDiv {
        height: 95%;
        height: calc(100% - 42px);
    }

</style>

<style>
    .csflContentDiv .el-dialog__body {
        padding: 0 20px;
    }
</style>
