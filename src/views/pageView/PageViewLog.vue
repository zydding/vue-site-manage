<template>
    <el-container class="news-container" ref="newsPublic">
        <el-header class="nopadding">
        </el-header>
        <el-main class="nopadding">
            <el-container style="height: 100%;">
                <el-header class="nopadding search_head">
                    <el-form :model="formSearch" label-width="80px">
                        <el-form-item label="名称">
                            <el-date-picker
                            size="small"
                            v-model="formSearch.time"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <el-button @click="handleSearch" icon="el-icon-search" size="small" type="primary" plain style="margin:10px 0px 10px 10px;">搜索</el-button>
                </el-header>
                <el-main class="nopadding">
                    <el-table :data="tableData" border stripe style="width: 100%;" size="small" height="100%" :header-cell-style="{background:'#ECF5FF',color:'#606266'}" fit v-loading="loading"
                        highlight-current-row>
                        <el-table-column prop="time" label="日期" width="300" header-align="center" fixed>
                        </el-table-column>
                        <el-table-column prop="realIp" label="IP" align="center">
                        </el-table-column>
                        <el-table-column prop="address" label="地址" align="center"></el-table-column>
                        <el-table-column prop="viewUrl" label="访问路径" align="center">
                        </el-table-column>
                        <el-table-column prop="originUrl" label="来源" align="center">
                        </el-table-column>
                        <el-table-column prop="userAgent" label="设备信息" align="center">
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[30, 50, 100]" :page-size="rows"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
import mixin from './../../assets/js/mixin.js'
export default {
    name: 'PageViewLog',
    data() {
        return {
            tableData: [],
            loading: false,
            formSearch: {
                time: '',
            },
            page: 1,
            rows: 30,
            total: 0,
        }
    },
    async created() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            this.loading = true;
            let startTime="",endTime="";
            if(this.formSearch.time && this.formSearch.time.length){
                startTime = this.formSearch.time[0]?this.formSearch.time[0]+" 00:00:00" : "";
                endTime = this.formSearch.time[1]?this.formSearch.time[1]+" 23:59:59" : "";
            }
            this.$axios.get(
                "/api/pageView/list?startTime="+startTime +"&endTime="+ endTime +"&page="+ this.page + "&row="+ this.rows
            ).then(res => {
                if(res.data.content){
                    res.data.content.map((val)=>{
                        let device = "PC";
                        let browser = ""
                        //判断移动设备
                        let ua= val.userAgent ? val.userAgent.toLowerCase() : null;
                        if(ua && (ua.indexOf("linux")!=-1 || ua.indexOf("android")!=-1 || ua.indexOf("adr")!=-1 || ua.indexOf("okhttp")!=-1)){
                            device="Android";
                        }
                        if(ua && (ua.indexOf("darwin")!=-1 || ua.indexOf("iphone")!=-1
                         || ua.indexOf("ipad")!=-1 || ua.indexOf("ipod")!=-1 || ua.indexOf("macintosh")!=-1 || ua.indexOf("cfnetwork")!=-1)){
                            device="IOS";
                        }
                        //判断pc浏览器
                        if(ua && ua.indexOf("chrome")!=-1){
                            browser = "chrome";
                            device = "PC";
                        }else if(ua && ua.indexOf("msie")!=-1){
                            browser = "IE";
                            device = "PC";
                        }else if(ua && ua.indexOf("firefox")!=-1){
                            browser = "firefox";
                            device = "PC";
                        }else{
                            browser = "其他";
                        }
                        val.userAgent = device + "&"+ browser;
                    })
                    this.tableData = res.data.content;
                    this.total = res.data.totalElements;
                }
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
    },
    computed: mixin.computed,
    watch: mixin.watch,
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


</style>


