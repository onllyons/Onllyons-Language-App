import React, {useState} from 'react';
import globalCss from '../css/globalCss';
import {View, Text} from 'react-native';
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import Loader from "../components/Loader";

export default function UserProfile({navigation}) {
    const [loading, setLoading] = useState(false)

    const handleCancelSubscribe = () => {
        setLoading(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/checkout/cancel_subscription.php`,
            {},
            navigation
        )
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                setTimeout(() => setLoading(false), 1)
            })
    }

    return (
        <View>
            <Loader visible={loading}/>
            <Text>Курс: Английский язык</Text>
            <Text>Подписка отменяется в течении нескольких минут</Text>
            <AnimatedButtonShadow
                styleButton={[globalCss.button, globalCss.buttonGreen]}
                shadowColor={"green"}
                onPress={handleCancelSubscribe}
            >
                <Text style={globalCss.buttonText}>Отменить подписку</Text>
            </AnimatedButtonShadow>
        </View>
    );
}
