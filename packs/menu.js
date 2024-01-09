import React, { useState } from 'react';
import { StyleSheet, ScrollView, Linking, View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from "./screens/ui/AuthProvider";
import globalCss from './css/globalCss';

export default function MenuScreen({ navigation }) {
  const { isAuthenticated, getUser, logout } = useAuth();
  const user = getUser();
  const [BtnLoggOut, setBtnLoggOut] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {isAuthenticated() ? (
      <LinearGradient
        colors={['#539cff', '#539cff', '#539cff']}
        useAngle
        angle={45}
        angleCenter={{ x: 0.5, y: 0.5 }}
        locations={[0, 0.5, 1]}
        style={styles.userInfoContainer}
      >
          <View style={styles.userContainerImageBorder}>
            <View style={styles.userContainerImage}>
              <Image
                source={
                  user.image === 'default.png'
                    ? require('./images/other_images/userphoto.png')
                    : { uri: `https://www.language.onllyons.com/ru/ru-en/dist/images/user-images/${user.image}` }
                }
                style={styles.userImage}
              />
            </View>
          </View>

          <LinearGradient
            colors={['#2adadd', '#1dd3e6', '#0ec3eb']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientBackground}
          >
            <Text style={styles.levelUser}>
              {user.level === 0 ? 'Beginner' :
              user.level === 1 ? 'Intermediate' :
              user.level === 2 ? 'Advanced' : 
              'Unknown Level'}
            </Text>
          </LinearGradient>

          {/*<Text style={styles.username}>{user.username}</Text>*/}
          {/*<Text style={styles.email}>{user.email}</Text>*/}
          <View style={styles.gameRating}>
            <Text style={styles.gameRatingTxt}>1536</Text>
            <View style={styles.gameRatingIcon}><FontAwesomeIcon icon={faStar} size={19} style={styles.icongameRating} /></View>
          </View>


          
        </LinearGradient>
      ) : (
        ""
      )}

    <View style={styles.sectionMenuUrl}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мой профиль</Text>

        <View style={styles.sectionMenu}>
          <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]} onPress={() => navigation.navigate('UserData')}>
            <Text style={styles.btnText}>Профиль</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBBR]} onPress={() => navigation.navigate('UserSettings')}>
            <Text style={styles.btnText}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Подписка</Text>
        <View style={styles.sectionMenu}>
          <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]} onPress={() => navigation.navigate('UserSubscriptionChoose')}>
            <Text style={styles.btnText}>Выберите план</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnMenuProfile, styles.btnBBR]} onPress={() => navigation.navigate('UserSubscriptionManage')}>
            <Text style={styles.btnText}>Управление подпиской</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Общая информация</Text>
        <View style={styles.sectionMenu}>
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


        <TouchableOpacity
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

          style={[globalCss.button, styles.buttonOut, BtnLoggOut ? [globalCss.buttonPressed, globalCss.bgGry] : globalCss.bgGry]}
        onPressIn={() => setBtnLoggOut(true)}
        onPressOut={() => setBtnLoggOut(false)}
        activeOpacity={1}>
          <Text style={styles.btnText}>Выйти</Text>
        </TouchableOpacity>

      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#ffffff',
  },
  sectionMenuUrl:{
    padding: 20,
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
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 0,
    shadowColor: '#d8d8d8',
  },
  btnMenuProfile: {
    backgroundColor: 'white',
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    alignItems: 'flex-start',
  },
  btnBB: {
    borderBottomWidth: 2,
    borderColor: '#d8d8d8',
    shadowColor: '#d8d8d8',
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonOut:{
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
    paddingTop: '15%',
    paddingBottom: '10%',
    backgroundColor: '#539cff'
  },
  username: {
    fontSize: 16,
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
  levelUser: {
    fontSize: 18,
    color: 'white'
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  gameRating:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '4%'
  },
  gameRatingIcon:{
    backgroundColor: '#fdb652',
    borderRadius: 50,
    padding: 5,
    marginLeft: '2.5%'
  },
  gameRatingTxt:{
    color: '#fdfe5b',
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
  },
  icongameRating:{
    color: 'white',
  },
  userContainerImageBorder:{
    width: 300,
    height: 300,
    backgroundColor: '#5ca1ff',
    alignSelf: 'center',
    borderRadius: 1000,
    padding: 35,
  },
  userContainerImage:{
    borderRadius: 1000,
    padding: 18,
    backgroundColor: '#63a5ff',
  },
  userImage:{
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  btnBTR:{
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  btnBBR:{
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});





