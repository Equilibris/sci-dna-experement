import { Vector3 } from 'three'

export const axis = new Vector3(1, 0, 0)
export const twist = 0.5

const suffix = '.fbx'
const prefix = process.env.PUBLIC_URL + '/models/'

export const models = {
	AT: `${prefix}AT-base${suffix}`,
	AU: `${prefix}AU-base${suffix}`,
	CG: `${prefix}CG-base${suffix}`,
	PHOSPHATE: `${prefix}phosphate${suffix}`,

	A: `${prefix}A-base${suffix}`,
	T: `${prefix}T-base${suffix}`,
	U: `${prefix}U-base${suffix}`,

	C: `${prefix}C-base${suffix}`,
	G: `${prefix}G-base${suffix}`,
}
