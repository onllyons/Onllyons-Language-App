import React, {useState} from 'react';
import globalCss from '../css/globalCss';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import Loader from "../components/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export default function UserProfile({navigation}) {
    const [loading, setLoading] = useState(false)

    const handleCancelSubscribe = () => {
        setLoading(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/checkout/cancel_subscription.php`,
            {},
            navigation
        )
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                setTimeout(() => setLoading(false), 1)
            })
    }
 
    return (
        <View style={styles.container}>
            <Loader visible={loading}/>

            <View style={globalCss.navTabUser}>
                <TouchableOpacity style={globalCss.itemNavTabUserBtnBack} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>Управление подпиской</Text>
                </View>
            </View>


            <ScrollView 
                contentContainerStyle={{paddingBottom: 100,}}
                style={styles.containerContent}
            >
                <View style={styles.containerTable}>
                  <Text style={styles.header}>История</Text>
                  <View style={styles.table}>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellBold}>Type</Text>
                      <Text style={styles.tableCellBold}>Start</Text>
                      <Text style={styles.tableCellBold}>End</Text>
                      <Text style={styles.tableCellBold}>Status</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Basic</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>False</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Basic</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>False</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Basic</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>False</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Basic</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>False</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Pro</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>

                    <View style={styles.bbr}>
                      <Text style={styles.tableCell}>Basic</Text>
                      <Text style={styles.tableCell}>12.04.2024</Text>
                      <Text style={styles.tableCell}>25.05.2024</Text>
                      <Text style={styles.tableCell}>Succes</Text>
                    </View>
                  </View>
                </View>





                <AnimatedButtonShadow
                    styleButton={[globalCss.button, globalCss.buttonGreen]}
                    shadowColor={"green"}
                    onPress={handleCancelSubscribe}>
                    <Text style={globalCss.buttonText}>Отменить подписку</Text>
                </AnimatedButtonShadow>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  containerContent: {
    padding: "5%",
  },
  containerTable: {
    marginBottom: "8%",
  },
  header: {
    fontSize: 20,
    color: '#494949',
    fontWeight: '500',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderRadius: "11%",
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    paddingLeft: "2%",
    paddingRight: "0%",
    paddingTop: "4%",
    paddingBottom: "4%",
  },
  tableCellBold: {
    flex: 1,
    paddingLeft: "2%",
    paddingRight: "0%",
    paddingTop: "4%",
    paddingBottom: "4%",
  },
  bbr: {
    borderBottomLeftRadius: "11%",
    borderBottomRightRadius: "11%",
    flexDirection: 'row',
  },

});
