MScroll
Options: 用于处理和生成默认配置
Scroller: 用于处理滚动的逻辑
Animater:
Transition: 用于实现元素移动
move（endPoint, time, easingFn）： 设置目标位置，transition,translate等信息，开始移动元素，期间触发各种 hooks 事件
setPending(pending): 设置是否移动中，pending 为 true 则移动中
transitionTime(time) : 设置 transitionDuration 时间
translate(point): 设置目标位置
daStop(): 停止移动
