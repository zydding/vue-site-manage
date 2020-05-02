<template>
    <el-container class="news-container" ref="newsPublic">
        <el-header class="nopadding">
        </el-header>
        <el-main class="nopadding">
            <el-container style="height: 100%;">
                <el-header class="nopadding">
                    <el-button @click="handleAdd" icon="el-icon-plus" size="small" type="primary" plain style="margin:10px 0px 10px 0px;">添加</el-button>
                    <el-input placeholder="请输入姓名" v-model="name" class="input-with-select" size="small" style="width: 250px; float: right; margin-top: 9px" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-header>
                <el-main class="nopadding">
                    <el-table :data="tableData" border stripe style="width: 100%;" size="small" height="100%" :header-cell-style="{background:'#ECF5FF',color:'#606266'}" fit v-loading="loading"
                        highlight-current-row>
                        <el-table-column prop="name" label="姓名" width="300" header-align="center" fixed>
                            <!-- <template slot-scope="scope">
                                <a class="activeLink" @click="modifyRow(scope.row)">{{scope.row.name}}</a>
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="code" label="登录名" width="100" header-align="center" fixed>
                        </el-table-column>
                        <el-table-column label="是否能用" align="center">
                            <template slot-scope="scope">
                                {{scope.row.isUse==1 ? '是' : '否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否管理" align="center">
                            <template slot-scope="scope">
                                {{scope.row.role==1 ? '管理' : '游客'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                        <el-table-column v-if="this.$store.state.user.prop=='1'" label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-tooltip content="编辑" placement="top">
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="modifyRow(scope.row)" circle plain></el-button>
                                </el-tooltip>
                                <el-tooltip content="删除" placement="top">
                                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRow(scope.row)" circle plain></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 50]" :page-size="rows"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-footer>
            </el-container>
        </el-main>
        <el-dialog title="新增人员" top="7vh" :close-on-click-modal="false" :visible.sync="dialogAddFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别:" :label-width="formLabelWidth" prop="sex">
                            <el-radio-group v-model="form.sex" size="mini">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="登录名" :label-width="formLabelWidth" prop="code">
                            <el-input v-model="form.code" placeholder="请输入登录名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    
                    <el-col :span="12">
                        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="isUse">
                            <el-switch
                                v-model="form.isUse"
                                active-color="#13ce66"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否管理" :label-width="formLabelWidth" prop="role">
                            <el-switch
                                v-model="form.role"
                                active-color="#13ce66"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序号" :label-width="formLabelWidth" prop="orderNo">
                            <el-input type="number" v-model="form.orderNo" placeholder="请输入排序号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm('form')" size="medium">确 定</el-button>
                <el-button @click="dialogAddFormVisible = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>

export default {
    name: 'UserIndex',
    data() {
        return {
            tableData: [],
            loading: false,
            name: "",
            page: 1,
            rows: 15,
            total: 0,
            dialogAddFormVisible: false,
            form:{},
            formLabelWidth: '120px',
            rules: {
                code: [
                    {
                        required: true,
                        message: "登录名不能为空",
                        trigger: "blur"
                    }
                ],
            }
        }
    },
    created() {
        this.getTableData()
    },
    methods: {
        getTableData() {
            this.loading = true
            this.$axios.get(
                "/api/user/list?name="+this.name+"&page="+ this.page + "&row="+ this.rows
            ).then(res => {
                this.tableData = res.data.content;
                this.total = res.data.totalElements;
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.log(err);
            })
        },
        handleSearch() {
            this.getTableData()
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.rows = val
            this.page = 1
            this.getTableData()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val
            this.getTableData()
        },
        handleAdd() {
            this.form={
                isUse: 1,
                sex: 1,
                orderNo: this.total+1,
            }
            this.dialogAddFormVisible=true;
        },
        //编辑
        modifyRow(row) {
            // console.log(row);
            this.form = row;
            this.dialogAddFormVisible=true;
        },
        deleteRow(row) {
            this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(
                    "/api/user/"+row.id
                ).then(res => {
                    if (res.data) {
                        this.$message({ type: 'success', message: '删除成功!' });
                        this.getTableData()
                    } else {
                        this.$message.error("删除失败！");
                    }
                }).catch(err => {
                    console.log(err);
                })

            }).catch(() => { });

        },
        saveForm(){
            var params = new FormData();
            for(let i in this.form){
                params.append(i,this.form[i]);
            }
            this.$axios.post(
                "/api/user/save",
                params
            ).then(res => {
                if (res.data) {
                    this.dialogAddFormVisible=false;
                    this.$message({ type: 'success', message: '保存成功!' });
                    this.getTableData();
                } else {
                    this.$message.error("保存失败！");
                }
            }).catch(err => {
                console.log(err);
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.news-container {
    padding: 10px;
    height: 100%;
    box-sizing: border-box;
    .el-header {
        height: auto !important;
    }
    .el-footer {
        height: auto !important;
        background-color: #ecf5ff;
    }
}
.demo-form-inline {
    text-align: right;
    .el-form-item {
        margin-bottom: 10px;

        &:last-child {
            float: left;
        }
    }
}

.el-tabs__header {
    margin-bottom: 10px;
}

.demo-ruleForm {
    .el-date-editor {
        width: 100%;
    }
    .el-form-item {
        width: 90%;
    }
    .el-upload-list {
        display: flex;
        li {
            flex: 0 0 50%;
        }
    }
}

.activeLink {
    color: #008cd6;
    cursor: pointer;
}

.activeLink:hover {
    color: #606266;
}
</style>
<style lang="scss" scoped>
.demo-ruleForm {
    .el-upload-list {
        flex-flow: row wrap;
        display: flex;
        li {
            // margin: 0 10px 10px 0;
            flex: 0 0 50%;
        }
    }
}
.nopadding {
    padding: 0 !important;
}
</style>

