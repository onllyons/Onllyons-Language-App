import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useAuth } from "../screens/ui/AuthProvider";
import globalCss from "../css/globalCss";

const Profile = () => {
  const { isAuthenticated, getUser, logout } = useAuth();
  const user = getUser();

  return (
  	<ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {isAuthenticated() ? (
        <View>
          <View style={styles.avatarContainer}>
            <View style={styles.userContainerImageBorder}>
              <Image
                source={
                  user.image === "default.png"
                    ? require("../images/other_images/userphoto.png")
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
                value={user.name}
                placeholder="Имя"
                editable={false}
              />
            </View>
            <Text style={styles.label}>Фамилия</Text>
            <View style={[styles.inputView, styles.inputContainer1]}>
              <TextInput
                style={globalCss.input}
                value={user.surname}
                placeholder="Фамилия"
                editable={false}
              />
            </View>
            <Text style={styles.label}>Имя пользователя</Text>
            <View style={[styles.inputView, styles.inputContainer1]}>
              <TextInput
                style={globalCss.input}
                value={user.username}
                placeholder="Имя пользователя"
                editable={false}
              />
            </View>
            <Text style={styles.label}>Уровень</Text>
            <View style={[styles.inputView, styles.inputContainer1]}>
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

            <Text style={styles.label}>Электронная почта</Text>
            <View style={[styles.inputView, styles.inputContainer1]}>
              <TextInput
                style={globalCss.input}
                value={user.email}
                placeholder="Электронная почта"
                editable={false}
              />
            </View>

            <Text style={styles.label}>Пароль</Text>
            <View style={[styles.inputView, styles.inputContainer1]}>
              <TextInput
                style={globalCss.input}
                value="**********"
                placeholder="Пароль"
                secureTextEntry
                editable={false}
              />
            </View>
          </View>
        </View>
      ) : (
        ""
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 20,
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
  inputContainer1: {
    borderTopWidth: 2.1,
    borderRadius: 14,
    paddingBottom: 17,
    paddingTop: 17,
    paddingRight: 12,
    marginBottom: 12,
  },
});

export default Profile;
