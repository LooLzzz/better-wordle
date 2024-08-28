import answerList from '@/assets/answerlist.json'
import wordList from '@/assets/wordlist.json'

const wordsSet = new Set<string>(wordList)
const answersSet = new Set<string>(answerList)

export {
  answersSet,
  wordsSet
}
