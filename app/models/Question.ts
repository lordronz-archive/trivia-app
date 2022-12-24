import shuffle from "lodash.shuffle"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionModel = types
  .model("Question")
  .props({
    id: types.identifier,
    category: types.maybe(types.string),
    type: types.enumeration(["multiple", "boolean"]),
    difficulty: types.enumeration(["easy", "medium", "hard"]),
    question: types.maybe(types.string),
    correctAnswer: types.maybe(types.string),
    incorrectAnswers: types.optional(types.array(types.string), []),
    guess: types.maybe(types.string),
    shuffled: types.optional(types.boolean, false),
    answers: types.maybe(types.array(types.string)),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setAnswers(answers: string[]) {
      self.answers = answers as typeof self.answers
    },
  }))
  .actions((self) => ({
    setShuffled(shuffled: boolean) {
      self.shuffled = shuffled;
    },
  }))
  .views((self) => ({
    get allAnswers() {
      if (!self.shuffled) {
        self.setAnswers(shuffle(self.incorrectAnswers.concat([self.correctAnswer])))
        self.setShuffled(true);
      }
      return self.answers
    },
    get isCorrect() {
      return self.guess === self.correctAnswer
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setGuess(guess: string) {
      self.guess = guess
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
