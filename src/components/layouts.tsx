import Canvas from './canvas'
import Element from '../static/element'
import { useState } from 'react'

export function Aside() {
	return <aside className='bg-aside h-full w-60'></aside>
}

export function BottomBar() {
	const [asideElements] = useState<Element[]>([
		{
			id: 'element1',
			key: 'key1',
			className: 'bg-red-500 truncate cursor-move',
			content: 'Elemento 1',
			dragged: false,
			options: { zIndex: 1, width: 80, height: 20 },
		},
		{
			id: 'element2',
			key: 'key2',
			className: 'bg-blue-500 truncate cursor-move',
			content: 'Elemento 2',
			dragged: false,
			options: { zIndex: 1, width: 100, height: 40 },
		},
		// Agrega más elementos aquí
	])

	const handleDragStart = (e: React.DragEvent, element: Element) => {
		const rect = (e.target as HTMLElement).getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top
		console.log('offset', offsetX, offsetY)
		const elementWithOffset = {
			...element,
			options: { ...element.options, zIndex: 1100 },
			offset: { x: offsetX, y: offsetY },
		}
		e.dataTransfer.setData('element', JSON.stringify(elementWithOffset))
	}

	return (
		<nav className='flex h-40 bg-windows'>
			{asideElements.map(element => {
				return (
					<div
						key={element.key}
						className={element.className}
						style={{
							width: element.options.width,
							height: element.options.height,
							zIndex: element.options.zIndex,
						}}
						draggable
						onDragStart={e => handleDragStart(e, element)}>
						{element.content}
					</div>
				)
			})}
		</nav>
	)
}

export function Main() {
	return (
		<main className='flex flex-col flex-[6] overflow-hidden'>
			<Canvas />
			<BottomBar />
		</main>
	)
}
