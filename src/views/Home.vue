<template>
	<div class="navbar">
		<ul id="main">
			<li><router-link  to="/articleIndex" >文章发布</router-link></li>
			<li><router-link  to="/productIndex" >作品发布</router-link></li>
			<!-- <li><router-link  to="/rating">评价</router-link></li> -->
			<!-- <li><router-link  to="/seller">商家</router-link></li> -->
 
		</ul>
		
            <!-- 路由匹配到的组件将显示在这里 -->
           <router-view></router-view>
	</div>
</template>
