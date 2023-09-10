import { type SignalData } from 'simple-peer'
import { z } from 'zod'

const MediaStreamSchema: z.ZodType<MediaStream> = z.any()

const RTCRtpTransceiverDirectionSchema: z.ZodType<RTCRtpTransceiverDirection> =
	z.enum(['stopped', 'inactive', 'recvonly', 'sendonly', 'sendrecv'])

const RTCPriorityTypeSchema: z.ZodType<RTCPriorityType> = z.enum([
	'high',
	'low',
	'medium',
	'very-low',
])

const RTCRtpTransceiverInitSchema: z.ZodType<RTCRtpTransceiverInit> = z.object({
	direction: RTCRtpTransceiverDirectionSchema,
	sendEncodings: z
		.array(
			z.object({
				rid: z.string().optional(),
				active: z.boolean().optional(),
				maxBitrate: z.number().optional(),
				maxFramerate: z.number().optional(),
				networkPriority: RTCPriorityTypeSchema.optional(),
				priority: RTCPriorityTypeSchema.optional(),
				scaleResolutionDownBy: z.number().optional(),
			})
		)
		.optional(),
	streams: z.array(MediaStreamSchema).optional(),
})

export const signalDataSchema: z.ZodType<
	SignalData | { type: 'candidate'; candidate: RTCIceCandidateInit }
> = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('transceiverRequest'),
		transceiverRequest: z.object({
			kind: z.string(),
			init: RTCRtpTransceiverInitSchema.optional(),
		}),
	}),
	z.object({
		type: z.literal('renegotiate'),
		renegotiate: z.literal(true),
	}),
	z.object({
		type: z.literal('candidate'),
		candidate: z.object({
			candidate: z.string().optional(),
			sdpMLineIndex: z.number().nullable().optional(),
			sdpMid: z.string().nullable().optional(),
			usernameFragment: z.string().nullable().optional(),
		}),
	}),
	z.object({
		type: z.enum(['answer', 'offer', 'pranswer', 'rollback']),
		sdp: z.string().optional(),
	}),
])

export type SignalSchema = z.infer<typeof signalDataSchema>
