import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'



export default function Menubar({ teamname, logout, setMenuOpen, setModule, openTeamStats }) {

    return (
        <View style={styles.modalView}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{teamname}</Text>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={() => {
                        setModule('Members')
                        setMenuOpen(false)
                    }}>
                        <Text style={styles.text}>Team members</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={() => {
                        setModule('Players')
                        setMenuOpen(false)
                    }}>
                        <Text style={styles.text}>Players</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={() => {
                        setModule('Games')
                        setMenuOpen(false)
                    }}>
                        <Text style={styles.text}>Games</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={() => {
                        openTeamStats()
                        setMenuOpen(false)
                    }}>
                        <Text style={styles.text}>Stats</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={() => {
                        logout()
                        setMenuOpen(false)
                    }}>
                        <Text style={styles.text}>Log out</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#1b2838',
        flex: 1
    },
    modalView: {
        flex: 1,
        maxWidth: '80%'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignSelf: "stretch",
        backgroundColor: '#1b2838',
    },
    button: {
        justifyContent: 'center',
        color: '#FFFFFF',
        minHeight: 50
    },
    text: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'left',
        paddingVertical: 10
    },
    header: {
        minHeight: 100,
        backgroundColor: '#2a475e',
        justifyContent: 'flex-end',
        paddingBottom: 20
    },
    title: {
        fontSize: 30,
        color: '#FFFFFF',
        textAlign: 'left'
    }
});