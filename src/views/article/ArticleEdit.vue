<template>
    <el-container style="flex-direction: column;">
        <el-row style="padding: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: './articleIndex'}">文章发布</el-breadcrumb-item>
                <el-breadcrumb-item>通知公告</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" size="small" @click="handleSave" style="position: absolute; top: 0; right: 0;">保 存</el-button>
        </el-row>
        <el-form :model="form" label-width="100px" class="demo-ruleForm" :rules="rules" ref="ruleForm">
            <el-col :span="12">
                <el-form-item label="作者" prop="author">
                    <el-input v-model="form.author" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分类" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
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
            <el-col :span="12">
                <el-form-item label="摘要" prop="description">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="详细内容" prop="content">
                    <Editor :value="form.content" @input="changContent"></Editor>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
                <el-form-item label="附件" prop="fileName">
                    <el-upload class="upload-demo" :data="fileData" :action="upAction" :before-upload="beforeAvatarUpload" :file-list="fileList" :on-remove="handleRemove" :multiple="false"
                        list-type="picture" :on-success="handleAvatarSuccess">
                        <el-button style="margin:10px 0px 10px 10px;" size="small" icon="el-icon-plus" type="primary">选择附件</el-button>
                    </el-upload>
                </el-form-item>
            </el-col> -->
        </el-form>
    </el-container>
</template>
<script>
import getEnumList from './../../assets/js/common.js'
import Editor from './../../components/Editor'
export default {
    name: 'ArticleEdit',
    components: {
        Editor
    },
    data() {
        return {
            form: {
                author: "zeke",
                title: "",
                description: "",
                content: "",
                isOuter: 0,
                isRecommend: 0,
                id: ""
            },
            rules: {
                author: { required: true, message: '请输入作者', trigger: 'blur' },
                title: { required: true, message: '请输入标题', trigger: 'blur' },
                description: { required: true, message: '请输入摘要', trigger: 'blur' },
                content: { required: true, message: '请输入内容', trigger: 'blur' },
                type: { required: true, message: '请选择类型', trigger: 'change' },
            },
            queryInfo: {},
            currentRow: {
                imageId: '',
                imageUrl: ''
            },
            typeList:[],
            validArray: ['author','title','description','type'],
        }
    },
    async mounted() {
        this.typeList =await getEnumList("ArticleEnum");
        this.queryInfo = this.$route.query;
        // console.log("this.queryInfo",this.queryInfo);
        if(this.queryInfo && this.queryInfo.id) {
            this.handleEdit();
        }else {
            this.handleAdd();
        }
    },
    methods: {
        handleAdd() {
            this.form= {
                author: "zeke",
                isOuter: 0,
            };
            // this.reset();
            //获取id
            // this.$axios.get(
            //     "/base/getNewId"
            // ).then(res => {
            //     let id = res.data;
            //     this.form = {
            //         isImage: 0,
            //         isRecommend: 0,
            //         isOuter: 0,
            //         id: id,
            //         content: '',
            //     }
            //     this.fileData = {
            //         "file.bizPk": id,
            //         "file.metaData.fileName": "",
            //     }
            // }).catch(err => {
            //     // console.log(err);
            // })
        },
        handleEdit() {
            let row = this.queryInfo
            this.fileData = {
                "file.bizPk": row.id,
            }
            this.$axios.get(
                "/api/article/" + row.id
            ).then(res => {
                this.form = res.data;
            }).catch(err => {
                // console.log(err);
            })
        },
        getTypeName(val){
            let obj = {};
            obj = this.typeList.find((item)=>{//遍历list的数据
                return item.id === val;//筛选出匹配数据
            });
            console.log(obj.name);//获取list里面的name
        },
        handleSave() {
            if(!this.form.content){
                this.$refs["ruleForm"].validate((valid) => {});
                return;
            }
            let validFlag=true;
            //部分验证
            this.$refs["ruleForm"].validateField(this.validArray,(error) => {
                if (!error) {
                    
                } else {
                    validFlag=false;
                }
            })
            if(!validFlag){
                console.log("验证失败！");
                return;
            }
            let obj = {};
            obj = this.typeList.find((item)=>{//遍历list的数据
                return item.id === this.form.type;//筛选出匹配数据
            });
            //获取name属性
            this.form.typeName=(obj.name||"");
            this.$axios.post(
                "/api/article/save",
                this.form
            ).then(res => {
                if (res.data) {
                    // this.$emit('detailShow',this.form) // 事件分发
                    this.$message({ type: 'success', message: '保存成功' })
                } else {
                    this.$message.error(res.data)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        changContent(val) {
            this.form.content = val.content;
            this.form.contentStr = val.text;
        },
    },
}
</script>
