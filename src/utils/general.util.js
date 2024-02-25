const { randomUUID } = await import('node:crypto')

function getRandomUUID () {
  return randomUUID()
}

export default {
  getRandomUUID
}
