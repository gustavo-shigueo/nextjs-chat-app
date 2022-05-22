import { TExpirationDate } from 'interfaces/IToken'

export const timeUnits = {
	s: 1,
	m: 60,
	h: 3_600,
	d: 86_400,
}

export const getMaxAge = ([time, timeUnit]: TExpirationDate) => {
	return time * timeUnits[timeUnit]
}

export const getCurrentTimeStamp = (): number => {
	return Math.round(new Date().getTime() / 1000)
}

export const getExpirationTimestamp = (expiration: TExpirationDate): number => {
	const currentTimestamp = getCurrentTimeStamp()
	return currentTimestamp + getMaxAge(expiration)
}
