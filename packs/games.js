import {View, Text, Image, StyleSheet} from 'react-native';
import globalCss from './css/globalCss';
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";

const cardData = [
    {
        id: 1,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game.webp',
        text: 'Задачи',
        screen: "GamesQuiz"
    },
    {
        id: 2,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-write-with-keyboard.webp',
        text: 'Написать перевод',
        screen: "GamesTranslate"
    },
    {
        id: 3,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-write-translate.webp',
        text: 'Расшифруйте аудио',
        screen: "GamesDecodeAudio"
    },
    {
        id: 4,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-change-eyes.webp',
        text: 'Переведите аудио',
        screen: "GamesTranslateAudio"
    },
    {
        id: 5,
        uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-true-false.webp',
        text: 'Верно - Не верно',
        screen: "GamesTrueFalse"
    },
];

export default function GamesScreen({navigation}) {
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
                        onPress={() => navigation.navigate(card.screen)}
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