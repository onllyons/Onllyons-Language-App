import {StyleSheet, Text, View} from "react-native";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import globalCss from "../css/globalCss";

export const Congratulations = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text>Поздравляем с приобретением подписки!</Text>
            <Text>Через несколько минут подписка начнет действовать</Text>
            <AnimatedButtonShadow
                styleButton={[globalCss.button, globalCss.buttonGreen]}
                shadowColor={"green"}
                onPress={() => navigation.navigate("MainTabNavigator", {screen: "MenuCourseLesson"})}
            >
                <Text style={[globalCss.buttonText]}>Начать</Text>
            </AnimatedButtonShadow>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});