<template>
	<el-container>
		<el-header class="search_head">
			<el-form :model="formSearch" label-width="80px">
				<el-form-item label="day">
					<el-input placeholder="请输入day" v-model="formSearch.day" class="input-with-select" size="small" clearable>
					</el-input>
				</el-form-item>
			</el-form>
			<el-button @click="getList" icon="el-icon-search" size="small" type="primary" plain style="margin:10px 0px 10px 10px;">搜索</el-button>
		</el-header>
		<el-main>
			<div style="width: 100%; height: 400px;" id="main" ref="main"></div>
		</el-main>
	</el-container>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return {
			formSearch: {
				day: 30,
			},
			// day: 30,
			tableData:[],
        };
    },
    name:'Dashboard',
    methods:{
		getList(){
			this.loading = true
            this.$axios.get(
                "/api/pageView/findByDay?day="+this.formSearch.day
            ).then(res => {
				let dataTemp=[];
				for(let i=this.formSearch.day-1;i>=0;i--){
					var day1 = new Date();
					day1.setTime(day1.getTime()-i*24*60*60*1000);
					var s1 = day1.getFullYear()+"-0" + (day1.getMonth()+1) + "-" + day1.getDate();
					let dataItem={
						ipcount: 0,
						pageview: 0,
						time: s1,
					};
					if(res.data && res.data.length>0){
						res.data.forEach((val)=>{
							if(val.time==s1){
								dataItem={
									ipcount: val.ipcount,
									pageview: val.pageview,
									time: s1,
								}
								return true;
							}
						})
					}
					dataTemp.push(dataItem);
				}
				this.tableData = dataTemp;
				this.loadEchart();
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.log(err);
            })
		},
		loadEchart(){
			let data= this.tableData;
			let timeArr =[];
			let dataArr =[];
			let ipArr =[];
			data.forEach((item)=>{
				timeArr.push(item.time);
				dataArr.push(item.pageview);
				ipArr.push(item.ipcount)
			})
			const chart1 = this.$refs.main;
			if (chart1) {
				const myChart = echarts.init(
					chart1
				);
				const option = {
					title: {
						text: (this.formSearch.day||"")+'天访问量'
					},
					legend: {
						data: ['访问量', 'IP数']
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: {
						data: timeArr,
						axisLabel:{
							// interval: 0,
							rotate: 30
						},
						type: 'category',
					},
					grid:{
						left: '30px',
						right: '30px',
					},
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [{
						name: '访问量',
						type: 'bar',
						data: dataArr
					},{
						name: 'IP数',
						type: 'bar',
						data: ipArr
					},]
				};
				myChart.setOption(option);
				window.addEventListener("resize", function() {
					myChart.resize();
				});
			}
		},
	},
	mounted(){
		this.getList();
	},
}
</script>

<style lang="scss" scoped>
	/**header */
</style>