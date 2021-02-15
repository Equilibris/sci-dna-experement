import React, { FC, useEffect, useRef, useState } from 'react'

import { Canvas, MeshProps, useFrame } from 'react-three-fiber'
import { Group, Mesh, Vector3 } from 'three'
import { models } from './config'
import { useFBX } from '@react-three/drei'
import Loading from './loading'

import './App.css'

type GenomeProps = MeshProps & {
	index: number
	scale?: Vector3
}

const createGenome: (modelSource: string, flip: boolean) => FC<GenomeProps> = (
	modelSource,
	flip
) => ({ index, scale = new Vector3(1, 1, 1), ...meshProps }) => {
	const mesh = useRef<Mesh>()
	const phosphate = useRef<Mesh>()
	const meshData = useFBX(modelSource)
	const phosphateData = useFBX(models.PHOSPHATE)

	const flipDirection = 2 * +flip - 1

	const increment = Math.PI / 16

	const baseZConstant = flipDirection * index * increment
	const baseRotationConstant = Math.PI / 2 + +flip * Math.PI
	useEffect(() => {
		if (mesh.current && phosphate.current) {
			mesh.current.rotation.y = baseRotationConstant
			mesh.current.rotation.z = baseZConstant

			phosphate.current.rotation.y = baseRotationConstant
			phosphate.current.rotation.z = baseZConstant

			mesh.current.visible = true
			phosphate.current.visible = true
		}
		return () => {}
	}, [])

	useFrame(() => {
		const directionConstant = 0.005 * flipDirection
		if (
			mesh.current &&
			mesh.current.rotation.y &&
			phosphate.current &&
			phosphate.current.rotation.y
		) {
			const now = Date.now() / 10

			mesh.current.rotation.z = now * 0.005 * flipDirection + baseZConstant
			phosphate.current.rotation.z = now * 0.005 * flipDirection + baseZConstant
		}
	})

	const activeScale = scale.multiplyScalar(0.3)

	return (
		<>
			<mesh
				{...meshData.children[0]}
				{...meshProps}
				ref={mesh}
				scale={activeScale}
				visible={false}
			/>
			<mesh
				{...phosphateData.children[0]}
				{...meshProps}
				ref={phosphate}
				scale={activeScale}
				visible={false}
			/>
		</>
	)
}
const createPair = (modelSource: string) => [
	createGenome(modelSource, false),
	createGenome(modelSource, true),
]

const [AT, TA] = createPair(models.AT)
const [CG, GC] = createPair(models.CG)
const [AU, UA] = createPair(models.AU)

const Genome = ({ base, ...props }: GenomeProps & { base: string }) => {
	const isRareBase = useRef(Math.random() > 0.999)
	switch (base) {
		case 'A':
			return isRareBase.current ? <AU {...props} /> : <AT {...props} />
		case 'T':
			return isRareBase.current ? <UA {...props} /> : <TA {...props} />

		case 'C':
			return <CG {...props} />
		case 'G':
			return <GC {...props} />

		case 'U':
			return <UA {...props} />

		default:
			return <></>
	}
}

const ScrollController: FC<{
	translationGroup: React.MutableRefObject<Group | undefined>
	scrollState: React.MutableRefObject<number>
	viewEntry: number
	setViewEntry: React.Dispatch<React.SetStateAction<number>>
	loadLength: number
}> = ({
	scrollState,
	translationGroup,
	viewEntry,
	setViewEntry,
	loadLength,
}) => {
	// const location = useRef<number>(0)

	useFrame(() => {
		const delta = Math.floor(scrollState.current / loadLength)

		if (delta !== viewEntry) setViewEntry(delta)

		if (translationGroup.current) {
			// console.log(scrollState.current, location.current)

			// if (Math.abs(scrollState.current - location.current))
			// 	location.current =
			// 		location.current + (location.current - scrollState.current) / 100
			// else location.current = scrollState.current

			// if (delta) location.current += 0.1

			// translationGroup.current.position.x = location.current

			translationGroup.current.position.x = scrollState.current * -1
		}
	})

	return <></>
}

function App() {
	const onScreenCount = 100
	const loadLength = 30
	const translationGroupRef = useRef<Group>()
	const scrollRef = useRef<number>(0)

	const [viewEntry, setViewEntry] = useState(0)

	const [genome, setGenome] = useState('')

	useEffect(() => {
		fetch(process.env.PUBLIC_URL + '/data').then((x) =>
			x.text().then((data) => setGenome(' '.repeat(onScreenCount / 2) + data))
		)
	}, [])

	// useEffect(() => {
	// 	if (translationGroupRef.current) {
	// 		translationGroupRef.current.position.x = scrollValue * 1
	// 	}
	// }, [scrollValue])

	console.log(Math.max(loadLength * (viewEntry - 1), 0))

	return genome ? (
		<div className='container'>
			<Canvas
				onWheel={(ev) => {
					const increment = scrollRef.current + ev.deltaY * 0.01
					if (increment > 0) scrollRef.current = increment
				}}>
				<ambientLight intensity={0.4} />
				<pointLight position={[10, 10, 10]} />
				<ScrollController
					loadLength={loadLength}
					viewEntry={viewEntry}
					setViewEntry={setViewEntry}
					scrollState={scrollRef}
					translationGroup={translationGroupRef}
				/>
				<group ref={translationGroupRef}>
					{genome
						.split('')
						.slice(
							0,
							// 0,
							// Math.max(loadLength * (viewEntry + 1), 0)
							onScreenCount * (viewEntry + 1)
							// Math.max(increment, 0) + onScreenCount
						)
						.map((base, i) => (
							<Genome
								key={i /* + increment */}
								base={base}
								index={i}
								position={
									new Vector3(i - onScreenCount / 2 /*+ increment */, 0, 0)
								}
							/>
						))}
				</group>
			</Canvas>
		</div>
	) : (
		<Loading />
	)
}

export default App
