<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const route = useRoute()
const router = useRouter()

const active = ref(route.name as string)
watch(active, (nv) => {
	router.push({
		name: nv
	})
})
</script>

<template>
	<RouterView />
	<van-tabbar v-model="active">
		<van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
		<van-tabbar-item name="order" icon="bars">订单</van-tabbar-item>
		<van-tabbar-item name="me" icon="contact">我的</van-tabbar-item>
	</van-tabbar>
	<div>nihao</div>
</template>

<style scoped></style>
