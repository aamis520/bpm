<style scoped>

.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.layout-breadcrumb {
    padding: 10px 15px 0;
}

.layout-content {
    min-height: 600px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 20px 10px;
}

.layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}

.layout-menu-left {
    background: #464c5b;
    /*min-width: 100px;*/
}

.layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    line-height: 30px;
    color: white;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.layout-hide-text .layout-text {
    display: none;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

</style>

<template>

<div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
        <i-Col :span="spanLeft" class="layout-menu-left" key="1">
            <i-Menu :active-name="setActive" theme="dark" width="auto" @on-select="routeTo">
                <div class="layout-logo-left">
                    <h3>界面生成引擎</h3>
                </div>
                <Menu-item name="flow">
                    <Icon type="document" :size="iconSize"></Icon>
                    <span class="layout-text">流程引擎</span>
                </Menu-item>

                    <Menu-item name="yanglftest">
                        <Icon type="document" :size="iconSize"></Icon>
                        <span class="layout-text">杨连峰测试项</span>
                    </Menu-item>
                    <Menu-item name="keywordgenerate">
                      <Icon type="document" :size="iconSize"></Icon>
                      <span class="layout-text">关键字设置</span>
                    </Menu-item>
                    <Menu-item name="listallcks">
                      <Icon type="document" :size="iconSize"></Icon>
                      <span class="layout-text">列出所有术语</span>
                    </Menu-item>

              <Menu-item name="messageList">
                <Icon type="document" :size="iconSize"></Icon>
                <span class="layout-text">消息列表</span>
              </Menu-item>
              <Menu-item name="messageCard">
                <Icon type="document" :size="iconSize"></Icon>
                <span class="layout-text">消息卡片</span>
              </Menu-item>
              <!--<Menu-item name="personselectdialog">
                <Icon type="document" :size="iconSize"></Icon>
                <span class="layout-text">选择人员</span>
              </Menu-item>-->
            </i-Menu>
        </i-Col>
        <i-Col :span="spanRight" key="2">
            <div class="layout-header">
                <i-button type="text" @click.native="toggleClick">
                    <Icon type="navicon" size="32"></Icon>
                </i-button>
            </div>
            <div class="layout-content">
                <div class="layout-content-main">
                    <transition mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
        </i-Col>
    </Row>
</div>

</template>

<script>

export default {
    data() {
            return {
                spanLeft: 5,
                spanRight: 19,
            }
        },
        computed: {
            iconSize() {
                return this.spanLeft === 5 ? 14 : 24;
            },
            setActive() {
              return this.$route.path.replace('/','');
            }
        },
        methods: {
            toggleClick() {
                    if (this.spanLeft === 5) {
                        this.spanLeft = 2;
                        this.spanRight = 22;
                    } else {
                        this.spanLeft = 5;
                        this.spanRight = 19;
                    }
                },
                routeTo(e) {
                    this.$router.push(e);

                }
        }
}

</script>
