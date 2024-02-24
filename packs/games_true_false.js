import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

export default function GamesTrueFalse({navigation}) {

    return (
        <CubeGesture/>
    );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CUBE_SIZE = 360;

function CubeGesture() {
    // Величина перетаскивания в вертикальном направлении
    const translateY = useSharedValue(0);

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            translateY.value = ctx.startY + event.translationY;
        },
        onEnd: (_) => {
            // Возвращаем кубик в исходное положение
            translateY.value = withSpring(0);
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <View style={styles.container}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={[styles.cube, animatedStyle]} />
            </PanGestureHandler>
        </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cube: {
        width: CUBE_SIZE,
        height: CUBE_SIZE,
        backgroundColor: 'white',
        transform: [{ perspective: 2000 }], // Добавьте перспективу для вращения, если нужно
        borderColor: "#e0e0e0",
        borderWidth: 2.1,
        borderRadius: 14,
    },
});