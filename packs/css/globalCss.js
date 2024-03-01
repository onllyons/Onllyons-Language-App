import {StyleSheet} from "react-native";

const globalCss = StyleSheet.create({
    NavTopStartApp: {},

    navBottomApp: {
        borderBottomLeftRadius: 30,
        backgroundColor: "red",
    },
    navImage: {
        alignSelf: "center",
        marginBottom: '10%', 
    },
    alignItemsCenter: {
        alignItems: "center",
    },
    alignSelfCenter: {
        alignSelf: "center",
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: "13%",
    },
    flex1: {
        flex: 1,
    },
    title: {
        color: "#494949",
        fontWeight: "700",
        fontSize: 33,
        marginBottom: 20,
    },
    bold700: {
        fontWeight: "700",
    },
    mb17: {
        marginBottom: "17%",
    },
    mb11: {
        marginBottom: "11%",
    },
    mb3: {
        marginBottom: "3%",
    },
    mt4: {
        marginTop: "4%",
    },
    mt8: {
        marginTop: "8%",
    },
    textAlignCenter: {
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignContent: "center",
    },
    link: {
        color: "#3ca6ff",
    },
    orange: {
        color: "#FF9600",
    },
    red: {
        color: "#ca3431",
    },
    gry: {
        color: "#636363",
    },
    whiteDarker: {
        color: "#bfbfbf",
    },
    white: {
        color: "#ffff",
    },
    green: {
        color: "#7ec81a",
    },
    blueLight: {
        color: "#8895bc",
    },
    blue: {
        color: "#1cb0f6",
    },
    bold: {
        fontWeight: "700",
    },
    input: {
        color: "#636363",
        fontSize: 17,
        flex: 1,
    },
    bigInput: {
        fontSize: 17,
        height: 150,
        width: "100%",
        textAlignVertical: 'top', // Выравнивание текста сверху
    },
    card: {
        width: "48%",
        marginBottom: "5%",
        paddingTop: 55,
        paddingBottom: 55,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2
    },
    bgGry: {
        backgroundColor: "#f9f9f9",
        borderColor: "#d8d8d8",
    },
    bgGreen: {
        backgroundColor: "#57cc04",
        borderColor: "transparent",
    },
    buttonRow: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: "center",
        borderRadius: 14,
        marginBottom: 20
    },
    button: {
        width: "100%",
        paddingVertical: "5%",
        paddingHorizontal: "10%",
        alignItems: "center",
        borderRadius: 14,
        marginBottom: "6%"
    },
    buttonPressed: {
        transform: [{translateY: 4}],
    },
    buttonBlue: {
        backgroundColor: "#1cb0f6"
    },
    buttonPurple: {
        backgroundColor: "#6949FF"
    },
    buttonWhite: {
        backgroundColor: "#ffffff"
    },
    buttonGry: {
        backgroundColor: "#f1f0f0"
    },
    buttonGry1: {
        backgroundColor: "#f3f3f3"
    },
    buttonGreen: {
        backgroundColor: "#57cc04",
    },
    buttonPressedBlue: {
        backgroundColor: "#1cb0f6",
    },
    buttonPressedPurple: {
        backgroundColor: "#6949FF",
    },
    buttonPressedWhite: {
        backgroundColor: "#ffffff",
    },
    buttonPressedGry: {
        backgroundColor: "#dbd9d8",
    },
    buttonPressedGreen: {
        backgroundColor: "#57cc04",
    },
    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
    },
    buttonTextblueLight: {
        color: "#8895bc",
        fontSize: 15,
        fontWeight: "600",
    },
    buttonTextGreen: {
        color: "#40b352",
        fontSize: 15,
        fontWeight: "600",
    },
    buttonTextBlack: {
        color: "#000",
        fontSize: 15,
        fontWeight: "600",
    },
    textUpercase: {
        textTransform: "uppercase",
    },
    modalContainerDropDown: {
        backgroundColor: "red",
        flex: 1,
        marginTop: "25%",
        maxHeight: "30%",
        alignItems: "center",
        justifyContent: "center",
    },
    // nav tab
    navTabUser: {
        width: "100%",
        zIndex: 4,
        overflow: "hidden",
        paddingTop: "10%",
        backgroundColor: "#ffffff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    itemNavTabUser: {
        flexDirection: "row",
        paddingTop: "5%",
        paddingBottom: "5%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },

    imageNavTop: {
        width: 28,
        height: 28,
        resizeMode: "contain",
    },
    dataNavTop: {
        fontSize: 16,
        color: "#383838",
        fontWeight: "700",
        marginLeft: "5%",
    },
    dataCategoryTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#383838",
    },

    itemNavTabUserBtnBack: {
        flexDirection: "row",
        paddingTop: "5%",
        paddingBottom: "5%",
        paddingLeft: "5%",
        minWidth: "18%",
    },
    itemNavTabUserTitleCat: {
        flexDirection: "row",
        paddingTop: "5%",
        paddingBottom: "5%",
        flex: 1,
    },
    modalSubscription: {
        height: "100%",
        backgroundColor: "#efefef",
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
    courseCatImg: {
        width: 130,
        height: 130,
        resizeMode: "contain",
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
    correct: {
        backgroundColor: "#81b344",
        color: "white",
    },
    incorrect: {
        backgroundColor: "#ca3431",
        color: "white",
    },
    hint: {
        backgroundColor: "#7d7d7da8",
    },
    incorrectTxt: {color: "white"},
    correctTxt: {color: "white"},

    boxInputView: {
        borderColor: "#e0e0e0",
        borderWidth: 2.1,
        borderRadius: 14,
    },
    inputBoxView:{
        color: "#636363",
        fontSize: 17,
        paddingVertical: 17,
        paddingHorizontal: 12,
        borderRadius: 14,
    },

});

export default globalCss;
