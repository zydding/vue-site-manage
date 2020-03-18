<template>
  <div :class="className">
    <template v-for="(navMenu) in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="!navMenu.children"
        :key="navMenu.url"
        :data="navMenu"
        :index="navMenu.url"
        style="font-align:left; height: 40px; line-height: 40px;"
      >
        <span :title="navMenu.name">{{navMenu.name}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="navMenu.children" :key="navMenu.url" :data="navMenu" :index="navMenu.url">
        <template slot="title">
            <i :class="navMenu.icon"></i>
            <span slot="title">{{navMenu.name}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.children"></NavMenu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: "NavMenu",
  props: {
    navMenus: Array,
    className: String,
  },
  data() {
    return {
    };
  },
};
</script>
