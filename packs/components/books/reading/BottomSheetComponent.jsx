import React, {useCallback} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {StyleSheet, Switch, Text, View} from "react-native";

export const BottomSheetComponent = React.memo(({bottomSheetRef, finished, saved, handleFinish, handleBookmark}) => {
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={1}
            />
        ),
        []
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["25%", "50%", "90%"]}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            index={-1}
        >
            <BottomSheetView style={styles.contentBottomSheet}>
                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsIPA}>Пометить как прочитанное</Text>

                    <Switch
                        trackColor={{false: "#d1d1d1", true: "#4ADE80"}}
                        thumbColor={finished ? "#ffffff" : "#f4f3f4"}
                        disabled={finished}
                        ios_backgroundColor="#d1d1d1"
                        onValueChange={handleFinish}
                        value={finished}
                    />
                </View>

                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsIPA}>Добавить в закладки</Text>

                    <Switch
                        trackColor={{false: "#d1d1d1", true: "#4ADE80"}}
                        thumbColor={saved ? "#ffffff" : "#f4f3f4"}
                        ios_backgroundColor="#d1d1d1"
                        onValueChange={handleBookmark}
                        value={saved}
                    />
                </View>
            </BottomSheetView>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    contentBottomSheet: {
        height: "100%",
        flex: 1,
    },
    settingsGroup: {
        paddingHorizontal: 20,
        marginBottom: "2%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
    settingsIPA: {
        fontSize: 18,
        fontWeight: "500",
        color: "#343541",
        flex: 1,
    },
})