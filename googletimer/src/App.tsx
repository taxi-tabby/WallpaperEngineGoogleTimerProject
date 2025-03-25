
import { useRef } from 'react';
import './App.css';
import DraggableWidget from './components/DraggableWidget';



function App() {

	const nodeRef = useRef<HTMLDivElement>(null!); 


	return (
		<>
			<div className='fixed inset-0 bg-black'>


				<div ref={nodeRef}>

				</div>

				<DraggableWidget />


			</div>
		</>
	);
}

export default App;
