import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, FlatList, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Button, Screen, Text } from "../components"
import { colors, spacing } from "../theme"
import { Question, useStores } from "../models"
import { decode } from "html-entities"
import { RadioButton } from "react-native-paper"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Question: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Question" component={QuestionScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.huge,
  marginBottom: spacing.medium,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: colors.separator,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

// const ANSWER: TextStyle = {
//   fontSize: 12,
// }

// const ANSWER_WRAPPER: ViewStyle = {
//   paddingVertical: spacing.extraSmall,
// }

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.extraSmall,
  backgroundColor: colors.palette.angry500,
  marginTop: spacing.extraSmall,
}

interface QuestionScreenProps extends AppStackScreenProps<"Question"> {}

export const QuestionScreen: FC<QuestionScreenProps> = observer(function QuestionScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false)

  // Pull in one of our MST stores
  const { questionStore } = useStores()
  const { questions } = questionStore

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  const checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is: ${question.correctAnswer}`)
    }
  }

  const renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={decode(question.question)} />
        <RadioButton.Group
          onValueChange={(guess) => onPressAnswer(question, guess)}
          value={question.guess}
        >
          {question.allAnswers.map((v, i) => (
            <View key={`${v}-${i}`}>
              <Text>{v}</Text>
              <RadioButton value={v} />
            </View>
          ))}
        </RadioButton.Group>
        <Button style={CHECK_ANSWER} onPress={() => checkAnswer(question)} text={"Check Answer!"} />
      </View>
    )
  }

  // const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
  //   const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 14 } : {}
  //   return (
  //     <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
  //       <Text style={{ ...ANSWER, ...style }} text={decode(answer)} />
  //     </TouchableOpacity>
  //   )
  // }

  return (
    <Screen style={$root} preset="fixed">
      <View style={HEADER_CONTAINER}>
        <Text preset="heading" tx="questionScreen.header" />
      </View>
      <FlatList
        style={QUESTION_LIST}
        data={questionStore.questions}
        renderItem={renderQuestion}
        extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
        keyExtractor={(item) => item.id}
        onRefresh={fetchQuestions}
        refreshing={refreshing}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  backgroundColor: colors.background,
  paddingHorizontal: spacing.large,
}
