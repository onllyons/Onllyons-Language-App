import Modal from "react-native-modal";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import globalCss from "../css/globalCss";
import React, {useRef, useState} from "react";

export const SubscribeModal = ({visible, setVisible}) => {
    const scrollViewRef = useRef(null);
    const [btnNextSubscribe, setbtnNextSubscribe] = useState(false);

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onBackdropPress={() => setVisible(false)}
            style={{justifyContent: 'flex-end', margin: 0}}
        >
            <View style={globalCss.modalSubscription}>

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{paddingTop: 80, paddingBottom: 80}}
                    style={styles.modalCourseContent}>
                    <View style={globalCss.infoCatTitle}>
                        <Image
                            source={require("../images/El/inGlasses.png")}
                            style={globalCss.courseCatImg}
                        />
                        <View style={globalCss.titleLessonCat}>
                            <Text style={globalCss.titleLessonCatTxt}>
                                Веселитесь и учите английский с нашей подпиской сейчас!
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoDetExtraCat}>

                        <View style={styles.infoDetCatTitle}>
                            <Image
                                source={require("../images/icon/brain.png")}
                                style={styles.courseDetCatImg}
                            />
                            <View style={styles.titleDetLessonCat}>
                                <Text style={styles.titleDetLessonCatSubject}>Quiz games</Text>
                                <Text style={styles.titleDetLessonCatTxt}>Неограниченный доступ к викторинам - 4
                                    игры</Text>
                            </View>
                        </View>

                        <View style={styles.horizontalLine}/>

                        <View style={styles.infoDetCatTitle}>
                            <Image
                                source={require("../images/icon/online-course.png")}
                                style={styles.courseDetCatImg}
                            />
                            <View style={styles.titleDetLessonCat}>
                                <Text style={styles.titleDetLessonCatSubject}>Курс: Английский язык, 295
                                    уроков</Text>
                                <Text style={styles.titleDetLessonCatTxt}>Изучайте английский язык увлекательно и
                                    легко, открывая дверь в мир знаний и игр!</Text>
                            </View>
                        </View>

                        <View style={styles.horizontalLine}/>

                        <View style={styles.infoDetCatTitle}>
                            <Image
                                source={require("../images/icon/audio-book.png")}
                                style={styles.courseDetCatImg}
                            />
                            <View style={styles.titleDetLessonCat}>
                                <Text style={styles.titleDetLessonCatSubject}>327 книг с аудио и субтитрами</Text>
                                <Text style={styles.titleDetLessonCatTxt}>
                                    Каждая книга — это волшебное путешествие с аудио и субтитрами, оживляющее
                                    истории для вас!
                                </Text>
                            </View>
                        </View>

                        <View style={styles.horizontalLine}/>

                        <View style={styles.infoDetCatTitle}>
                            <Image
                                source={require("../images/icon/flash-card.png")}
                                style={styles.courseDetCatImg}
                            />
                            <View style={styles.titleDetLessonCat}>
                                <Text style={styles.titleDetLessonCatSubject}>Flashcard: 557 уроков 5352 слов</Text>
                                <Text style={styles.titleDetLessonCatTxt}>Погрузитесь в магию ...</Text>
                            </View>
                        </View>
                    </View>
                    {/* 11111 */}
                    <TouchableOpacity
                        style={[globalCss.button, globalCss.mt8, btnNextSubscribe ? [globalCss.buttonPressed, globalCss.buttonPressedBlue] : globalCss.buttonBlue]}
                        onPress={() => setVisible(false)}
                        onPressIn={() => setbtnNextSubscribe(true)}
                        onPressOut={() => setbtnNextSubscribe(false)}
                        activeOpacity={1}
                    >
                        <Text style={globalCss.buttonText}>ПОДПИСАТЬСЯ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[globalCss.alignSelfCenter, globalCss.mt4]}
                                      onPress={() => setVisible(false)}>
                        <Text>
                            Больше не показывать
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalCourseContent: {
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '4%',
    },
    infoDetExtraCat: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: '6%',
        paddingLeft: '6%',
        paddingRight: '6%',
        paddingBottom: '6%',
        marginTop: '5%',
    },
    titleDetLessonCatTxt: {
        fontSize: 16,
        color: '#616161',
    },
    titleDetLessonCatSubject: {
        fontSize: 17.5,
        color: '#212121',
        fontWeight: "500",
        textTransform: 'uppercase',
    },
    titleDetLessonCat: {
        width: '62%',
        justifyContent: 'center',
        paddingLeft: '5%',
    },
    courseDetCatImg: {
        width: 57,
        height: 57,
        resizeMode: 'contain',
    },
    infoDetCatTitle: {
        flexDirection: 'row',
        marginBottom: '0'
    },
    horizontalLine: {
        width: '90%',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        marginVertical: '7%',
    },
})