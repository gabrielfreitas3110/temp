import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Quiz = () => {
  const navigation = useNavigation<any>();
  const { title } = useLocalSearchParams<{ title?: string }>();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [verified, setVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      image: require("../assets/images/question-1.png"),
      options: [
        "O alumínio é oxidante, porque é oxidado;",
        "O alumínio é o redutor, porque é oxidado;",
        "A prata do nitrato de prata é o oxidante, porque ela é oxidada;",
        "A prata do nitrato de prata é o redutor, porque ela é reduzida;",
        "O alumínio e a prata do nitrato de prata são redutores, porque eles são oxidados.",
      ],
      correctIndex: 1,
      heightFactor: 0.4,
      sound: `questão 1 (UFU-MG) Entende-se por corrosão de um material a sua deterioração ou destruição, causada por uma reação química com o meio no qual se encontra.  Essas reações são de oxidação e redução.  Na reação química de oxidação e redução, representada pela equação: Al + 3 AgNO Al(NO) + 3Ag a) o alumínio é oxidante, porque é oxidado; b) o alumínio é o redutor, porque é oxidado; c) a prata do nitrato de prata é o oxidante, porque ela é oxidada; d) a prata do nitrato de prata é o redutor, porque ela é reduzida; e) o alumínio e a prata do nitrato de prata são redutores, porque eles são oxidados. ${
        !verified ? "verificar" : "proxima"
      }`,
    },
    {
      image: require("../assets/images/question-2.png"),
      options: [
        "0,80 L de hidrogênio;",
        "0,45 L de hidrogênio;",
        "0,50 L de hidrogênio;",
        "0,70 L de hidrogênio;",
        "0,60 L de hidrogênio.",
      ],
      correctIndex: 2,
      heightFactor: 0.4,
      sound: `questão 2  (PERUZZO; CANTO, 2007, p. 431) Na eletrólise da água, qual o volume de hidrogênio, a 30°C e 1 atm, produzido por uma corrente de 1,0 A durante 3.860 s? (Volume molar de gás a 30°C e 1 atm = 25 L). a) 0,80 L de hidrogênio; b) 0,45 L de hidrogênio; c) 0,50 L de hidrogênio; d) 0,70 L de hidrogênio; e) 0,60 L de hidrogênio. ${
        !verified ? "verificar" : "proxima"
      }`,
    },
    {
      image: require("../assets/images/question-3.png"),
      options: [
        "nos fios, elétrons se movem da direita para a esquerda; e, na ponte salina, cátions K  se movem da direita para a esquerda e ânions Cl , da esquerda para a direita.",
        "nos fios, elétrons se movem da direita para a esquerda; e, na ponte salina, elétrons se movem da esquerda para a direita.",
        "nos fios, elétrons se movem da esquerda para a direita; e, na ponte salina, cátions K  se movem da esquerda para a direita e ânions Cl , da direita para a esquerda.",
        "nos fios, elétrons se movem da esquerda para a direita; e, na ponte salina, elétrons se movem da direita para a esquerda.",
      ],
      correctIndex: 2,
      heightFactor: 1,
      sound: `Questão 3 (Agrupamento de Escolas Anselmo de Andrade) Na figura, está representada a montagem de uma pilha eletroquímica, que contém duas lâminas metálicas – uma de zinco e uma de cobre – mergulhadas em soluções de seus respectivos sulfatos. A montagem inclui um longo chumaço de algodão, embebido numa solução saturada de cloreto de potássio, mergulhado nos dois béqueres. As lâminas estão unidas por fios de cobre que se conectam a um medidor de corrente elétrica. Fio de cobre Lâmina de zinco V Medidor de corrente + + K Cl (aq) (aq) Fio de cobre Ponte salina KCl (aq) Chumaço de algodão com KCl 4 (aq) ZnSO CuSO 4 (aq) (aq) Lâmina de cobre Quando a pilha está em funcionamento, o medidor indica a passagem de uma corrente e pode-se observar que: • a lâmina de zinco metálico sofre desgaste; • a cor da solução de sulfato de cobre (II) se torna mais clara; • um depósito de cobre metálico se forma sobre a lâmina de cobre. Considerando-se essas informações, é CORRETO afirmar que, quando a pilha está em funcionamento, +-- + a) nos fios, elétrons se movem da direita para a esquerda; e, na ponte salina, cátions K se movem da direita para a esquerda e ânions Cl, da esquerda para a direita. b) nos fios, elétrons se movem da direita para a esquerda; e, na ponte salina, elétrons se movem da esquerda para a direita. c) nos fios, elétrons se movem da esquerda para a direita; e, na ponte salina, cátions K se movem da esquerda para a direita e ânions Cl , da direita para a esquerda. d) nos fios, elétrons se movem da esquerda para a direita; e, na ponte salina, elétrons se movem da direita para a esquerda. ${
        !verified ? "verificar" : "proxima"
      }`,
    },
  ];
  const letterLabels = ["a", "b", "c", "d", "e"];

  const currentQuestion = questions[current];
  const isCorrect = selected === currentQuestion.correctIndex;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechController = useMemo(
    () => ({
      start: (text: string, onDone: () => void) => {
        Speech.stop();
        Speech.speak(text, {
          language: "pt-BR",
          pitch: 1.0,
          rate: 1.0,
          onDone: onDone,
          onStopped: onDone,
          onError: onDone,
        });
      },
      stop: () => Speech.stop(),
    }),
    []
  );

  const handleVerify = async () => {
    if (selected === null || verified) return;

    if (isCorrect) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/videos/success.mp4")
      );
      await sound.playAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/videos/error.mp4")
      );
      await sound.playAsync();
    }

    setVerified(true);
    if (isCorrect) setScore(score + 1);
  };

  const handleNext = async () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setVerified(false);
    } else {
      setShowResult(true);
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/videos/score.mp4")
      );
      await sound.playAsync();
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setVerified(false);
    setScore(0);
    setShowResult(false);
  };

  const getOptionStyle = (index: number) => {
    if (!verified) {
      return selected === index
        ? [styles.option, styles.selected]
        : styles.option;
    }

    if (index === currentQuestion.correctIndex)
      return [styles.option, styles.correct];
    if (index === selected) return [styles.option, styles.incorrect];
    return styles.option;
  };

  const handleLerTexto = () => {
    if (isSpeaking) {
      speechController.stop();
      setIsSpeaking(false);
      return;
    }

    const text = showResult ? `Parabéns! ${score} barra ${questions.length} Tentar novamente voltar`: questions[current]?.sound;

    speechController.start(text || "Erro ao detectar texto", () =>
      setIsSpeaking(false)
    );
    setIsSpeaking(true);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isSpeaking) {
          speechController.stop();
          setIsSpeaking(false);
        }
      };
    }, [isSpeaking])
  );

  if (showResult) {
    const success = score === questions.length;

    return (
      <LinearGradient
        colors={["#2193b0", "#6dd5ed"]}
        style={styles.resultContainer}
      >
          <TouchableOpacity onPress={handleLerTexto} style={{position: "absolute", top: 20, right: 20}}>
            <Image
              source={
                isSpeaking
                  ? require("@/assets/images/no-sound-icon.png")
                  : require("@/assets/images/sound-icon.png")
              }
              style={styles.soundIcon}
            />
          </TouchableOpacity>
        <View style={styles.resultBox}>
          <Text style={styles.emoji}>{success ? "🎉" : "🧠"}</Text>
          <Text style={styles.resultTitle}>
            {success ? "Parabéns!" : "Você completou o quiz!"}
          </Text>
          <Text style={styles.resultTitle}>
            {score} / {questions.length}
          </Text>

          <TouchableOpacity onPress={restartQuiz} style={styles.restart}>
            <Text style={styles.restartText}>Tentar novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || "not found"}</Text>
        <TouchableOpacity onPress={handleLerTexto}>
          <Image
            source={
              isSpeaking
                ? require("@/assets/images/no-sound-icon.png")
                : require("@/assets/images/sound-icon.png")
            }
            style={styles.soundIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main}>
        <View
          style={{
            ...styles.questionImageContainer,
            maxHeight: viewportHeight * currentQuestion.heightFactor,
          }}
        >
          <Image
            source={currentQuestion.image}
            style={styles.questionImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => {
                if (!verified) setSelected(index);
              }}
              disabled={verified}
            >
              <Text style={styles.optionText}>
                <Text
                  style={{ fontWeight: "bold" }}
                >{`${letterLabels[index]}) `}</Text>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View
        style={[
          styles.footer,
          verified &&
            (isCorrect ? styles.footerCorrect : styles.footerIncorrect),
        ]}
      >
        {!verified ? (
          <TouchableOpacity
            onPress={handleVerify}
            disabled={selected === null}
            style={[
              styles.verifyButton,
              selected === null ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
          >
            <Text style={styles.verifyText}>Verificar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.nextButton,
              isCorrect ? styles.nextCorrect : styles.nextIncorrect,
            ]}
          >
            <Text style={styles.nextText}>Próxima</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxHeight: viewportHeight,
  },
  main: {
    padding: 25,
    flex: 1,
  },
  questionImageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  questionImage: {
    maxWidth: viewportWidth,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  optionsContainer: {
    marginBottom: 70,
  },
  option: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    maxHeight: viewportHeight * 0.15,
    justifyContent: "center",
    marginTop: "auto",
    padding: 20,
    width: "100%",
  },
  verifyButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonEnabled: {
    backgroundColor: "#2196f3",
  },
  buttonDisabled: {
    backgroundColor: "#90caf9",
  },
  feedbackBox: {
    padding: 20,
  },
  feedbackCorrect: {
    backgroundColor: "#c8e6c9",
  },
  feedbackIncorrect: {
    backgroundColor: "#ffcdd2",
  },
  nextButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextCorrect: {
    backgroundColor: "#388e3c",
  },
  nextIncorrect: {
    backgroundColor: "#d32f2f",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
  },
  restart: {
    marginTop: 30,
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  restartText: {
    color: "#fff",
    fontSize: 18,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#c3c3c3",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#2196f3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#284f7f",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
  },
  selected: {
    backgroundColor: "#bbdefb",
  },
  correct: {
    backgroundColor: "#c8e6c9",
  },
  incorrect: {
    backgroundColor: "#ffcdd2",
  },
  footerCorrect: {
    backgroundColor: "#c8e6c9",
  },
  footerIncorrect: {
    backgroundColor: "#ffcdd2",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  resultBox: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: "85%",
  },

  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },

  resultScore: {
    fontSize: 18,
    marginBottom: 25,
    color: "#555",
    textAlign: "center",
  },

  backButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ff5731",
    alignItems: "center",
    width: "100%",
  },
  backText: {
    color: "#ffffff",
    fontSize: 16,
  },
  soundIcon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
});

export default Quiz;
