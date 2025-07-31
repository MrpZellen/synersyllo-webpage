import type { InferSchemaType } from 'mongoose'
import Group from '~/models/Group'

export type GroupType = InferSchemaType<typeof Group.schema>