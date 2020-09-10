<template>
    <el-container style="flex-direction: column;">
        <el-row style="padding: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: './fundIndex'}">基金管理</el-breadcrumb-item>
                <el-breadcrumb-item>基金编辑</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" size="small" @click="handleSave" style="position: absolute; top: 0; right: 0;">保 存</el-button>
        </el-row>
        <el-form :model="form" label-width="100px" class="demo-ruleForm" :rules="rules" ref="ruleForm">
            <el-col :span="12">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option
                        v-for="item in statusList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行业" prop="industry">
                    <el-checkbox-group v-model="form.industry">
                        <el-checkbox v-for="item in industryList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="经理" prop="manager">
                    <el-input v-model="form.manager"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
            </el-col>
        </el-form>
    </el-container>
</template>
<script>
import getEnumList from './../../assets/js/common.js'
export default {
    name: 'FundEdit',
    components: {
    },
    data() {
        return {
            form: {
                name: "",
                remark: "",
                content: "",
                id: "",
                industry: []
            },
            rules: {
                name: { required: true, message: '请输入名称', trigger: 'blur' },
                // status: { required: true, message: '请选择状态', trigger: 'change' },
            },
            queryInfo: {},
            currentRow: {
                imageId: '',
                imageUrl: ''
            },
            statusList:[],
            industryList: [],
        }
    },
    async mounted() {
        this.industryList =await getEnumList("fund_industry");
        this.statusList =await getEnumList("fund_status");
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
            //获取id
            this.$axios.get(
                "/api/base/getNewId"
            ).then(res => {
                let id = res.data;
                this.form = {
                    id: id,
                    newFlag:1,
                    industry: [],
                }
            }).catch(err => {
                // console.log(err);
            })
        },
        handleEdit() {
            let row = this.queryInfo
            this.fileData = {
                "file.bizPk": row.id,
            }
            this.$axios.get(
                "/api/fund/" + row.id
            ).then(res => {
                let industryArr=[];
                if(res.data.industry && res.data.industry.length>0){
                    res.data.industry.some((val)=>{
                        industryArr.push(val.enumId);
                    })
                }
                res.data.industry=industryArr;
                this.form = res.data;
            }).catch(err => {
                // console.log(err);
            })
        },
        getEnumName(list,id){
            let name='';
            list.some((val)=>{
                if(val.id==id){
                    name=val.name;
                    return true;
                }
            })
            return name;
        },
        handleSave() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    //获取name属性
                    if(this.form.status){
                        this.form.statusName=this.getEnumName(this.statusList,this.form.status);
                    }
                    let industry=[];
                    if(this.form.industry && this.form.industry.length>0){
                        this.form.industry.some((val)=>{
                            industry.push({
                                enumId:val,
                                mainId: this.form.id,
                            });
                        })
                    }
                    this.$axios.post("/api/fund/save",
                        this.$qs.stringify({
                            fund: JSON.stringify(this.form),
                            industry: JSON.stringify(industry),
                        })
                        ).then(res => {
                        if (res.data) {
                            this.$message({ type: 'success', message: '保存成功' });
                            this.form.newFlag=0;
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
        changContent(val) {
            this.form.content = val
        },
    },
}
</script>
