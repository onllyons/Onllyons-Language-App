import {StyleSheet} from "react-native";

export const menuStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    navTabUser: {
        width: "100%",
        marginTop: "8%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: '#d8d8d8',
    },
    navTabUserMain:{
        flex: 1,
        paddingVertical: '5%',
    },
    navTabUserSettings:{
        width: '15%',
        paddingTop: '5%',
        paddingBottom: '4%',
        alignItems: 'center',
    },
    navTabUserSettingsTxt:{
    },
    navTabUserMainTxt:{
        textAlign: 'center',
        marginLeft: '15%',
        fontWeight: '700',
        color: '#555555',
        fontSize: 22,
    },
    cardProfile: {
        width: "100%",
        flexDirection: "row",
        paddingTop: '5%',
        
    },
    cardProfileInfo:{
        flex: 1,
        paddingLeft: '5%',
    },
    userImage: {
        width: 90,
        height: 90,
        borderRadius: 1000,
    },
    cardProfilePhoto:{
        width: '28%',
        // backgroundColor: 'green',
    },
    nameSurname:{
        fontWeight: '700',
        color: '#343434',
        fontSize: 25,
        marginTop: '4%',
        
    },
    username: {
        color: '#555555',
        fontWeight: '500',
        fontSize: 20,
    },
    levelUser: {
        fontSize: 18,
        color: '#555555',
    },
    levelUserTag:{
        // backgroundColor: 'red',
    },
    levelSubscription:{
        borderBottomWidth: 2,
        borderBottomColor: '#d8d8d8',
        
    },
    levelSubscriptionBtn:{
        width: '90%',
        marginTop: '7%',
        marginBottom: '8%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: '#d8d8d8',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingVertical: '3%',
        paddingHorizontal: '3%',
    },
    levelSubscriptionName:{
        fontWeight: '600',
        fontSize: 23,
        color: '#3a3a3a',
        textTransform: 'uppercase'
    },
    diamondProfile:{
        width: 30,
        height: 30,
        marginRight: '2%',
        resizeMode: 'contain'
    },
    sectionMenuUrl: {
        padding: '5%',
    },
    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'grey',
        marginBottom: 5,
    },
    sectionMenu: {
        backgroundColor: '#ffffff',
        borderColor: '#d8d8d8',
        borderWidth: 2,
        borderRadius: 12
    },
    btnMenuProfile: {
        backgroundColor: 'white',
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        alignItems: 'flex-start',
    },
    btnBB: {
        borderBottomWidth: 2,
        borderColor: '#d8d8d8'
    },
    buttonOut: {
        marginTop: '4%',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    userInfoContainer: {
    },

    email: {
        fontSize: 16,
    },
    gradientBackground: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        marginTop: -80,
        padding: 8,
    },

    exitButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    gameRating: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '4%'
    },
    gameRatingIcon: {
        backgroundColor: '#fdb652',
        borderRadius: 50,
        padding: 5,
        marginLeft: '2.5%'
    },
    gameRatingTxt: {
        color: '#fdfe5b',
        fontSize: 20,
        fontWeight: '700',
        alignSelf: 'center',
    },
    icongameRating: {
        color: 'white',
    },
    userContainerImageBorder: {
        width: 300,
        height: 300,
        backgroundColor: '#5ca1ff',
        alignSelf: 'center',
        borderRadius: 1000,
        padding: 35,
    },
    userContainerImage: {
        borderRadius: 1000,
        padding: 18,
        backgroundColor: '#63a5ff',
    },

    btnBTR: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    btnBBR: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
});



