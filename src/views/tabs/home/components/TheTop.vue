<script setup lang="ts">
import { ref } from 'vue'
import { emit } from 'process'
import type { ISearchRecomment } from '../../../../types'

interface IProps {
	recomments: ISearchRecomment[]
}
defineProps<IProps>()
interface IEmits {
	(e: 'searchClick'): void
}
const emits = defineEmits<IEmits>()
</script>

<template>
	<div class="home-top">
		<div class="top">
			<img class="location-icon" src="@/assets/imgs/index_page/region.png" />
			<div class="location">幸福小区 （北一区东南门）</div>
			<img class="cart-icon" src="@/assets/imgs/index_page/cart_empty.png" alt="" />
			<img class="message-icon" src="@/assets/imgs/index_page/message.png" alt="" />
		</div>
		<!--  
        <van-search
             shape="round"
             background="linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243))"
             placeholder="世界茶饮 35减2"
         >
              <template #action>
                  <div @click="onClickButton">搜索</div>
              </template>
        </van-search>
    -->
		<van-sticky>
			<OpSearch
				shape="round"
				background="linear-gradient(to right, rgb(53,200,250), rgb(31,175,243))"
				placeholder="世界茶饮 35减2"
				@inputClick="emits('searchClick')">
				<template #right-icon>
					<div @click="emits('searchClick')">搜索</div>
				</template>
			</OpSearch>
		</van-sticky>
		<div class="search-recommend">
			<div v-for="v in recomments" :key="v.value" class="tag">{{ v.label }}</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.home-top {
	background: linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243));
	color: white;
}
.top {
	display: flex;
	align-items: center;
	padding: 10px 10px 0 10px;
	line-height: 50px;
	font-size: 30px;
	font-weight: bold;
	.location-icon {
		width: 40px;
		height: 40px;
		filter: brightness(100);
	}
	.location {
		flex: 1;
	}
	.cart-icon {
		width: 40px;
		height: 40px;
		filter: brightness(100);
	}
	.message-icon {
		width: 40px;
		height: 40px;
		margin-left: 20px;
		filter: brightness(100);
	}
}
.search-recommend {
	display: flex;
	padding: 0 10px 8px;
	.tag {
		font-size: 20px;
		border-radius: 10px;
		background: rgb(242, 242, 242, 0.3);
		padding: 2px 8px;
		margin-right: 10px;
	}
}
</style>
<style lang="scss">
.home-top {
	.van-field__right-icon {
		margin-right: 0;
	}
}
</style>
