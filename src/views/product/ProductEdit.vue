<template>
    <el-container style=" flex-direction: column;">
        <el-row style="padding: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: './productIndex'}">作品发布</el-breadcrumb-item>
                <el-breadcrumb-item>通知公告</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" size="small" @click="handleSave" style="position: absolute; top: 0; right: 0;">保 存</el-button>
        </el-row>
        <el-form :model="form" label-width="100px" class="demo-ruleForm" :rules="rules" ref="ruleForm">
            <el-col :span="24">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="作者" prop="author">
                    <el-input v-model="form.author" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="nginx路径" prop="path">
                    <el-input v-model="form.path" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="是否推荐" prop="isRecommend">
                    <el-radio-group v-model="form.isRecommend">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="是否外部" prop="isOuter">
                    <el-radio-group v-model="form.isOuter">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="摘要" prop="description">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="预览图片">
                    <el-upload class="upload-demo" :headers="headers" :data="fileData" :action="upAction" :before-upload="beforeAvatarUpload" :file-list="fileList" :on-remove="handleRemove" :multiple="false"
                        list-type="picture" :on-success="handleAvatarSuccess">
                        <el-button style="margin:10px 0px 10px 10px;" size="small" icon="el-icon-plus" type="primary">选择附件</el-button>
                    </el-upload>
                </el-form-item>
            </el-col>
        </el-form>
    </el-container>
</template>
<script>
export default {
    name: 'ProductEdit',
    data() {
        return {
            form: {
                author: "zeke",
                title: "",
                description: "",
                isOuter: 0,
                isRecommend: 0,
                id: ""
            },
            rules: {
                author: { required: true, message: '请输入作者', trigger: 'blur' },
                title: { required: true, message: '请输入标题', trigger: 'blur' },
                description: { required: true, message: '请输入摘要', trigger: 'blur' },
            },
            upAction: "/api/file/upload",
            fileData: {},
            fileList: [],
            queryInfo: {},
            headers: {"Zeke_Up": 1}
        }
    },
    created() {
        this.queryInfo = this.$route.query;
        // console.log("this.queryInfo",this.queryInfo);
        if(this.queryInfo && this.queryInfo.id) {
            this.handleEdit()
        }else {
            this.handleAdd()
        }
    },
    methods: {
        handleAdd() {
            // 获取id
            this.$axios.get(
                "/api/base/getNewId"
            ).then(res => {
                let id = res.data;
                this.form = {
                    isImage: 0,
                    isRecommend: 0,
                    isOuter: 0,
                    id: id,
                    author: "zeke",
                }
                this.fileData = {
                    "bizPk": id,
                    "originalName": "",
                }
            }).catch(err => {
                // console.log(err);
            })
        },
        handleEdit() {
            let row = this.queryInfo
            this.fileData = {
                "bizPk": row.id,
            }
            this.$axios.get(
                "/api/product/" + row.id
            ).then(res => {
                this.form = res.data;
                this.getFileList(res.data.fileId)
            }).catch(err => {
                // console.log(err);
            })
        },
        //获取id
        getFileList(formId) {
            this.$axios.get(
                "/api/file/getFileList?page=1&row=100&id=" + formId
            ).then(res => {
                if(res.data.totalPages>0){
                    res.data.content.map((item)=>{
                        let file = {
                            name: item.originalName,
                            id: item.id,
                            url: "/api/file/view?id=" + formId,
                        }
                        this.fileList.push(file);
                    })
                }
            }).catch(err => {
                // console.log(err);
            })
            
        },

        //上传前校验
        beforeAvatarUpload(file) {
            this.fileList.push(file);
            this.form.fileName = file.name;
            return true;
        },
        //Excel上传成功,重新刷新数据
        handleAvatarSuccess(res, file) {
            file.id = res[0].id;
            this.form.fileId = file.id;
            this.$message.success("上传成功");
        },
        //删除选择文件
        handleRemove(file, fileList) {
            this.$axios({
                method: 'delete',
                url: "/api/file/deleteFileList?id=" + file.id,
            }).then(res => {
                // console.log(res);
                this.fileList.forEach((item, index) => {
                    if (item.id === file.id) {
                        this.fileList.splice(index, 1);
                    }
                })
                this.$message({ type: 'success', message: '删除成功!' });
            }).catch(err => {
                console.log(err);
            })
        },
        handleSave() {
            // var params = new FormData();
            // for(let i in this.form){
            //     params.append(i,this.form[i]);
            // }
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$axios.post(
                        "/api/product/save",
                        this.form
                    ).then(res => {
                        if (res.data) {
                            this.$message({ type: 'success', message: '保存成功' })
                        } else {
                            this.$message.error(res.data)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
}
</script>
