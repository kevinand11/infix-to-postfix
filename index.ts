enum Chars {
	num = "num",
	op = "op"
}

type CharsList = {
	type: Chars.num
	value: string
} | {
	type: Chars.op
	value: string
} | CharsList[]

const nums = '0123456789'
const ops = '+-*/^'

const infix = (input: string) => {
	const charsList: CharsList[] = []
	let brackCount = 0
	let lastType: Chars | null = null

	for (const char of input) {
		const ref = getReferenceDepth(charsList, brackCount)
		if (ops.includes(char)) {
			ref.push({ type: Chars.op, value: char })
			lastType = Chars.op
		}
		if (nums.includes(char)) {
			if (lastType === Chars.num) {
				const last = ref.at(-1)! as { type: Chars.num, value: string }
				last.value = last.value + char
			} else ref.push({ type: Chars.num, value: char })
			lastType = Chars.num
		}
		if (char === '(') {
			brackCount++
			ref.push([])
			lastType = null
		} else if (char === ')') {
			brackCount--
			lastType = null
		}
	}

	return resolveCharList(charsList)
}

const getReferenceDepth = (ref: CharsList[], depth: number) => {
	let r = ref
	new Array(depth).fill(0).forEach(() => {
		if (Array.isArray(r)) r = r[r.length - 1] as any
	})
	return r as CharsList[]
}

const resolveCharList = (list: CharsList[]): number => {
	if (list.length === 0) return 0

	let res = 0

	const ops = list.reduce((acc, cur) => {
		if (!Array.isArray(cur) && cur.type === Chars.op) acc.push([cur.value] as any)
		else {
			const val = Array.isArray(cur) ? resolveCharList(cur) : Number(cur.value)
			if (!acc.at(-1)) acc.push(['start'] as any)
			acc.at(-1)?.push(val)
		}

		return acc
	}, [] as [string, number][])

	for (const set of ops) {
		res = operate(res, set[1], set[0])
	}

	return res
}

const operate = (num1: number, num2: number, op: string) => {
	if (op === '+') return num1 + num2
	if (op === '-') return num1 - num2
	if (op === '*') return num1 * num2
	if (op === '/') return num1 / num2
	if (op === '^') return num1 ** num2
	if (op === 'start') return num2
	return num1
}

const input = '2*5+(4*5/(9/3))+10'

console.log(infix(input))