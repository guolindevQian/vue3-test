<template>
    <div>
        <el-container>
            <el-header>

            </el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup lang="ts"></script>
<style lang="less" scoped></style>