import Canvas from './canvas'
import Element from '../static/element'
import { useState, useContext } from 'react'
import { CanvasContext } from '../static/canvas'

export function Aside() {
	const { elements, setElements, selectedElement, setSelectedElement } =
		useContext(CanvasContext)

	const handleOnClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		element: Element
	) => {
		e.preventDefault()
		if (selectedElement?.key === element.key) {
			setSelectedElement(null)
			return
		}
		setSelectedElement(element)
	}

	return (
		<aside className='bg-neutral-800 flex flex-col justify-between h-full w-60 p-2'>
			<div className=''></div>
			<div className='flex flex-col gap-2 bg-neutral-900/50'>
				<h2 className='text-center'>Capas</h2>
				<div className='flex flex-col gap-1 h-72 p-2 overflow-auto'>
					{[...elements]
						.sort((a, b) => b.options.zIndex - a.options.zIndex)
						.map(element => {
							return (
								<div
									onClick={e => handleOnClick(e, element)}
									key={element.key}
									style={{
										border: `2px solid ${
											selectedElement?.key === element.key
												? 'red'
												: 'transparent'
										}`,
									}}
									className='w-full p-2 h-10 cursor-pointer bg-neutral-700 flex items-center justify-between'>
									<span className='w-32 truncate'>{element.content}</span>
									<button
										onClick={() => {
											const newElements = elements.filter(
												e => e.key !== element.key
											)
											setElements(newElements)
										}}>
										X
									</button>
								</div>
							)
						})}
					{elements.length === 0 && (
						<div className='w-full p-2 h-full flex items-center justify-center'>
							No hay elementos
						</div>
					)}
				</div>
			</div>
		</aside>
	)
}

export function BottomBar() {
	const [asideElements] = useState<Element[]>([
		{
			id: 'element1',
			key: 'key1',
			className: 'border-container dashed thin truncate',
			content: 'Elemento 1',
			dragged: false,
			resized: false,
			options: { zIndex: 1, width: 80, height: 50 },
		},
		{
			id: 'element2',
			key: 'key2',
			className: 'bg-blue-500 truncate',
			content: 'Elemento 2',
			dragged: false,
			resized: false,
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
			options: {
				...element.options,
				zIndex: 1100,
				minWidth: element.options.width,
				minHeight: element.options.height,
			},
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
