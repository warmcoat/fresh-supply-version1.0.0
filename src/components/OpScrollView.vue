<script setup lang="ts">
import {ref,nextTick,onMounted,onUnmounted, watch } from 'vue';
import { createMScroll } from '@/utils/scroll/MScroll'
import type { MScrollConstructor}  from '@/utils/scroll/MScroll'


interface IPosition {
    x: number
    y: number
}
interface IProps {
    data: unknown[]
    scrollTo?: IPosition
}

enum EmitEnum {
    beforeScrollStart = 'beforeScrollStart',
    scrollStart = 'scrollStart',
    scroll = 'scroll',
    scrollEnd = 'scrollEnd',
}
interface IEmits {
    (e: EmitEnum, pos: IPosition): void
}
const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
    scrollTo: () => ({x: 0, y: 0}),
})

const emitEvents = Object.keys(EmitEnum) as EmitEnum[]
const emits = defineEmits<IEmits>()
const initScroll = (el: HTMLElement) => {
    if(!el) {
        return
    }
    const scroller = createMScroll(el)
    emitEvents.forEach((event) => {
        scroller.on(event, (pos)=> {
            emits(event, pos)
        })
    })
    return scroller
}
const scrollWrapperRef = ref()
let scroller: MScrollConstructor | undefined
onMounted(() => {
    watch(() => props.data, (nv) => {
            if (!nv || !nv.length) {
                return
            }
            nextTick(() => {
                scroller = initScroll(scrollWrapperRef.value)
                if(scroller) {
                    watch(() => props.scrollTo, (v) => {
                            scroller?.scrollTo(v.x, v.y)
                        }
                    )
                }
            })
        },
        {
            immediate: true,
        }
    )
})
onUnmounted(() => {
    scroller?.destroy()
})

</script>

<template>
   <div class="op-scroll-view">
    <div ref="scrollWrapperRef" class="op-scroll-view__wrapper">
        <div class="op-scroll-view__content">
            <slot></slot>
        </div>
    </div>
   </div>

</template>

<style lang="scss" scoped>
.op-scroll-view {
    height: 100%;
    &__wrapper {
        height: 100%;
    }
}

</style>