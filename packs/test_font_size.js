import {Dimensions, Text, View} from "react-native";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";

export default function Test_font_size() {
    const deviceHeight = Dimensions.get("window").height

    return (
        <View style={{
            paddingTop: 100,
            padding: 50
        }}>
            <Text style={{
                backgroundColor: "#d30a0a",
                padding: 10,
                marginTop: 10,
                fontSize: RFValue(12)
            }}>Font 12 default</Text>
            <Text style={{
                backgroundColor: "#d30a0a",
                padding: 10,
                marginTop: 10,
                fontSize: RFValue(12, deviceHeight)
            }}>Font 12 by device height</Text>

            <Text style={{
                backgroundColor: "#d30a0a",
                padding: 10,
                marginTop: 10,
                fontSize: RFPercentage(2)
            }}>Font 1 percent</Text>
        </View>
    );
}
