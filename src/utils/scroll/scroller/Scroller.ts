import { EventEmitter, EventRegister } from '../shared-utils/event'
import type { Options } from '../Options'
import { createBehaviorOptions } from '../Options'
import Behavior from './Behavior'
import createAnimater, { IPoint } from '../animator'
import ActionsHanlder from '../base/ActionsHanlder'
import ScrollerActions from './Action'
import { ease } from '../shared-utils/ease'
import { isSamePoint, isUndef } from '../shared-utils/lang'

const MIN_SCROLL_DISTANCE = 1
export default class Scroller {
	hooks
	scrollBehaviorX
	scrollBehaviorY
	actionsHandler
	animater
	actions
	transitionEndRegister!: EventRegister
	constructor(
		public wrapper: HTMLElement,
		public content: HTMLElement,
		public options: Options
	) {
		this.hooks = new EventEmitter(['beforeScroll', 'scrollStart', 'scroll', 'end', 'scrollEnd'])
		const { left, right, top, bottom } = options.bounce as any
		this.scrollBehaviorX = new Behavior(
			wrapper,
			content,
			createBehaviorOptions(options, 'scrollX', [left, right], {
				size: 'width'
			})
		)

		this.scrollBehaviorY = new Behavior(
			wrapper,
			content,
			createBehaviorOptions(options, 'scrollY', [top, bottom], {
				size: 'height'
			})
		)
		this.actionsHandler = new ActionsHanlder(this.wrapper)
		this.animater = createAnimater(content)
		this.actions = new ScrollerActions(
			this.scrollBehaviorX,
			this.scrollBehaviorY,
			this.actionsHandler,
			this.animater,
			this.options
		)

		this.registerTransitionEnd()
		this.init()
	}

	private registerTransitionEnd() {
		this.transitionEndRegister = new EventRegister(this.content, [
			{
				name: 'transitionend',
				handler: this.transitionEnd.bind(this)
			}
		])
	}
	private transitionEnd(e: TouchEvent) {
		if (e.target !== this.content || !this.animater.pending) {
			return
		}
		this.animater.transitionTime()
		if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
			return
		}
		this.animater.setPending(false)
		this.hooks.emit(this.hooks.eventTypes.scrollEnd, this.getCurrentPos())
	}
	private init() {
		this.bindAnimater()
		this.bindActions()
	}

	private bindAnimater() {
		const hooks = this.animater.hooks
		hooks.on(hooks.eventTypes.translate, (pos: IPoint) => {
			this.updatePositions(pos)
		})
		hooks.on(hooks.eventTypes.move, (pos: IPoint) => {
			this.hooks.emit(this.hooks.eventTypes.scroll, pos)
		})
		hooks.on(hooks.eventTypes.end, (pos: IPoint) => {
			this.animater.setPending(false)
			this.hooks.emit(this.hooks.eventTypes.scrollEnd, pos)
		})
	}

	private bindActions() {
		const hooks = this.actions.hooks
		hooks.on(hooks.eventTypes.start, (pos: IPoint) => {
			this.hooks.emit(this.hooks.eventTypes.beforeScroll, pos)
		})
		hooks.on(hooks.eventTypes.scrollStart, (pos: IPoint) => {
			this.hooks.emit(this.hooks.eventTypes.scrollStart, pos)
		})
		hooks.on(hooks.eventTypes.scroll, (pos: IPoint) => {
			this.hooks.emit(this.hooks.eventTypes.scroll, pos)
		})
		hooks.on(hooks.eventTypes.end, (pos: IPoint) => {
			if (this.hooks.emit(this.hooks.eventTypes.end, pos)) {
				return
			}
			if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
				return true
			}
		})
		hooks.on(hooks.eventTypes.scrollEnd, (pos: IPoint, duration: number) => {
			if (this.momentum(pos, duration)) {
				return
			}
			if (this.actions.contentMoved) {
				this.hooks.emit(this.hooks.eventTypes.scrollEnd, pos)
			}
		})
	}
	private resetPosition(time = 0, easing = ease.bounce) {
		const { position: x, inBoundary: xInBoundary } = this.scrollBehaviorX.checkInBoundary()
		const { position: y, inBoundary: yInBoundary } = this.scrollBehaviorY.checkInBoundary()

		if (xInBoundary && yInBoundary) {
			return false
		}

		this.scrollTo(x, y, time, easing)
		return true
	}

	private momentum(pos: IPoint, duration: number) {
		const meta = {
			time: 0,
			easing: ease.swipe,
			newX: pos.x,
			newY: pos.y
		}
		const momentumX = this.scrollBehaviorX.end(duration)
		const momentumY = this.scrollBehaviorY.end(duration)

		meta.newX = isUndef(momentumX.destination) ? meta.newX : (momentumX.destination as number)
		meta.newY = isUndef(momentumY.destination) ? meta.newY : (momentumY.destination as number)
		meta.time = Math.max(momentumX.duration as number, momentumY.duration as number)

		if (meta.newX !== pos.x || meta.newY !== pos.y) {
			if (
				meta.newX > this.scrollBehaviorX.minScrollPos ||
				meta.newX < this.scrollBehaviorX.maxScrollPos ||
				meta.newY > this.scrollBehaviorY.minScrollPos ||
				meta.newY < this.scrollBehaviorY.maxScrollPos
			) {
				meta.easing = ease.swipeBounce
			}

			this.scrollTo(meta.newX, meta.newY, meta.time, meta.easing)
			return true
		}
	}
	scrollTo(x: number, y: number, time = 0, easing = ease.bounce) {
		const currentPos = this.getCurrentPos()
		const startPoint = {
			x: currentPos.x,
			y: currentPos.y
		}
		const endPoint = {
			x,
			y
		}
		if (isSamePoint(startPoint, endPoint)) {
			return
		}

		const deltaX = Math.abs(endPoint.x - startPoint.x)
		const deltaY = Math.abs(endPoint.y - startPoint.y)

		if (deltaX < MIN_SCROLL_DISTANCE && deltaY < MIN_SCROLL_DISTANCE) {
			time = 0
		}

		this.animater.move(endPoint, time, easing.style)
	}

	getCurrentPos() {
		return this.actions.getCurrentPos()
	}

	updatePositions(pos: IPoint) {
		this.scrollBehaviorX.updataPosition(pos.x)
		this.scrollBehaviorY.updataPosition(pos.y)
	}
	destroy() {
		this.hooks.destroy()
		this.actionsHandler.destroy()
		this.animater.destroy()
		this.actions.destroy()
		this.transitionEndRegister.destroy()
	}
}
