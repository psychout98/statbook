import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'
import SelectDropdown from 'react-native-select-dropdown';
import * as SecureStore from 'expo-secure-store';

export default function Games({ editor, teamid, games, selectGame, addGame }) {

    const [addingGame, setAddingGame] = useState(false)
    const [opponent, onChangeOpponent] = useState('')
    const [game, onChangeGame] = useState(1)
    const [set, onChangeSet] = useState(1)

    async function handleNewGame() {
        if (opponent.length > 0) {
            const token = await SecureStore.getItemAsync("token")
            axios({
                method: "POST",
                url: "/app/game",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: {
                    teamid: teamid,
                    opponent: opponent,
                    game: game,
                    set: set
                }
            }).then((result) => {
                addGame(result.data)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {editor ? <TouchableHighlight style={{ position: 'absolute', top: -45, right: 10 }} onPress={() => setAddingGame(true)}>
                <Ionicons name="add" size={40} color='#FFFFFF' />
            </TouchableHighlight> : null}
            {games?.length === 0 ? <Text style={styles.title}>Click + to create a game</Text> : null}
            <FlatList data={games}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View>
                        <TouchableHighlight onPress={editor ? () => {
                            selectGame(item)
                        } : null}>
                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>{`${item.opponent} Game ${item.game} Set ${item.set}`}</Text>
                                <Text style={styles.itemDate}>{new Date(item.date).toDateString()}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )}
            >
            </FlatList>
            <Modal isVisible={addingGame} onBackdropPress={() => setAddingGame(false)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Create a game</Text>
                    <TextInput style={styles.textBox} onChangeText={onChangeOpponent} placeholder='opponent name' />
                    <View style={styles.selector}>
                        <Text style={styles.title}>Game</Text>
                        <SelectDropdown data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} defaultButtonText={game} dropdownIconPosition='right'
                            renderDropdownIcon={isOpened => {
                                return <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} />
                            }} buttonStyle={styles.dropdownButton} onSelect={onChangeGame} />
                    </View>
                    <View style={styles.selector}>
                        <Text style={styles.title}>Set</Text>
                        <SelectDropdown data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} defaultButtonText={set} dropdownIconPosition='right'
                            renderDropdownIcon={isOpened => {
                                return <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} />
                            }} buttonStyle={styles.dropdownButton} onSelect={(selectedItem) => onChangeSet(selectedItem)} />
                    </View>
                    <TouchableHighlight onPress={handleNewGame}>
                        <Text style={styles.title}>Create game</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#c7d5e0',
        padding: 10,
        marginBottom: 3,
        flexDirection: 'column'
    },
    itemTitle: {
        flex: 1,
        fontSize: 20,
        color: '#000000'
    },
    itemDate: {
        flex: 1,
        fontSize: 14,
        color: '#000000'
    },
    title: {
        fontSize: 20,
        flexShrink: 1,
        textAlign: 'center',
        color: '#ffffff'
    },
    container: {
        flex: 3,
        backgroundColor: '#1b2838',
        color: '#fff',
        position: 'relative'
    },
    modalView: {
        flex: 1,
        backgroundColor: '#2a475e',
        borderRadius: 20,
        maxHeight: 300,
        maxWidth: 400,
        alignItems: 'center',
        padding: 20
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
    },
    textBox: {
        textAlignVertical: 'center',
        backgroundColor: "white",
        marginTop: 20,
        marginBottom: 20,
        padding: 5,
        minWidth: '80%',
        borderRadius: 8,
        fontSize: 18,
        textAlign: 'center'
    },
    dropdownButton: {
        borderRadius: 8,
        maxWidth: '25%',
        maxHeight: '60%'
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 10
    }
});