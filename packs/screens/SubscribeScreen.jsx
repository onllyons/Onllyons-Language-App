import React, {useCallback, useMemo, useState} from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ScrollView,
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
import {useStore} from "../providers/Store";

const {width} = Dimensions.get("window");

export default function SubscribeScreen({navigation}) {
    const {deleteStoredValue} = useStore()
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
            } else {
                deleteStoredValue("cancelledSubscribe")
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

    const descriptionsMap = {
        1: [
            "Уроки английского",
            "Флэш карта: Слова",
            "Игра: Задачи",
            "Игра: Задачи",
            "Игра: Задачи",
            "Игра: Задачи",
            "Кники (субтитры)",
        ],
        2: [
            "Уроки английского",
            "Флэш карта: Слова",
            "Игра: Задачи",
            "Игра: Задачи",
            "Игра: Задачи",
            "Игра: Задачи",
            "Кники (субтитры)",
        ],
        // Default list for other ids
        default: [
            "Уроки английского",
            "Флэш карта: Слова",
            "Игра: Задачи",
            "Игра: Задачи",
            "Игра: Задачи",
            "Игра: Задачи",
            "Кники (субтитры)",

        ]
    };

    const descriptionsPunct = {
        1: [
            "Неограниченный доступ",
            "Неограниченный доступ",
            "16 задачь в день",
            "16 задачь в день",
            "16 задачь в день",
            "16 задачь в день",
            "Отсутствует",
        ],
        2: [
            "Неограниченный доступ",
            "Неограниченный доступ",
            "Неограниченный доступ",
            "Неограниченный доступ",
            "Неограниченный доступ",
            "Неограниченный доступ",
            "Неограниченный доступ",
        ],
        // Default list for other ids
        default: [
            "1 урок из категории",
            "1 урок из категории",
            "5 задачи в день",
            "5 задачи в день",
            "5 задачи в день",
            "5 задачи в день",
            "Отсутствует",
        ]
    };

    const descriptionsPunctColor = {
        1: [
            "#636363",
            "#636363",
            "#ca3431",
            "#ca3431",
            "#ca3431",
            "#ca3431",
            "#ca3431",
        ],
        2: [
            "#636363",
            "#636363",
            "#636363",
            "#636363",
            "#636363",
            "#636363",
            "#636363",
        ],
        // Default list for other ids
        default: [
            "#ca3431",
            "#ca3431",
            "#ca3431",
            "#ca3431",
            "#ca3431",
            "#ca3431",
            "#ca3431",
        ]
    };

const renderPoints = (id) => {
  let points = [];
  let descriptions = descriptionsMap[id] || descriptionsMap.default;
  let supplementaryDescriptions = descriptionsPunct[id] || descriptionsPunct.default;
  let colors = descriptionsPunctColor[id] || descriptionsPunctColor.default;
  let maxLength = Math.max(descriptions.length, supplementaryDescriptions.length);

  for (let i = 0; i < maxLength; i++) {
    // Creează un obiect de stil pentru text care include culoarea din descriptionsPunctColor
    const textStyleWithColor = { color: colors[i], ...styles.supplementaryDescriptionsText };

    points.push(
      <View key={i} style={[styles.btnMenuProfile, styles.btnBTR, i === maxLength - 1 ? styles.btnBBR : styles.btnBB]}>
        <Text style={styles.btnText}>{descriptions[i]}</Text>
        {/* Aplică stilul cu culoarea specifică pentru descrierea suplimentară */}
        <Text style={textStyleWithColor}>{supplementaryDescriptions[i]}</Text>
      </View>
    );
  }

  return points;
};



    const renderItem = ({item}) => {
        return (
            <View style={styles.slide}>
                <ButtonSubscription
                    subscriptionId={item.id}
                    disable={item.id === user.subscribe}
                    period={period}
                    name={item.title}
                    image={getImageById(item.id)}
                    costs={{
                        "month": item.priceMonth,
                        "year": item.priceYear
                    }}
                />

                <ButtonsPeriod
                    disable={item.id === user.subscribe}
                    subscriptionId={item.id}
                    period={period}
                    setPeriod={setPeriod}
                />

                <View style={styles.sectionScroll}>
                    <ScrollView contentContainerStyle={{paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 20}}>

                        <Text>{item.description}</Text>

                        <View style={styles.sectionMenu}>
                            {renderPoints(item.id)}
                        </View>
                    </ScrollView>
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
                    onPress={() => navigation.goBack()}
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
                    disable={selectedSubscription === user.subscribe || selectedSubscription === 0 || disableSwiper}
                    permanentlyActive={selectedSubscription === user.subscribe || selectedSubscription === 0 || disableSwiper}
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
    costs,
    disable,
}) => {
    return (
        <AnimatedButtonShadow
            styleButton={[styles.card, globalCss.bgGry]}
            shadowColor={"gray"}
            permanentlyActive={disable}
            permanentlyActiveOpacity={.5}
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

const ButtonsPeriod = ({disable, subscriptionId, period, setPeriod}) => {
    return subscriptionId !== 0 && (
        <View style={styles.buttonsPeriodContainer}>
            <AnimatedButtonShadow
                styleContainer={[styles.buttonPeriodContainer, {paddingRight: 5}]}
                styleButton={[globalCss.button, globalCss.buttonBlue, styles.buttonPeriod]}
                shadowColor={"blue"}
                permanentlyActive={disable || period[subscriptionId] === "month"}
                disable={disable}
                permanentlyActiveOpacity={.5}
                onPress={() => setPeriod(prev => ({...prev, [subscriptionId]: "month"}))}
            >
                <Text style={globalCss.buttonText}>на месяц</Text>
            </AnimatedButtonShadow>
            <AnimatedButtonShadow
                styleContainer={[styles.buttonPeriodContainer, {paddingLeft: 5}]}
                styleButton={[globalCss.button, globalCss.buttonBlue, styles.buttonPeriod]}
                shadowColor={"blue"}
                permanentlyActive={disable || period[subscriptionId] === "year"}
                disable={disable}
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
    sectionScroll:{
        marginTop: "5%",
        flex: 1,
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
        width: '100%',
    },
    btnMenuProfile: {
        backgroundColor: "white",
        paddingVertical: "3%",
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
        fontSize: 15,
        color: "black",
    },
    supplementaryDescriptionsText: {
        fontSize: 13,
    },
});
