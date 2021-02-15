import { Vector3 } from 'three'

export const axis = new Vector3(1, 0, 0)
export const twist = 0.5
export const models = {
	AT: process.env.PUBLIC_URL + '/models/AT-base.fbx',
	AU: process.env.PUBLIC_URL + '/models/AU-base.fbx',
	CG: process.env.PUBLIC_URL + '/models/CG-base.fbx',
	PHOSPHATE: process.env.PUBLIC_URL + '/models/phosphate.fbx'
}
