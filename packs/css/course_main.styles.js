import {StyleSheet} from "react-native";

export const stylesCourse_lesson = StyleSheet.create({
    container: {},
    bgCourse: {
        backgroundColor: "#ffffff",
    },
    card: {
        width: 70,
        height: 56,
        marginBottom: 20,
        borderRadius: 300,
        alignItems: "center",
        justifyContent: "center"
    },

    infoCourseSubject: {
        position: "absolute",
        top: "12%",
        left: "5%",
        right: "5%",
        width: "90%",
        height: 95,
        marginTop: "2%",
        flexDirection: "row",
        zIndex: 1,
    },
    bgGry: {
        backgroundColor: "#e5e5e5",
        shadowColor: "#b7b7b7",
    },
    contentFlashCards: {
        flexDirection: "column",
        // flexWrap: "wrap",
        // justifyContent: "center",
        // alignItems: "center",
        // alignContent: "center",
    },

    infoCourseTitle: {
        color: "white",
        fontSize: 19,
        width: "80%",
        marginLeft: "5%",
        textTransform: "uppercase",
        fontWeight: "600",
    },
    cardCategoryTitle: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center"
    },
    cardCategoryTitleContainer: {
        width: "73%",
        height: "100%",
    },
    infoCourseBtn: {
        width: "100%",
        height: "100%",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center"
    },
    infoCourseBtnContainer: {
        width: "27%",
        height: "100%" 
    },
    infoCourseTxtSubCat: {
        color: "#ffffff",
        fontSize: 15,
        width: "80%",
        marginLeft: "5%",
        textTransform: "uppercase",
        fontWeight: "700",
    },
    infoCategoryImg: {
        width: 35,
        height: 35,
        resizeMode: "contain",
        alignSelf: "center",
    },
    modal: {
        height: "73%",
        backgroundColor: "#efefef",
        borderRadius: 10,
    },
    modalCourseContent: {
        paddingLeft: "4%",
        paddingRight: "4%",
        paddingBottom: "4%",
    },
    closeModalCourse: {
        marginTop: "2%",
        padding: 10,
    },
    courseCatImg: {
        width: 130,
        height: 130,
        resizeMode: "contain",
    },
    infoCatTitle: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 25,
        paddingTop: "5%",
        paddingLeft: "2%",
        paddingRight: "5%",
        paddingBottom: "5%",
    },
    titleLessonCat: {
        width: "62%",
        justifyContent: "center",
        paddingLeft: "4%",
    },
    titleLessonCatTxt: {
        fontSize: 20,
        color: "#212121",
        fontWeight: "500",
    },
    titleLessonCatSubject: {
        fontSize: 16,
        color: "#6949FF",
    },
    courseDetCatImg: {
        width: 57,
        height: 57,
        resizeMode: "contain",
    },
    infoDetExtraCat: {
        backgroundColor: "white",
        borderRadius: 25,
        paddingTop: "6%",
        paddingLeft: "6%",
        paddingRight: "6%",
        paddingBottom: "6%",
        marginTop: "5%",
    },
    infoDetCatTitle: {
        flexDirection: "row",
        marginBottom: "0",
    },
    titleDetLessonCat: {
        width: "62%",
        justifyContent: "center",
        paddingLeft: "5%",
    },
    titleDetLessonCatSubject: {
        fontSize: 17.5,
        color: "#212121",
        fontWeight: "500",
        textTransform: "uppercase",
    },
    titleDetLessonCatTxt: {
        fontSize: 16,
        color: "#616161",
    },
    horizontalLine: {
        width: "90%",
        alignSelf: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        marginVertical: "7%",
    },
    headerModalCat: {
        flexDirection: "row",
    },
    headerTitleModalCat: {
        justifyContent: "center",
        alignSelf: "center",
    },
    headerTitleModalCatTxt: {
        fontSize: 18,
        color: "#212121",
        textTransform: "uppercase",
        alignSelf: "center",
        textAlign: "center",
        marginTop: "1%",
    },

    categoryTitleBg: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginVertical: "15%",
    },
    hrLine: {
        flex: 1,
        height: 2,
        backgroundColor: "#ababab",
        marginHorizontal: "4.5%",
    },
    categoryTitle: {
        maxWidth: "50%",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: "#ababab",
    },
    iconFlash: {
        color: "#ababab",
    },
    imgEndCourseView:{
        width: '100%',
        marginTop: -180,
        alignItems: 'flex-end',
    },

    imgEndCourse:{
        width: 120,
        height: 120,
        marginRight: '7%',
        resizeMode: "contain",
    },
    startImg: {
        width: 74,
        height: 55,
        resizeMode: "contain",
        alignSelf: "center",
    },
    elCourseImg: {
        width: 750,
        height: 220,
        position: "absolute",
        // right: 25,
        // top: 120,
        resizeMode: "contain",
        alignSelf: "center",
    },

    levelRoughly: {
        fontSize: 20,
        fontWeight: "500",
        color: "#007bff",
        marginBottom: 5,
        textAlign: "center",
    },
    messageRoughly: {
        fontSize: 16,
        fontStyle: "italic",
        textAlign: "center",
    },
    finishedCourseLesson: {
        backgroundColor: '#ffd700'
    },
    finishedCourseLessonIcon: {
        color: 'white'
    },
});



