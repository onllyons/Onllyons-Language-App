import React, {useCallback, useEffect, useState} from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Pressable, AppState,
} from "react-native";
import {useNavigation} from "@react-navigation/native";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
// icons
import {faCamera, faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import globalCss from "../css/globalCss";
import {getUser, login} from "../providers/AuthProvider";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {sendDefaultRequest, SERVER_AJAX_URL, updateUser} from "../utils/Requests";
import Loader from "../components/Loader";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

const Profile = () => {
    let user = getUser();
    const [appState, setAppState] = useState(AppState.currentState);
    const navigation = useNavigation();
    const [data, setData] = useState({
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username,
        bio: user.bio,
    });
    const [loader, setLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [image, setImage] = useState({
        uri: "",
        type: "image",
    });

    const setUserData = useCallback((userData) => {
        user = userData;

        setData(prev => ({
            ...prev,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            bio: user.bio,
        }));
    }, []);

    // The effect of returning the user to the application
    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.match(/inactive|background/) && nextAppState === "active") {
                updateUser(navigation)
                    .then(user => setUserData(user))
                    .catch(() => {})
            }
            setAppState(nextAppState);
        });

        return () => {
            subscription.remove();
        };
    }, [appState]);

    const handleSave = useCallback(() => {
        setLoader(true);

        if (image.uri) data.image = image;

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/user/save_basic_settings.php`,
            data,
            navigation
        )
            .then(async (data) => {
                if (data.email_changed) {
                    Toast.show({
                        type: "success",
                        text1:
                            "Письмо с подтверждением нового email отправлено, перейдите по ссылке, что бы активировать его",
                    });
                }

                await login(data.user, data.tokens)
                setUserData(data.user);
            })
            .catch(() => {
            })
            .finally(() => setTimeout(() => setLoader(false), 1));
    }, [data, image]);

    const handleConfirmEmail = useCallback(() => {
        setLoader(true);

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/user/send_confirm_email.php`,
            {},
            navigation
        )
            .then(() => {})
            .catch(err => {
                if (typeof err === "object") {
                    if (!err.tokensError && err.verified) {
                        updateUser(navigation)
                            .then(user => setUserData(user))
                            .catch(() => {})
                    }
                }
            })
            .finally(() => setTimeout(() => setLoader(false), 1));
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        updateUser(navigation)
            .then(user => setUserData(user))
            .catch(() => {})
            .finally(() => setRefreshing(false))
    }, []);

    const pickImage = async () => {
        // Request permissions
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Toast.show({
                type: "error",
                text1: "Вы не дали разрешение на выбор фото",
            });
            return;
        }

        // Select image
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setImage((prev) => ({...prev, uri: pickerResult.assets[0].uri}));
        }
    };

    return (
        <View style={styles.container}>
            <Loader visible={loader}/>

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
                    <Text style={globalCss.dataCategoryTitle}>Профиль</Text>
                </View>
            </View>


            <ScrollView
                style={styles.containerScroll}
                contentContainerStyle={{paddingBottom: 50}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >


                <View style={[styles.avatarContainer]}>
                    <View
                        style={[styles.userContainerImageBorder, {position: "relative"}]}
                    >
                        <Pressable onPress={pickImage} style={styles.selectImage}>
                            <TouchableOpacity onPress={pickImage} activeOpacity={0.5}>
                                <FontAwesomeIcon icon={faCamera} size={50} color={"#fff"}/>
                            </TouchableOpacity>
                        </Pressable>

                        <Image
                            source={
                                image.uri
                                    ? {uri: image.uri}
                                    : user.image === "default.png"
                                        ? {uri: `https://www.language.onllyons.com/ru/ru-en/dist/images/user-images/default.png`}
                                        : {
                                            uri: `https://www.language.onllyons.com/ru/ru-en/dist/images/user-images/${user.image}`,
                                        }
                            }
                            style={styles.userImage}
                        />
                    </View>
                </View>

                <View style={globalCss.inputGroup}>
                    <Text style={styles.label}>Имя</Text>
                    <View style={[styles.inputView, styles.inputContainer1]}>
                        <TextInput
                            style={globalCss.input}
                            value={data.name}
                            placeholder="Имя"
                            onChangeText={(text) =>
                                setData((prev) => ({...prev, name: text}))
                            }
                        />
                    </View>
                    <Text style={styles.label}>Фамилия</Text>
                    <View style={[styles.inputView, styles.inputContainer1]}>
                        <TextInput
                            style={globalCss.input}
                            value={data.surname}
                            placeholder="Фамилия"
                            onChangeText={(text) =>
                                setData((prev) => ({...prev, surname: text}))
                            }
                        />
                    </View>
                    <Text style={styles.label}>Электронная почта</Text>
                    <View
                        style={[
                            styles.inputView,
                            styles.inputContainer1,
                            user.by_google && styles.inputInactive,
                        ]}
                    >
                        <TextInput
                            style={globalCss.input}
                            value={data.email}
                            placeholder="Электронная почта"
                            onChangeText={(text) =>
                                setData((prev) => ({...prev, email: text}))
                            }
                        />
                    </View>
                    {!user.by_google && !user.verified && user.email === data.email && (
                        <AnimatedButtonShadow
                            styleButton={[globalCss.button, globalCss.buttonGreen]}
                            shadowColor={"green"}
                            onPress={handleConfirmEmail}
                        >
                            <Text style={globalCss.buttonText}>Подтвердить Email</Text>
                        </AnimatedButtonShadow>
                    )}
                    <Text style={styles.label}>Имя пользователя</Text>
                    <View style={[styles.inputView, styles.inputContainer1]}>
                        <TextInput
                            style={globalCss.input}
                            value={data.username}
                            placeholder="Имя пользователя"
                            onChangeText={(text) =>
                                setData((prev) => ({...prev, username: text}))
                            }
                        />
                    </View>
                    <Text style={styles.label}>Обо мне</Text>
                    <View
                        style={[
                            styles.inputView,
                            styles.inputContainer1,
                            styles.bigInputContainer,
                        ]}
                    >
                        <TextInput
                            style={globalCss.bigInput}
                            value={data.bio}
                            multiline={true}
                            placeholder="Биография"
                            onChangeText={(text) =>
                                setData((prev) => ({...prev, bio: text}))
                            }
                        />
                    </View>
                    <Text style={styles.label}>Уровень</Text>
                    <View
                        style={[
                            styles.inputView,
                            styles.inputInactive,
                            styles.inputContainer1,
                        ]}
                    >
                        <TextInput
                            style={globalCss.input}
                            value={
                                user.level === 0
                                    ? "Beginner"
                                    : user.level === 1
                                        ? "Intermediate"
                                        : user.level === 2
                                            ? "Advanced"
                                            : "Unknown Level"
                            }
                            placeholder="Уровень"
                            editable={false}
                        />
                    </View>

                    <AnimatedButtonShadow
                        styleButton={[
                            globalCss.button,
                            globalCss.buttonGry,
                            styles.changePassword,
                        ]}
                        shadowColor={"gray"}
                        onPress={() => {
                            navigation.navigate("ChangePasswordScreen");
                        }}
                    >
                        <Text style={globalCss.gry}>СМЕНИТЬ ПАРОЛЬ?</Text>
                    </AnimatedButtonShadow>

                    <AnimatedButtonShadow
                        styleButton={[
                            globalCss.button,
                            globalCss.buttonGreen,
                            styles.saveAll,
                        ]}
                        shadowColor={"green"}
                        onPress={handleSave}
                    >
                        <Text style={globalCss.buttonText}>СОХРАНИТЬ</Text>
                    </AnimatedButtonShadow>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    containerScroll: {
        padding: '5%',
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },

    inputGroup: {
        marginBottom: 20,
    },
    saveAll: {
        marginBottom: 0,
    },

    selectImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        borderRadius: 1000,
        zIndex: 1,
    },

    userContainerImageBorder: {
        width: 200,
        height: 200,
        backgroundColor: "#5ca1ff",
        alignSelf: "center",
        borderRadius: 1000,
        padding: 10,
    },
    userImage: {
        width: "100%",
        height: "100%",
        borderRadius: 1000,
    },
    label: {
        fontSize: 17,
        color: "#000",
        marginBottom: 5,
        fontWeight: "600",
    },
    inputView: {
        borderBottomWidth: 2.1,
        borderColor: "#e0e0e0",
        flexDirection: "row",
        borderLeftWidth: 2.1,
        borderRightWidth: 2.1,
        paddingLeft: 12,
    },
    inputInactive: {
        opacity: 0.5,
    },
    inputContainer1: {
        borderTopWidth: 2.1,
        borderRadius: 14,
        paddingBottom: 17,
        paddingTop: 17,
        paddingRight: 12,
        marginBottom: 12,
    },
    bigInputContainer: {
        paddingBottom: 12,
        paddingTop: 12,
    },
});

export default Profile;
