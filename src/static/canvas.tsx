import { createContext, useState } from 'react'
import Element from './element'
import { ReactNode } from 'react'

type CanvasStateType = {
	zoom: number
	setZoom: React.Dispatch<React.SetStateAction<number>>
	elements: Element[]
	setElements: React.Dispatch<React.SetStateAction<Element[]>>
	selectedElement: Element | null
	setSelectedElement: React.Dispatch<React.SetStateAction<Element | null>>
}

export const CanvasContext = createContext<CanvasStateType>({
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
	return (
		<CanvasContext.Provider
			value={{
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
