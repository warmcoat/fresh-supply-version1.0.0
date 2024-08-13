<script setup lang="ts">
import { ICountdown } from '@/types'
import { useCountDown } from '@/use/useCountDown'

interface IProps {
	data: ICountdown
}
const props = defineProps<IProps>()

const countDown = useCountDown({
	time: props.data.time
})
countDown.start()
const { current } = countDown

const padStart = (num: number) => {
	return num.toString().padStart(2, '0')
}
</script>

<template>
	<div class="home-count-down">
		<div class="home-count-down__info">
			<img class="logo" src="@/assets/imgs/index_page/count-down.png" />
			<span class="number">{{ padStart(current.hours) }}</span>
			<span class="colon">:</span>
			<span class="number">{{ padStart(current.minutes) }}</span>
			<span class="colon">:</span>
			<span class="number">{{ padStart(current.seconds) }}</span>
		</div>
		<div class="home-count-down__goods">
			<img class="goods-img" :src="data.goods.imgUrl" />
			<div class="goods-name op-ellipsis">{{ data.goods.name }}</div>
			<div class="goods-price">
				<span class="goods-price__now">￥{{ data.goods.price }}</span>
				<span class="goods-price__old">￥{{ data.goods.oldPrice }}</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.home-count-down {
	border-radius: 8px;
	width: 350px;
	height: 270px;
	background: linear-gradient(to bottom, rgb(252, 202, 202), white, white, white);
	padding: 15px 20px;
	box-sizing: border-box;
	justify-content: flex-end;

	&__info {
		display: flex;
		align-items: center;
		padding: 10px 10px;
		height: 30px;
		.logo {
			width: 170px;
			margin-right: 8px;
		}
		.number {
			font-size: 20px;
			background: rgb(252, 78, 78);
			color: white;
			padding: 4px;
			border-radius: 2px;
			width: 26px;
			font-weight: bold;
		}
		.colon {
			margin: 0 4px;
			color: red;
		}
	}

	&__goods {
		font-size: 20px;
		margin-top: 8px;
		width: 270px;
		.goods-img {
			width: 300px;
			height: 120px;
			margin-bottom: 4px;
		}
		.goods-price {
			align-items: baseline;
			&__now {
				font-size: 24px;
				color: red;
				margin-right: 4px;
				span {
					font-weight: bold;
					font-size: 16px;
				}
			}
			&__old {
				font-size: 20px;
				text-decoration: line-through;
			}
		}
	}
}
</style>
