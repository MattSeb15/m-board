import './App.css'
import { Aside, Main } from './components/layouts'
import { CanvasProvider } from './static/canvas'

function App() {
	return (
		<CanvasProvider>
			<section className='flex w-full h-full'>
				<Aside />
				<Main />
			</section>
		</CanvasProvider>
	)
}

export default App
