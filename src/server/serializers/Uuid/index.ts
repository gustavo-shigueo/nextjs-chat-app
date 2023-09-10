import type { IUuidSerializer } from './IUuid'
import UuidSerializer from './Uuid'

const uuidSerializer: IUuidSerializer = new UuidSerializer()

export default uuidSerializer
export type { IUuidSerializer }
