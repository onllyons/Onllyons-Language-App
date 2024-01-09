import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


import { useAuth } from "./screens/ui/AuthProvider";
import globalCss from './css/globalCss';

export default function MenuScreen({ navigation }) {
  const { isAuthenticated, getUser, logout } = useAuth();
    const user = getUser();

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

          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>


          
        </LinearGradient>
      ) : (
        ""
      )}

    <View style={styles.sectionMenuUrl}>
      <Text style={styles.headerText}>Setări</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cont</Text>

        <View style={styles.sectionMenu}>
          <TouchableOpacity style={styles.btnMenuProfile} onPress={() => navigation.navigate('FirstMenu')}>
            <Text style={styles.btnText}>Preferințe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMenuProfile} onPress={() => navigation.navigate('SecondMenuScreen')}>
            <Text style={styles.btnText}>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMenuProfile}>
            <Text style={styles.btnText}>Notificări</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMenuProfile}>
            <Text style={styles.btnText}>Duolingo for Schools</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abonament</Text>
        <View style={styles.sectionMenu}>
          <TouchableOpacity style={styles.btnMenuProfile}>
            <Text style={styles.btnText}>Alege un plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMenuProfile}>
            <Text style={styles.btnText}>RESTABILEȘTE ABONAMENTUL</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asistență</Text>
        <View style={styles.sectionMenu}>
          <TouchableOpacity style={styles.btnMenuProfile}>
            <Text style={styles.btnText}>Centru de ajutor</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.exitButton}
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
        >
          <Text style={styles.btnText}>Ieșire din cont</Text>
        </TouchableOpacity>


        </View>
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
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
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
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  exitButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  userInfoContainer: {
    paddingTop: '15%',
    paddingHorizontal: 20,
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
});
