<template>
    <el-container style=" flex-direction: column;">
        <el-row style="padding: 20px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: './enumIndex'}">枚举管理</el-breadcrumb-item>
                <el-breadcrumb-item>枚举编辑</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" size="small" @click="handleSave" style="position: absolute; top: 0; right: 0;">保 存</el-button>
        </el-row>
        <el-form :model="form" label-width="100px" class="demo-ruleForm" :rules="rules" ref="ruleForm">
            <el-col :span="12">
                <el-form-item label="name" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="值" prop="value">
                    <el-input v-model="form.value" autocomplete="off" placeholder="唯一值"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="排序号" prop="orderNum">
                    <el-input v-model="form.orderNum" autocomplete="off" placeholder="排序号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="备注" prop="remake">
                    <el-input v-model="form.remake" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
        </el-form>
    </el-container>
</template>
<script>
export default {
    name: 'enumEdit',
    data() {
        return {
            form: {
                id: ""
            },
            rules: {
                name: { required: true, message: '请输入name', trigger: 'blur' },
                // value: { required: true, message: '请输入value', trigger: 'blur' },
            },
            queryInfo: {},
        }
    },
    created() {
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
            this.form = {
                parentId:this.queryInfo.parentId,
                orderNum: this.queryInfo.count?Number(this.queryInfo.count)+1:1,
            }
        },
        handleEdit() {
            let row = this.queryInfo
            this.$axios.get(
                "/api/enum/" + row.id
            ).then(res => {
                this.form = res.data;
            }).catch(err => {
                // console.log(err);
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
                        "/api/enum/save",
                        this.form
                    ).then(res => {
                        if (res.data.status) {
                            this.$message({ type: 'success', message: '保存成功' })
                        } else {
                            this.$message.error("保存失败！"+res.data.msg);
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
