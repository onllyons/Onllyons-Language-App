import React, {useCallback, useMemo, useState} from 'react';
import globalCss from '../css/globalCss';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl} from 'react-native';
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import Loader from "../components/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faCircleCheck, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {useStore} from "../providers/Store";

export default function UserProfile({navigation}) {
    const {setStoredValue, getStoredValue} = useStore()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const getSubscriptionData = useCallback(() => {
        sendDefaultRequest(`${SERVER_AJAX_URL}/checkout/get_subscribe_info.php`,
            {cancelledSubscribe: getStoredValue("cancelledSubscribe") !== null},
            navigation
        )
            .then(data => setData(data.data))
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false)
                    setLoading(false)
                }, 1)
            })
    }, [])

    const handleCancelSubscribe = () => {
        setLoading(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/checkout/cancel_subscription.php`,
            {},
            navigation
        )
            .then(() => {
                setStoredValue("cancelledSubscribe", true)
            })
            .catch(() => {})
            .finally(() => {
                getSubscriptionData()
            })
    }

    useMemo(() => {
        if (!refreshing && !loading) return

        getSubscriptionData()
    }, [refreshing])

    return (
        <View style={styles.container}>
            <Loader visible={loading}/>

            <View style={globalCss.navTabUser}>
                <TouchableOpacity style={globalCss.itemNavTabUserBtnBack}
                                  onPress={() => navigation.navigate("MenuScreen")}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>Управление подпиской</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{paddingBottom: 100}}
                style={styles.containerContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => setRefreshing(true)}
                    />
                }
            >
                <SubscriptionInfo handleCancelSubscribe={handleCancelSubscribe} info={data.activeSubscribe ? data.activeSubscribe : {}}/>

                <SubscriptionHistory history={data.subscribeHistory ? data.subscribeHistory : []}/>
            </ScrollView>

        </View>
    );
}

const SubscriptionInfo = ({info, handleCancelSubscribe}) => {
    let content = []

    switch (info.type) {
        case "activePayments":
            content.push((
                <View key={"activePayments"}>
                    <Text>Стоимость: {info.price} EUR</Text>
                    <Text>Период: {info.period === "month" ? "ежемесячно" : "ежегодно"}</Text>
                    <Text>Начало подписки: {info.start}</Text>
                    <Text>Конец подписки: {info.end}</Text>
                    <Text>При отмене подписки ваш текущий план остаеться до конца периода. Отмена подписки может занять несколько минут</Text>

                    <AnimatedButtonShadow
                        styleButton={[globalCss.button, globalCss.buttonGreen, styles.cancelSubscribeBtn]}
                        shadowColor={"green"}
                        onPress={handleCancelSubscribe}>
                        <Text style={globalCss.buttonText}>Отменить подписку</Text>
                    </AnimatedButtonShadow>
                </View>
            ))
            break

        case "activeSubscribe":
            content.push((
                <View key={"activeSubscribe"}>
                    <Text>Начало подписки: {info.start}</Text>
                    <Text>Конец подписки: {info.end}</Text>
                </View>
            ))
            break

        default:
            content.push((
                <View key={"inactive"}>
                    <Text>У вас нет активной подписки</Text>
                </View>
            ))
    }

    return (
        <View style={styles.subscribeInfoContainer}>
            <Text style={styles.header}>Иформация о подписке</Text>

            {content}
        </View>
    )
}

const SubscriptionHistory = ({history}) => {
    return (
        <View>
            <Text style={styles.header}>История транзакций</Text>

            {history && history.length > 0 ? (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.tableCellBold]}>Subscription</Text>
                        <Text style={[styles.tableCell, styles.tableCellBold]}>Date</Text>
                        <Text style={[styles.tableCell, styles.tableCellBold]}>Status</Text>
                    </View>

                    {history.map((item, index) => (
                        <View key={index} style={[styles.tableRow, index + 1 === history.length && styles.bbr]}>
                            <Text style={[styles.tableCell]}>{item.subscriptionType}</Text>
                            <Text style={[styles.tableCell]}>{item.date}</Text>
                            <FontAwesomeIcon
                                icon={item.success ? faCircleCheck : faCircleXmark}
                                size={20}
                                color={item.success ? "#57cc04" : "#ca3431"}
                                style={[styles.tableCell]}
                            />
                        </View>
                    ))}
                </View>
            ) : (
                <Text>Вы не совершали никаких транзакций</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
    },
    subscribeInfoContainer: {
        marginBottom: 20,
    },
    cancelSubscribeBtn: {
        marginTop: 10,
        marginBottom: 0
    },
    containerContent: {
        padding: "5%",
    },
    header: {
        fontSize: 20,
        color: '#494949',
        fontWeight: '500',
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#ddd',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: '#ddd',
        padding: "5%"
    },
    tableCell: {
        flex: 1,
    },
    tableCellBold: {
        flex: 0,
        fontWeight: "600",
        textAlign: "center"
    },
    bbr: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        flexDirection: 'row',
    },

});
