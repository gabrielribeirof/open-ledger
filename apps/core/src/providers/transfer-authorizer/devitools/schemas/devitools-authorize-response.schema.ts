import { z } from 'zod'

export const devitoolsAuthorizeResponseSchema = z.object({
	status: z.enum(['success', 'fail']),
	data: z.object({
		authorization: z.boolean(),
	}),
})

export type DevitoolsAuthorizeResponse = z.infer<typeof devitoolsAuthorizeResponseSchema>
