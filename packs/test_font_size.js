import {Text, View} from "react-native";
import {getFontSize} from "./utils/Utls";

export default function Test_font_size() {
    return (
        <View style={{
            paddingTop: 100,
            padding: 50
        }}>
            <Text style={{
                backgroundColor: "#d30a0a",
                padding: 10,
                marginTop: 10,
                fontSize: getFontSize(12)
            }}>Font 12</Text>
            <Text style={{
                backgroundColor: "#d30a0a",
                padding: 10,
                marginTop: 10,
                fontSize: getFontSize(20)
            }}>Font 20</Text>
        </View>
    );
}
