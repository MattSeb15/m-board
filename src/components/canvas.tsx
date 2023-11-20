import React, { useRef, useContext } from 'react'
import Element from '../static/element'
import Grid from '../static/grid'
import { CanvasContext } from '../static/canvas'

const Canvas: React.FC = () => {
	const canvasRef = useRef<HTMLDivElement>(null)
	const { elements, setElements } = useContext(CanvasContext)

	const handleCanvasDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const element: Element = JSON.parse(e.dataTransfer.getData('element'))
		const { key, offset } = element
		console.log('offset', offset)
		const rect = canvasRef.current?.getBoundingClientRect()
		const calculatedX = e.clientX - rect!.left - offset!.x
		const calculatedY = e.clientY - rect!.top - offset!.y
		if (element.dragged) {
			console.log('element exist update position')
			element.coordinates = { x: calculatedX, y: calculatedY }
			return setElements(prevElements => [
				...prevElements.filter(elem => elem.key !== key),
				element,
			])
		}
		console.log('COPIANDO ELEMENTO', element)
		const elementKey = crypto.randomUUID()
		const newElement: Element = {
			...element,
			key: elementKey,
			dragged: true,
			options: { ...element.options, zIndex: 1 },
			coordinates: { x: calculatedX, y: calculatedY },
			content: `${elementKey}`,
		}
		setElements(prevElements => [...prevElements, newElement])
	}
	const handleCanvasDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		const rect = canvasRef.current?.getBoundingClientRect()
		const x = e.clientX - rect!.left
		const y = e.clientY - rect!.top
		console.log(`X CANVAS: ${x}`, `Y CANVAS: ${y}`)

		console.log(`X CLIENT: ${e.clientX}`, `Y CLIENT: ${e.clientY}`)
	}

	const handleDragStart = (e: React.DragEvent, element: Element) => {
		const rect = (e.target as HTMLElement).getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top
		console.log('offset', offsetX, offsetY)
		const elementWithOffset: Element = {
			...element,
			options: { ...element.options, zIndex: 1000 },
			offset: { x: offsetX, y: offsetY },
		}
		e.dataTransfer.setData('element', JSON.stringify(elementWithOffset))

		// Aumenta el z-index del elemento mientras se arrastra
	}
	const grid: Grid = {
		colors: { background: '#201f1e', pattern: '#133b57' },
		sizes: { background: 50, pattern: 1.5 },
	}
	return (
		<div className='w-full h-full overflow-scroll'>
			<div
				className='canvas relative w-[10000px] h-[10000px]'
				style={{
					backgroundImage: `linear-gradient(${grid.colors.pattern} ${grid.sizes.pattern}px, transparent ${grid.sizes.pattern}px), linear-gradient(to right, ${grid.colors.pattern} ${grid.sizes.pattern}px, transparent ${grid.sizes.pattern}px)`,
					backgroundSize: `${grid.sizes.background}px ${grid.sizes.background}px`,
					backgroundColor: `${grid.colors.background}`,
				}}
				ref={canvasRef}
				onDrop={handleCanvasDrop}
				onDragOver={e => handleCanvasDragOver(e)}>
				{elements.map(element => {
					return (
						<div
							key={element.key}
							style={{
								position: 'absolute',
								width: element.options.width,
								height: element.options.height,
								left: element.coordinates!.x,
								top: element.coordinates!.y,
								zIndex: element.options.zIndex,
							}}
							className={element.className}
							draggable
							onDragStart={e => handleDragStart(e, element)}>
							{element.content}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Canvas
