export default interface Element {
	key: string
	id: string
	className?: string
	dragged: boolean
	offset?: { x: number; y: number }
	coordinates?: { x: number; y: number }
	options: { zIndex: number; width: number; height: number }
	content: string
}
