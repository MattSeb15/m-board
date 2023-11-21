export default interface Element {
	key: string
	id: string
	className?: string
	dragged: boolean
	resized?: boolean
	offset?: { x: number; y: number }
	coordinates?: { x: number; y: number }
	options: {
		zIndexBorder?: number
		zIndex: number
		minWidth?: number
		minHeight?: number
		width: number
		height: number
	}
	content: string
}

enum MediaElements {
	image,
	video,
	mapBox,
	icon,
	audio,
}

enum TableElements {
	simple,
}

enum ListElements {
	simple,
	numbered,
	ordered,
}

enum ButtonElements {
	simple,
	icon,
	text,
	iconText,
	dropdown,
}

enum InputElements {
	color,
	date,
	time,
	file,
	text,
	password,
	checkbox,
	radio,
	switch,
	select,
	slider,
	range,
	number,
	email,
	phone,
	search,
	textarea,
}

enum LayoutElements {
	simple,
	scroll,
}

enum ContainerElements {
	card,
}

enum TextElements {
	title,
	subtitle,
	paragraph,
	link,
	code,
}

enum UserElements {
	large,
	name,
	email,
	onlyAvatar,
}

export const ElementTypes = [
	{ name: 'Layout', elements: LayoutElements, description: 'Layout elements' },
	{ name: 'Texts', elements: TextElements, description: 'Text elements' },
	{ name: 'Buttons', elements: ButtonElements, description: 'Button elements' },
	{ name: 'Inputs', elements: InputElements, description: 'Input elements' },
	{
		name: 'Containers',
		elements: ContainerElements,
		description: 'Container elements',
	},
	{ name: 'Users', elements: UserElements, description: 'User elements' },
	{ name: 'Media', elements: MediaElements, description: 'Media elements' },
	{ name: 'Tables', elements: TableElements, description: 'Table elements' },
	{ name: 'Lists', elements: ListElements, description: 'List elements' },
]
