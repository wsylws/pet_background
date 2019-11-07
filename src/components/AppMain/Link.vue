<template>
  <div>
    <el-breadcrumb v-if="$route.path!='/home'" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="line" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view></router-view>
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
.el-breadcrumb{
  height: 10px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.line{
  border-left: 3px solid #31c17b;
  padding-left: 10px;
}
</style>