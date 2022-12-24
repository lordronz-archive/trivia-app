import { SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { api } from "../services/api"
import { GetQuestionsResult } from "../services/api/api.types"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Question, QuestionModel, QuestionSnapshotIn } from "./Question"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.optional(types.array(QuestionModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveQuestions: (questionSnapshots: QuestionSnapshotIn[]) => {
      const questionModels: Question[] = questionSnapshots.map((c) => QuestionModel.create(c)) // create model instances from the plain objects
      self.questions.replace(questionModels) // Replace the existing data with the new data
    },
  }))
  .actions((self) => ({
    getQuestions: flow(function* () {
      const result: GetQuestionsResult = yield api.getQuestions()

      if (result.kind === "ok") {
        self.saveQuestions(result.questions)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
