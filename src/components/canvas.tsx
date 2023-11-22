import React, { useRef, useContext, useEffect } from 'react'
import Element from '../static/element'
import Grid from '../static/grid'
import { CanvasContext } from '../static/canvas'

const Canvas: React.FC = () => {
	const canvasRef = useRef<HTMLDivElement>(null)
	const {
		mouseOrigin,
		setMouseOrigin,
		elements,
		setElements,
		selectedElement,
		setSelectedElement,
		zoom,
		setZoom,
	} = useContext(CanvasContext)

	const handleCanvasDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const element: Element = JSON.parse(e.dataTransfer.getData('element'))
		const { offset } = element
		console.log('offset', offset)
		const rect = canvasRef.current?.getBoundingClientRect()
		console.log('zoom', zoom)
		const calculatedX = (e.clientX - rect!.left - offset!.x) / zoom /* - 8 */
		console.log('calculatedX', calculatedX)
		const calculatedY = (e.clientY - rect!.top - offset!.y) / zoom /* - 8 */
		console.log('calculatedY', calculatedY)
		if (element.dragged) {
			console.log('element exist update position')
			/* element.coordinates = { x: calculatedX, y: calculatedY } */
			//update element
			const updatedElement: Element = {
				...element,
				coordinates: { x: calculatedX, y: calculatedY },
			}

			// Encuentra el índice del elemento que quieres actualizar
			const index = elements.findIndex(el => el.key === element.key)

			// Crea un nuevo arreglo de elementos, donde el elemento que quieres actualizar se reemplaza con su versión actualizada
			setElements(prevElements =>
				prevElements.map((el, i) => (i === index ? updatedElement : el))
			)
			return
		}
		const elementKey = crypto.randomUUID()
		const zIndex = elements.length + 1
		const newElement: Element = {
			...element,
			key: elementKey,
			dragged: true,
			options: { ...element.options, zIndex, zIndexBorder: zIndex },
			coordinates: { x: calculatedX, y: calculatedY },
			layer: { name: `Capa ${elements.length + 1}`, visible: true },
			content: `${element.content}`,
		}
		setElements(prevElements => [newElement, ...prevElements])
		setSelectedElement(newElement)
	}

	const handleCanvasDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		const rect = canvasRef.current?.getBoundingClientRect()
		const x = e.clientX - rect!.left
		const y = e.clientY - rect!.top
		console.log(`X CANVAS: ${x}`, `Y CANVAS: ${y}`)

		console.log(`X CLIENT: ${e.clientX}`, `Y CLIENT: ${e.clientY}`)
	}

	const grid: Grid = {
		colors: { background: '#201f1e', pattern: '#133b57' },
		sizes: { background: 50, pattern: 1.5 },
	}

	const handleOnDobleClickCanvas = (e: React.MouseEvent) => {
		/* const condition = false */

		if (selectedElement === null) return

		if (e.target === canvasRef.current) {
			console.log('click on canvas')
			setSelectedElement(null)
		}
	}

	const handleClickElement = (e: React.MouseEvent, element: Element) => {
		e.preventDefault()
		e.stopPropagation()
		console.log('click element', element)
		if (selectedElement?.key === element.key) {
			return
		}

		//update element with new z-border-index
		const updatedElement: Element = {
			...element,
			options: { ...element.options, zIndexBorder: 99999 },
		}
		setElements(prevElements => {
			return prevElements.map(prevElement => {
				if (prevElement.key === element.key) {
					return updatedElement
				}
				return prevElement
			})
		})

		setSelectedElement(element)
	}

	/* const handleWheel = (e: React.WheelEvent) => {
		if (e.altKey) {
			const rect = canvasRef.current?.getBoundingClientRect()
			const x = e.clientX - rect!.left
			const y = e.clientY - rect!.top
			setMouseOrigin({ x, y })
			if (e.deltaY < 0) {
				setZoom(prevZoom => Math.min(prevZoom + 0.1, 2))
			} else {
				setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5))
			}
		}
	} */
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const handleWheel = (e: WheelEvent) => {
			if (e.altKey) {
				e.preventDefault()
				const rect = canvasRef.current?.getBoundingClientRect()
				const x = e.clientX - rect!.left
				const y = e.clientY - rect!.top
				setMouseOrigin({ x, y })
				if (e.deltaY < 0) {
					setZoom(prevZoom => Math.min(prevZoom + 0.05, 2))
				} else {
					setZoom(prevZoom => Math.max(prevZoom - 0.05, 0.5))
				}
			}
		}
		canvas.addEventListener(
			'wheel',
			e => {
				handleWheel(e)
			},
			{ passive: false }
		)
		return () => {
			canvas.removeEventListener('wheel', handleWheel)
		}
	}, [canvasRef, setMouseOrigin, setZoom])

	const calculateBorderSize = (width: number, height: number) => {
		const size = Math.sqrt(width * height)
		console.log('size', Math.max(1.5, size / 100))
		const result = Math.max(1.5, size / 100)
		if (result > 5) return 5
		return result
	}
	return (
		<div
			className='w-full h-full overflow-scroll
			
		'>
			<div
				onDoubleClick={e => handleOnDobleClickCanvas(e)}
				className='canvas relative w-[10000px] h-[10000px]'
				style={{
					backgroundImage: `linear-gradient(${grid.colors.pattern} ${grid.sizes.pattern}px, transparent ${grid.sizes.pattern}px), linear-gradient(to right, ${grid.colors.pattern} ${grid.sizes.pattern}px, transparent ${grid.sizes.pattern}px)`,
					backgroundSize: `${grid.sizes.background}px ${grid.sizes.background}px`,
					backgroundColor: `${grid.colors.background}`,
					transform: `scale(${zoom})`,
					transformOrigin: `${mouseOrigin.x}px ${mouseOrigin.y}px`,
					transition: 'transform 0.1s ease-in-out',
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
								left: element.coordinates!.x,
								top: element.coordinates!.y,
								display: element.layer!.visible ? 'block' : 'none',
							}}
							/* className={`p-2 border-2 border-transparent ${
								selectedElement?.key === element.key
									? 'border-2 border-dashed border-gray-500'
									: ''
							}`} */
						>
							<div
								onClick={e => {
									handleClickElement(e, element)
								}}
								style={{
									cursor:
										selectedElement?.key === element.key ? 'move' : 'pointer',
									position: 'relative',
									width: element.options.width,
									height: element.options.height,
									userSelect: 'none',
									zIndex: element.options.zIndex,
								}}>
								<div
									className={`${element.className} w-full h-full`}
									style={{
										borderWidth: `${calculateBorderSize(
											element.options.width,
											element.options.height
										)}px`,
									}}>
									{element.content}
								</div>
							</div>
							{selectedElement?.key === element.key && (
								<ResizedContainer element={element} />
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Canvas

const ResizedContainer: React.FC<{ element: Element }> = ({ element }) => {
	const { setElements, selectedElement } = useContext(CanvasContext)

	enum DirectionType {
		NW,
		NE,
		SW,
		SE,
	}

	const handleResize = (
		e: React.MouseEvent,
		direction: DirectionType,
		selectedElement: Element
	) => {
		// Evita que el evento se propague a otros manejadores de eventos
		e.stopPropagation()

		//evitar que se redimencione el elemento si ha llegado a minimos de altura y anchura

		const initialMouseX = e.clientX

		const initialWidth = selectedElement.options.width
		const initialHeight = selectedElement.options.height

		const initialX = selectedElement.coordinates!.x
		const initialY = selectedElement.coordinates!.y

		const aspectRatio = initialWidth / initialHeight

		// Maneja el evento de movimiento del mouse
		let newWidth: number, newHeight: number, newX: number, newY: number
		const handleMouseMove = (e: MouseEvent) => {
			// Calcula las nuevas dimensiones del elemento seleccionado según la dirección
			// en la que se esté redimensionando
			// implementar aspect ratio

			const newWidthWithMin = (n: number) =>
				Math.max(element.options.minWidth!, n)

			const newHeightWithMin = (n: number) =>
				Math.max(element.options.minHeight!, n)

			const isExceedingMinWidth =
				newWidth > element.options.minWidth! &&
				newHeight > element.options.minHeight!

			switch (direction) {
				case DirectionType.NW:
					newWidth = newWidthWithMin(initialWidth - (e.clientX - initialMouseX))
					newHeight = newHeightWithMin(newWidth / aspectRatio)
					if (isExceedingMinWidth) {
						newX = initialX + (e.clientX - initialMouseX)
						newY = initialY + (initialHeight - newHeight)
					} else {
						newX = initialX + (initialWidth - newWidth)
						newY = initialY + (initialHeight - newHeight)
					}
					break
				case DirectionType.NE:
					newWidth = newWidthWithMin(initialWidth + (e.clientX - initialMouseX))
					newHeight = newHeightWithMin(newWidth / aspectRatio)
					if (isExceedingMinWidth) {
						newX = initialX
						newY = initialY + (initialHeight - newHeight)
					} else {
						newX = initialX
						newY = initialY + (initialHeight - newHeight)
					}

					break
				case DirectionType.SW:
					newWidth = newWidthWithMin(initialWidth - (e.clientX - initialMouseX))
					newHeight = newHeightWithMin(newWidth / aspectRatio)
					if (isExceedingMinWidth) {
						newX = initialX + (e.clientX - initialMouseX)
						newY = initialY
					} else {
						newX = initialX + (initialWidth - newWidth)
						newY = initialY
					}
					break
				case DirectionType.SE:
					newWidth = newWidthWithMin(initialWidth + (e.clientX - initialMouseX))
					newHeight = newHeightWithMin(newWidth / aspectRatio)
					newX = initialX
					newY = initialY

					break
			}

			// Actualiza el elemento seleccionado con las nuevas dimensiones
			setElements(prevElements => {
				return prevElements.map(prevElement => {
					if (prevElement.key === selectedElement.key) {
						return {
							...prevElement,
							options: {
								...prevElement.options,
								width: newWidth,
								height: newHeight,
							},
							resized: true,
							coordinates: { x: newX, y: newY },
						}
					}
					return prevElement
				})
			})
		}

		// Maneja el evento de soltar el mouse
		const handleMouseUp = (e: MouseEvent) => {
			e.stopPropagation()

			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const getStyleWithDirection = (
		direction: DirectionType,
		pos: number = -5
	) => {
		switch (direction) {
			case DirectionType.NW:
				return {
					top: pos,
					left: pos,
					cursor: 'nwse-resize',
				}
			case DirectionType.NE:
				return {
					top: pos,
					right: pos,
					cursor: 'nesw-resize',
				}
			case DirectionType.SW:
				return {
					bottom: pos,
					left: pos,
					cursor: 'nesw-resize',
				}
			case DirectionType.SE:
				return {
					bottom: pos,
					right: pos,
					cursor: 'nwse-resize',
				}
		}
	}

	const listOfDirections = [
		DirectionType.NW,
		DirectionType.NE,
		DirectionType.SW,
		DirectionType.SE,
	]

	const handleDragStart = (e: React.DragEvent, element: Element) => {
		const rect = (e.target as HTMLElement).getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top
		console.log('offset', offsetX, offsetY)
		const elementWithOffset: Element = {
			...element,
			/* options: { ...element.options, zIndex: 1000 }, */
			offset: { x: offsetX, y: offsetY },
		}
		e.dataTransfer.setData('element', JSON.stringify(elementWithOffset))

		// Aumenta el z-index del elemento mientras se arrastra
	}
	/* const handleOnClick = (e: React.MouseEvent, element: Element) => {
		e.preventDefault()

		if (selectedElement?.key === element.key) {
			return
		}
		console.log('click', element)

		//update element with new z-border-index
		const updatedElement: Element = {
			...element,
			options: { ...element.options, zIndexBorder: 99999 },
		}
		setElements(prevElements => {
			return prevElements.map(prevElement => {
				if (prevElement.key === element.key) {
					return updatedElement
				}
				return prevElement
			})
		})

		setSelectedElement(element)
	} */

	return (
		<>
			{listOfDirections.map(direction => {
				return (
					<div
						key={`${direction}-${element.key}`}
						style={{
							position: 'absolute',
							width: '10px',
							height: '10px',
							backgroundColor: 'white',
							border: '1px solid gray',
							zIndex: (element.options.zIndexBorder || 0) + 1,
							...getStyleWithDirection(direction, -15),
						}}
						onMouseDown={e => {
							handleResize(e, direction, element)
						}}
					/>
				)
			})}
			<div
				className='absolute bg-white/10 border border-gray cursor-move'
				draggable={selectedElement?.key === element.key}
				onDragStart={e => handleDragStart(e, element)}
				style={{
					top: 0,
					left: 0,
					width: element.options.width,
					height: element.options.height,
					zIndex: element.options.zIndexBorder,
				}}
			/>
		</>
		/* <div
			style={{
				position: 'absolute',
				top: -5,
				left: -5,
				width: '10px',
				height: '10px',
				backgroundColor: 'white',
				border: '1px solid gray',
				cursor: 'nwse-resize',
				zIndex: element.options.zIndexBorder,
			}}
			onMouseDown={e => {
				handleResize(e, DirectionType.NW, element)
			}}
		/> */
	)
}
