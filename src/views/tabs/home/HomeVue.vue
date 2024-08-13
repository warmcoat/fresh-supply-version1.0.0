<script setup lang="ts">
import { Search } from 'vant'
import { ref } from 'vue'
import TheTop from './components/TheTop.vue'
import { useToggle } from '@/use/useToggle'
import SearchView from '@/views/search/SearchView.vue'
import { useAsync } from '@/use/useAsync'
import { fetchHomePageData } from '@/api/home'
import { ICountdown, IHomeInfo } from '@/types'
import OpLoadingView from '@/components/OpLoadingView.vue'
import TheTransformer from './components/TheTransformer.vue'
import ScrollBar from './components/ScrollBar.vue'
import CountDown from './components/CountDown.vue'
import { PRIMARY_COLOR, TRANSPARENT } from '@/config'
import { HOME_TABS } from '@/views/tabs/home/config'

const recomments = [
	{
		value: 1,
		label: '牛腩'
	},
	{
		value: 2,
		label: '色拉'
	}
]

const [isSearchViewShown, toggleSearchView] = useToggle(false)

const { data, pending } = useAsync(fetchHomePageData, {
	banner: [],
	searchRecomments: [],
	scrollBarInfoList: [],
	countdown: {} as ICountdown,
	activities: []
} as IHomeInfo)

const tabBackgroundColor = ref(TRANSPARENT)
const onTabScroll = ({ isFixed }: { isFixed: boolean }) => {
	tabBackgroundColor.value = isFixed ? 'white' : TRANSPARENT
}
</script>

<template>
	<div class="home-page">
		<Transition name="fade">
			<SearchView v-if="isSearchViewShown" @cancel="toggleSearchView"></SearchView>
		</Transition>
		<div v-show="!isSearchViewShown">
			<TheTop :recomments="recomments" @searchClick="toggleSearchView" />
			<OpLoadingView :loading="pending" type="skeleton">
				<div class="home-page__banner">
					<img v-for="v in data.banner" :key="v.imgUrl" :src="v.imgUrl" />
				</div>
				<TheTransformer :data="data.transformer" />
				<ScrollBar :data="data.scrollBarInfoList" />
				<div class="home-page__activity">
					<CountDown :data="data.countdown" />
					<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
						<van-swipe-item class="my-swipe-item" v-for="v in data.activities" :key="v">
							<img :src="v" alt="" />
						</van-swipe-item>
					</van-swipe>
				</div>
				<van-tabs
					sticky
					offset-top="37px"
					:color="PRIMARY_COLOR"
					:background="tabBackgroundColor"
					@scroll="onTabScroll">
					<van-tab v-for="v in HOME_TABS" :key="v.value" :title="v.title">
						<component :is="v.component"></component>
					</van-tab>
				</van-tabs>
			</OpLoadingView>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.home-page {
	background: var(--van-gray-1);
	padding-bottom: 5px;
	&__banner {
		img {
			width: 100%;
			padding-top: 15px;
			background: white;
		}
	}
	&__activity {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10px;

		.my-swipe {
			padding: 40px auto;
			background-color: #39a9ed;

			&-item {
				width: 200px;
				height: 270px;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
