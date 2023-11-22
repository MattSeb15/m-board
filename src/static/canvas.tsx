import { createContext, useState } from 'react'
import Element from './element'
import { ReactNode } from 'react'

type CanvasStateType = {
	mouseOrigin: { x: number; y: number }
	setMouseOrigin: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
	zoom: number
	setZoom: React.Dispatch<React.SetStateAction<number>>
	elements: Element[]
	setElements: React.Dispatch<React.SetStateAction<Element[]>>
	selectedElement: Element | null
	setSelectedElement: React.Dispatch<React.SetStateAction<Element | null>>
}

export const CanvasContext = createContext<CanvasStateType>({
	mouseOrigin: { x: 0, y: 0 },
	setMouseOrigin: () => {},
	zoom: 1,
	setZoom: () => {},
	elements: [],
	setElements: () => {},
	selectedElement: null,
	setSelectedElement: () => {},
})

// Crea el proveedor de contexto
export const CanvasProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [elements, setElements] = useState<Element[]>([])
	const [selectedElement, setSelectedElement] = useState<Element | null>(null)
	const [zoom, setZoom] = useState<number>(1)
	const [mouseOrigin, setMouseOrigin] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	})
	return (
		<CanvasContext.Provider
			value={{
				mouseOrigin,
				setMouseOrigin,
				selectedElement,
				setSelectedElement,
				elements,
				setElements,
				zoom,
				setZoom,
			}}>
			{children}
		</CanvasContext.Provider>
	)
}
