import React, {useCallback, useMemo, useState} from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import globalCss from "../css/globalCss";
import Toast from "react-native-toast-message";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

import Carousel from "react-native-new-snap-carousel";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
// icons
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useStripe} from "@stripe/stripe-react-native";
import Loader from "../components/Loader";
import {sendDefaultRequest, SERVER_AJAX_URL, updateUser} from "../utils/Requests";
import {getUser} from "../providers/AuthProvider";
import {useFocusEffect} from "@react-navigation/native";

const {width} = Dimensions.get("window");

export default function SubscribeScreen({navigation}) {
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [data, setData] = useState([])
    const [disableSwiper, setDisableSwiper] = useState(false)
    const [selectedSubscription, setSelectedSubscription] = useState(0);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(getUser())
    // Period to selected subscription
    const [period, setPeriod] = useState({
        1: "month",
        2: "month"
    })

    useFocusEffect(
        useCallback(() => {
            updateUser(navigation)
                .then(user => setUser(user))
                .catch(() => {})
        }, [])
    );

    // Initialize payment from server
    const initializePaymentSheet = async () => {
        setLoading(true)

        try {
            const response = await sendDefaultRequest(`${SERVER_AJAX_URL}/checkout/create-checkout-session.php`,
                {
                    period: period[selectedSubscription], // year
                    subscribe: selectedSubscription
                },
                navigation
            )

            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: response.session.latest_invoice.payment_intent.client_secret,
                merchantDisplayName: "Onllyons",
                returnURL: 'language://congratulations'
            });

            if (error) {
                Toast.show({
                    type: "error",
                    text1: "Ошибка инициализации оплаты, попробуйте позже"
                });
            }
        } finally {
            setTimeout(() => setLoading(false), 1)
        }
    };

    // Open payment window after initialize
    const openPaymentSheet = async () => {
        if (disableSwiper) return

        setDisableSwiper(true)

        try {
            await initializePaymentSheet();

            // If dont use timeout payment window closed (maybe bug)
            await new Promise(resolve => setTimeout(resolve, 1000))

            setDisableSwiper(false)

            const {error} = await presentPaymentSheet();

            if (error) {
                Toast.show({
                    type: "error",
                    text1: "Оплата отменена"
                });
            } else {
                navigation.navigate("Congratulations")
            }
        } catch (err) {
            setDisableSwiper(false)
        }
    };

    const onSnapToItem = useCallback((id) => {
        setSelectedSubscription(id)
    }, [])

    useMemo(() => {
        setLoading(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/checkout/get_subscriptions.php`,
            {},
            navigation
        )
            .then(data => setData(data.data))
            .catch(err => {
                if (typeof err === "object") {
                    if (!err.tokensError) {
                        navigation.goBack()
                    }
                }
            })
            .finally(() => setTimeout(() => setLoading(false), 1))
    }, []);

    const getImageById = useCallback(id => {
        switch (id) {
            case 1:
                return require("../images/other_images/diamond-green.png")
            case 2:
                return require("../images/other_images/diamond-red.png")
            default:
                return null
        }
    }, [])

    const renderItem = ({item}) => {
        return (
            <View style={[styles.slide, item.id === user.subscribe && {opacity: 0.75, pointerEvents: "none"}]}>
                <ButtonSubscription
                    subscriptionId={item.id}
                    period={period}
                    name={item.title}
                    image={getImageById(item.id)}
                    costs={{
                        "month": item.priceMonth,
                        "year": item.priceYear
                    }}
                />

                <ButtonsPeriod
                    subscriptionId={item.id}
                    period={period}
                    setPeriod={setPeriod}
                />

                <View style={styles.sectionMenu}>
                    <View style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}>
                        <Text style={styles.btnText}>Справка и поддержка</Text>
                    </View>

                    <View style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}>
                        <Text style={styles.btnText}>Пол. соглашение</Text>
                    </View>
                    <View style={[styles.btnMenuProfile, styles.btnBBR]}>
                        <Text style={styles.btnText}>Пол. конфиденциаль.</Text>
                    </View>
                </View>


            </View>
        )
    };

    return (
        <View style={styles.container}>
            <Loader visible={loading}/>
            <View style={globalCss.navTabUser}>
                <TouchableOpacity
                    style={globalCss.itemNavTabUserBtnBack}
                    onPress={() => navigation.navigate("MenuScreen")}
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        size={30}
                        style={globalCss.blue}
                    />
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>Подписка</Text>
                </View>
            </View>

            <View style={styles.containerCarousel}>
                <Carousel
                    itemWidth={width - 70}
                    sliderWidth={width}
                    data={data}
                    renderItem={renderItem}
                    onSnapToItem={onSnapToItem}
                    layout={"default"}
                    enableSnap={!disableSwiper}
                    loop={false}
                />
            </View>

            <View style={styles.buttonBuy}>
                <AnimatedButtonShadow
                    styleButton={[globalCss.button, globalCss.buttonBlue]}
                    shadowColor={"blue"}
                    onPress={openPaymentSheet}
                    disable={selectedSubscription === user.subscribe || disableSwiper}
                    permanentlyActive={selectedSubscription === user.subscribe || disableSwiper}
                    permanentlyActiveOpacity={.5}
                    size={"full"}
                >
                    <Text style={globalCss.buttonText}>{selectedSubscription === user.subscribe ? "Активно" : "Приобрести"}</Text>
                </AnimatedButtonShadow>
            </View>
        </View>
    );
}

const ButtonSubscription = ({
    name,
    image,
    period,
    subscriptionId,
    costs
}) => {
    return (
        <AnimatedButtonShadow
            styleButton={[styles.card, globalCss.bgGry]}
            shadowColor={"grayWhite"}
            size={"full"}
        >
            {subscriptionId !== 0 && (
                <Image
                    source={image}
                    style={styles.image}
                />
            )}

            <View style={styles.details}>
                <Text style={styles.title}>{name}</Text>

                {subscriptionId === 0 ? (
                    <Text style={styles.price}>Бесплатно</Text>
                ) : (
                    <Text style={styles.price}>€ {costs[period[subscriptionId]].toFixed(2)} в {period[subscriptionId] === "month" ? "месяц" : "год"}</Text>
                )}
            </View>
        </AnimatedButtonShadow>
    )
}

const ButtonsPeriod = ({subscriptionId, period, setPeriod}) => {
    return subscriptionId !== 0 && (
        <View style={styles.buttonsPeriodContainer}>
            <AnimatedButtonShadow
                styleContainer={[styles.buttonPeriodContainer, {paddingRight: 5}]}
                styleButton={[globalCss.button, globalCss.buttonBlue, styles.buttonPeriod]}
                shadowColor={"blue"}
                permanentlyActive={period[subscriptionId] === "month"}
                permanentlyActiveOpacity={.5}
                onPress={() => setPeriod(prev => ({...prev, [subscriptionId]: "month"}))}
            >
                <Text style={globalCss.buttonText}>на месяц</Text>
            </AnimatedButtonShadow>
            <AnimatedButtonShadow
                styleContainer={[styles.buttonPeriodContainer, {paddingLeft: 5}]}
                styleButton={[globalCss.button, globalCss.buttonBlue, styles.buttonPeriod]}
                shadowColor={"blue"}
                permanentlyActive={period[subscriptionId] === "year"}
                permanentlyActiveOpacity={.5}
                onPress={() => setPeriod(prev => ({...prev, [subscriptionId]: "year"}))}
            >
                <Text style={globalCss.buttonText}>на год</Text>
            </AnimatedButtonShadow>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    buttonBuy: {
        width: "85%",
        alignSelf: "center",
        marginTop: "7%",
    },
    containerCarousel: {
        justifyContent: "center",
        alignItems: "center",
        height: "70%",
    },
    slide: {
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        height: "100%",
        borderRadius: 12,
        padding: "5%",
    },
    buttonPeriod: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 0
    },
    buttonPeriodContainer: {
        width: "50%"
    },
    buttonsPeriodContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    card: {
        flexDirection: "row",
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    details: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        color: "#666",
    },

    titlePageTxt: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        marginBottom: "5%",
    },

    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "grey",
        marginBottom: 5,
    },
    sectionMenu: {
        backgroundColor: "#ffffff",
        borderColor: "#d8d8d8",
        borderWidth: 2,
        borderRadius: 12,
        marginTop: '8%',
        width: '100%',
    },
    btnMenuProfile: {
        backgroundColor: "white",
        paddingVertical: "6%",
        paddingHorizontal: "5%",
        alignItems: "flex-start",
    },

    btnBTR: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    btnBBR: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    btnBB: {
        borderBottomWidth: 2,
        borderColor: "#d8d8d8",
    },
    btnText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "black",
    },
});
