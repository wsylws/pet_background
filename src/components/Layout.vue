<template>
  <div>
    <app-header></app-header>
    <app-main></app-main>
    <app-navbar></app-navbar>
  </div>
</template>

<script>
import AppHeader from './AppHeader'
import AppMain from './AppMain'
import AppNavbar from './AppNavbar'
export default {
  data () {
    return {
    }
  },

  components: {
    AppHeader,
    AppMain,
    AppNavbar
  },

  methods: {}
}
</script>

<style scoped>
.header{
    /* z-index: 1; */
    position: absolute;
    line-height: 50px;
    padding: 0px;
    top: 10px;
    left: 230px;
    right: 0px;
    background-color: rgba(0, 0, 0, 0);
}
.navbar{
    position: absolute;
    width: 230px;
    top: 0px;
    left: 0px;
    bottom: 0px;
    overflow-y: auto;
    background-color: rgb(48, 65, 86)
}
.main{
    position: absolute;
    top: 0px;
    left: 230px;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    overflow: auto;
}
/* 滚动条的宽度

    ::-webkit-scrollbar {
        width:9px;
        height:9px;
    } */

/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/

    /* ::-webkit-scrollbar-track {
        display: none;

    } */

/*滚动条的设置*/

    /* ::-webkit-scrollbar-thumb {
        background-color:#606d71;
        background-clip:padding-box;
        min-height:28px;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius:2em;
    } */
/*滚动条移上去的背景*/

    /* ::-webkit-scrollbar-thumb:hover {
         background-color:#fff;
    } */

</style>