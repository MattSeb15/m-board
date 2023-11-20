import { createContext, useState } from 'react'
import Element from './element'
import { ReactNode } from 'react'

type CanvasStateType = {
	elements: Element[]
	setElements: React.Dispatch<React.SetStateAction<Element[]>>
}

export const CanvasContext = createContext<CanvasStateType>({
	elements: [],
	setElements: () => {},
})

// Crea el proveedor de contexto
export const CanvasProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [elements, setElements] = useState<Element[]>([])

	return (
		<CanvasContext.Provider value={{ elements, setElements }}>
			{children}
		</CanvasContext.Provider>
	)
}
