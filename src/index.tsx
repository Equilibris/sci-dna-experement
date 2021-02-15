import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { useFBX } from '@react-three/drei'
import { models } from './config'
import Loading from "./loading";

for (let i of Object.values(models)) useFBX.preload(i)

ReactDOM.render(
	<React.StrictMode>
		<React.Suspense fallback={<Loading />}>
			<App />
		</React.Suspense>
	</React.StrictMode>,
	document.getElementById('root')
)
