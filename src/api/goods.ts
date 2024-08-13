import axios from './base'
import type { IGood, IMenuList } from '../types/goods'


export const fetchGoodsListData = (shopId: string) => {
	return axios.get<IMenuList, IMenuList>('goods_list', {
		params: { shopId }
	})
}

export const fetchGoodsDetailData = (goodsId: number | string) => {
	return axios.get<IGood,IGood>('goods_detail', {
		params: { goodsId }
	})
 }