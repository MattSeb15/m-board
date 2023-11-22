import Canvas from './canvas'
import Element from '../static/element'
import { useState, useContext } from 'react'
import { CanvasContext } from '../static/canvas'
import { Icon } from '@iconify/react'

import {
	Button,
	ButtonGroup,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@nextui-org/react'

export function Aside() {
	const {
		elements,
		zoom,
		setZoom,
		setElements,
		selectedElement,
		setSelectedElement,
	} = useContext(CanvasContext)

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

	const handleOnClickZoomIn = () => {
		if (zoom >= 2) return
		setZoom(zoom + 0.1)
	}
	const handleOnClickZoomOut = () => {
		if (zoom <= 0.5) return
		setZoom(zoom - 0.1)
	}
	const handleOnClickZoomNormal = () => {
		if (zoom === 1) return
		setZoom(1)
	}

	const content = (
		<PopoverContent>
			<div>Confirmation</div>
			<div>Are you sure you want to continue with your action?</div>
			<div>
				<Button color='success'>Yes</Button>
				<Button color='danger'>No</Button>
			</div>
		</PopoverContent>
	)

	const handleOnClickVisible = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		element: Element
	) => {
		e.stopPropagation()
		element.layer!.visible = !element.layer!.visible
		setElements([...elements])
	}

	return (
		<aside className='bg-neutral-800 flex flex-col gap-2 justify-between family-kg h-full w-60 p-2'>
			<div className='flex flex-col items-center flex-[8] gap-2 p-2 bg-neutral-700'>
				<div className='bg-neutral-800 rounded-lg flex flex-col w-full p-2'>
					<span>Zoom</span>
					<div className='flex items-center justify-between'>
						<span className='bg-neutral-600  h-full px-2 flex items-center rounded-md '>
							{zoom.toFixed(2)}
						</span>
						<ButtonGroup
							isIconOnly={true}
							size='sm'
							color='primary'>
							<Button onClick={handleOnClickZoomIn}>
								<span className='text-5xl'>+</span>
							</Button>
							<Button onClick={handleOnClickZoomNormal}>
								<span className='text-1xl'>1.00</span>
							</Button>
							<Button onClick={handleOnClickZoomOut}>
								<span className='text-5xl'>-</span>
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</div>
			<div className='flex flex-col h-96 gap-2 bg-neutral-700'>
				<h2 className='text-center'>Capas</h2>
				<div className='flex flex-col gap-1 p-2 overflow-auto'>
					{[...elements]
						/* .sort((a, b) => b.options.zIndex - a.options.zIndex) */
						.map(element => {
							return (
								<div
									onClick={e => handleOnClick(e, element)}
									key={element.key}
									style={{
										border: `2px solid ${
											selectedElement?.key === element.key
												? 'white'
												: 'transparent'
										}`,
									}}
									className='w-full h-10 px-2 py-1 gap-1 rounded-lg cursor-pointer bg-neutral-800 flex items-center'>
									<button
										onClick={e => {
											handleOnClickVisible(e, element)
										}}
										className='p-1 h-6 w-10 bg-neutral-900 rounded-lg'>
										<Icon
											icon='pixelarticons:eye'
											style={{
												display: element.layer?.visible ? 'block' : 'none',
											}}
											className='h-4 w-auto mx-auto'
										/>
									</button>
									<div className='h-full w-14 border border-neutral-600'></div>
									<span className='w-full text-xs truncate'>
										{element.layer?.name ?? 'name'}
									</span>
									<Popover
										size='sm'
										key={element.key}
										placement='top'>
										<PopoverTrigger>
											<Button
												isIconOnly={true}
												color='primary'
												size='sm'
												className='capitalize text-white h-auto'>
												<Icon
													icon='pixelarticons:chevron-up'
													className='h-5 w-auto'
												/>
											</Button>
										</PopoverTrigger>
										{content}
									</Popover>
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
			className: 'border-container lined thin truncate',
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
							cursor: 'grab',
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
