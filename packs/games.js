import {View, Text, Image, StyleSheet} from 'react-native';
import globalCss from './css/globalCss';
import Toast from "react-native-toast-message";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";

const cardData = [
    {
        id: 1,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game.webp',
        text: 'Задачи'
    },
    {
        id: 2,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-write-with-keyboard.webp',
        text: 'Написать перевод'
    },
    {
        id: 3,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-write-translate.webp',
        text: 'Расшифруйте аудио'
    },
    {
        id: 4,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-change-eyes.webp',
        text: 'Переведите аудио'
    },
    {
        id: 5,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-true-false.webp',
        text: 'Верно - Не верно'
    },
];
 
export default function GamesScreen({navigation}) {
    const handlePress = (id) => {
        if (id === 1) {
            navigation.navigate('GamesQuiz');
        } else if (id === 5) {
            navigation.navigate('GamesQuizTrueFalse');
        } else {
            Toast.show({
                type: "error",
                text1: "Игра будет доступна в системе в ближайшее время. Благодарим за ваше терпение и понимание"
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titlePage}>
                Quiz game
            </Text>

            <View style={[globalCss.row, styles.containerCards]}>
                {cardData.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        onPress={() => handlePress(card.id)}
                    />
                ))}
            </View>
        </View>
    );
}

const Card = ({card, onPress}) => (
    <AnimatedButtonShadow
        styleContainer={{
            width: "48%"
        }}
        styleButton={[styles.card, styles.bgGry]}
        shadowColor={"gray"}
        onPress={onPress}
        shadowBorderRadius={6}
    >
        <Image
            source={{uri: card.uri}}
            style={{width: 100, height: 100}}
        />
        <Text>{card.text}</Text>
    </AnimatedButtonShadow>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
    },
    containerCards: {
        backgroundColor: 'white',
    },
    titlePage: {
        marginTop: '13%',
        fontSize: 30,
        fontWeight: '600',
        color: '#333333',
    },
    card: {
        width: '100%',
        height: 150,
        marginBottom: 15,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        marginVertical: '2%',
    },
    bgGry: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8'
    }
});