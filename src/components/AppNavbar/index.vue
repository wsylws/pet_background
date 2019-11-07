<template>
  <div class="navbar">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#304155"
      text-color="#fff"
      active-text-color="#1890ff"
      router>
      <el-submenu index="/role">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>角色管理</span>
        </template>
        <el-menu-item index="/role/user-manage">
          <!-- <i class="el-icon-s-custom"></i> -->
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/role/admin-manage">
          <!-- <i class="el-icon-user"></i> -->
          <span slot="title">管理员管理</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/petAdopt-manage">
          <i class="iconfont">&#xe60a;</i>
          <span slot="title">宠物领养管理</span>
      </el-menu-item>
      <el-menu-item index="/petBreed-manage">
          <i class="iconfont">&#xe65b;</i>
          <span slot="title">宠物品种管理</span>
      </el-menu-item>
      <el-menu-item index="/bbs-manage">
          <i class="iconfont">&#xe615;</i>
          <span slot="title">论坛管理</span>
      </el-menu-item>
      <el-menu-item index="/show-manage">
          <i class="iconfont">&#xe6f6;</i>
          <span slot="title">宠物秀管理</span>
      </el-menu-item>
      <el-menu-item index="/carousel-manage">
          <i class="iconfont">&#xe627;</i>
          <span slot="title">轮播图管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  components: {},

  methods: {}
}
</script>

<style scoped>
.el-menu{
border-right: none;
}
</style>