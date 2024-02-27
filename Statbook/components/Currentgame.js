import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'


export default function Currentgame({ history }) {
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList data={[...history].reverse()}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item}</Text>
                        </View>
                )}
            >
            </FlatList>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#c7d5e0',
        padding: 10,
        marginBottom: 3,
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
        flexShrink: 1
    },
    container: {
        flex: 3,
        backgroundColor: '#1b2838',
        color: '#fff',
        position: 'relative'
    },
    bottom: {
        backgroundColor: '#FFFFFF',
        padding: 10
    },
    index: {
        fontSize: 10
    },
    thumbnail: {
        width: 100,
        height: 100,
        marginRight: 10
    }
});