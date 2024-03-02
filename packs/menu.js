import React, {useCallback, useState} from "react";
import {ScrollView, Linking, View, Text, Image, TouchableOpacity, RefreshControl} from 'react-native';

// fonts
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// icons
import {faGear} from '@fortawesome/free-solid-svg-icons';

// styles
import globalCss from './css/globalCss';
import {menuStyle as styles} from "./css/menu.styles";

// Toast
import Toast from "react-native-toast-message";
import {getUser, logout} from "./providers/AuthProvider";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";
import {updateUser} from "./utils/Requests";
import {useFocusEffect} from "@react-navigation/native";

export default function MenuScreen({navigation}) {
    const [user, setUser] = useState(getUser());
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        updateUser(navigation)
            .then(user => setUser(user))
            .catch(() => {})
            .finally(() => setRefreshing(false))
    }, [])

    useFocusEffect(
        useCallback(() => {
            updateUser(navigation)
                .then(user => setUser(user))
                .catch(() => {})
        }, [])
    );

    const getSubscriptionName = useCallback(() => {
        switch (user.subscribe) {
            case 0:
                return "Free"
            case 1:
                return "Standard"
            case 2:
                return "Pro"
        }
    }, [user])

    const getSubscriptionImage = useCallback(() => {
        switch (user.subscribe) {
            case 0:
                return null
            case 1:
                return require("./images/other_images/diamond-green.png")
            case 2:
                return require("./images/other_images/diamond-red.png")
        }
    }, [user])

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={styles.userInfoContainer}>
                <View style={styles.navTabUser}>
                    <View style={styles.navTabUserMain}>
                        <Text style={styles.navTabUserMainTxt}>Профиль</Text>
                    </View>
                    <TouchableOpacity style={styles.navTabUserSettings} onPress={() => navigation.navigate('UserData')}>
                        <Text style={styles.navTabUserSettingsTxt}>
                            <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue}/>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardProfile}>
                    <View style={styles.cardProfileInfo}>
                        <Text style={styles.nameSurname}>{user.name} {user.surname}</Text>
                        <Text style={styles.username}>{user.username}</Text>

                        <View style={styles.levelUserTag}>
                            <Text style={styles.levelUser}>
                                {user.level === 0 ? 'Beginner' :
                                    user.level === 1 ? 'Intermediate' :
                                        user.level === 2 ? 'Advanced' :
                                            'Unknown Level'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.cardProfilePhoto}>
                        <Image
                            source={
                                user.image === 'default.png'
                                    ? {uri: `https://www.language.onllyons.com/ru/ru-en/dist/images/user-images/default.png`}
                                    : {uri: `https://www.language.onllyons.com/ru/ru-en/dist/images/user-images/${user.image}`}
                            }
                            style={styles.userImage}
                        />
                    </View>
                </View>

                <View style={styles.levelSubscription}>
                    <TouchableOpacity style={styles.levelSubscriptionBtn}>
                        {getSubscriptionImage() && (
                            <Image
                                source={getSubscriptionImage()}
                                style={styles.diamondProfile}
                            />
                        )}
                        <Text style={styles.levelSubscriptionName}>{getSubscriptionName()}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.sectionMenuUrl}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Подписка</Text>
                    <View style={styles.sectionMenu}>
                        <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}
                                          onPress={() => navigation.navigate('SubscribeScreen')}>
                            <Text style={styles.btnText}>Выберите план</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBBR]}
                                          onPress={() => navigation.navigate('UserSubscriptionManage')}>
                            <Text style={styles.btnText}>Управление подпиской</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.section, {marginVertical: 0, marginTop: 10}]}>
                    <Text style={styles.sectionTitle}>Общая информация</Text>
                    {/* Ещё страницы */}
                    
                    <View style={styles.sectionMenu}>
                    
                    {/* 
                    <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]} onPress={() => navigation.navigate('AlphabetScreen')}>
                        <Text style={styles.btnText}>Флэш-карты: Алфавит</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]} onPress={() => navigation.navigate('AboutTheWordScreen')}>
                        <Text style={styles.btnText}>Все о слове</Text>
                    </TouchableOpacity>*/}


                        <TouchableOpacity 
                            style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}
                            onPress={() => {
                                const url = 'https://www.language.onllyons.com/contact-us/';
                                // Deschide URL-ul într-un browser extern
                                Linking.openURL(url);
                            }}
                        >
                            <Text style={styles.btnText}>Справка и поддержка</Text> 
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}
                            onPress={() => {
                                const url = 'https://www.language.onllyons.com/term/';
                                Linking.openURL(url);
                            }}
                        >
                            <Text style={styles.btnText}>Пол. соглашение</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnMenuProfile, styles.btnBBR]}
                            onPress={() => {
                                const url = 'https://www.language.onllyons.com/privacy/';
                                Linking.openURL(url);
                            }}
                        >
                            <Text style={styles.btnText}>Пол. конфиденциаль.</Text>
                        </TouchableOpacity>
                    </View>


                    <AnimatedButtonShadow
                        onPress={() => {
                            logout()
                                .then(() => {
                                    navigation.navigate('StartPageScreen');
                                })
                                .catch(() => {
                                    Toast.show({
                                        type: "error",
                                        text1: "Не удалось выйти из аккаунта"
                                    });
                                });
                        }}

                        styleButton={[globalCss.button, styles.buttonOut, globalCss.bgGry]}
                        shadowColor={"gray"}
                    >
                        <Text style={styles.btnText}>Выйти</Text>
                    </AnimatedButtonShadow>

                </View>
            </View>
        </ScrollView>
    );
}
