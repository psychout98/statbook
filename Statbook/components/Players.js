import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'
import * as SecureStore from 'expo-secure-store';


export default function Players({ editor, teamid, players, handleNewPlayer, editPlayer, deletePlayer, selectPlayer }) {

    const [addingPlayer, setAddingPlayer] = useState(false)
    const [name, onChangeName] = useState('')
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [editMenu, setEditMenu] = useState(false)

    useEffect(() => {
        if (currentPlayer === null) {
            setEditMenu(false)
            setDeleting(false)
        }
    }, [currentPlayer])

    async function handleAddPlayer() {
        if (name.length > 0) {
            const token = await SecureStore.getItemAsync("token")
            axios({
                method: "POST",
                url: "/app/player",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: {
                    teamid: teamid,
                    playername: name
                }
            }).then((result) => {
                handleNewPlayer({
                    _id: result.data,
                    name: name,
                    teamid: teamid
                })
                setAddingPlayer(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    async function handleEditPlayer() {
        if (name !== currentPlayer.name && name.length > 0) {
            const token = await SecureStore.getItemAsync("token")
            axios({
                method: "PUT",
                url: "/app/player",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: {
                    playerid: currentPlayer._id,
                    name: name
                }
            }).then((result) => {
                if (result.data) {
                    editPlayer(currentPlayer._id, name)
                }
                setCurrentPlayer(null)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    async function handleDeletePlayer() {
        if (deleting) {
            const token = await SecureStore.getItemAsync("token")
            axios({
                method: "DELETE",
                url: "/app/player",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: {
                    playerid: currentPlayer._id
                }
            }).then((result) => {
                if (result.data) {
                    deletePlayer(currentPlayer._id)
                }
                setCurrentPlayer(null)
            })
        } else {
            setDeleting(true)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {editor ? <TouchableHighlight style={{ position: 'absolute', top: -45, right: 10 }} onPress={() => setAddingPlayer(true)}>
                <Ionicons name="add" size={40} color='#FFFFFF' />
            </TouchableHighlight> : null}
            {players.length === 0 ? <Text style={styles.title}>Click + to create a player</Text> : null}
            <FlatList data={players}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableHighlight onPress={() => {
                        setCurrentPlayer(item)
                        onChangeName(item.name)
                    }}>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            >
            </FlatList>
            <Modal isVisible={addingPlayer} onBackdropPress={() => setAddingPlayer(false)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Add a player</Text>
                    <TextInput style={styles.textBox} onChangeText={onChangeName} placeholder='player name' />
                    <TouchableHighlight onPress={handleAddPlayer}>
                        <Text style={styles.title}>Add</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
            <Modal isVisible={currentPlayer !== null} onBackdropPress={() => setCurrentPlayer(null)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                {editMenu && editor ?
                    <View style={{ ...styles.modalView }}>
                        <Text style={styles.title}>Edit player</Text>
                        <TextInput style={styles.textBox} onChangeText={onChangeName} defaultValue={name} />
                        <TouchableHighlight onPress={handleEditPlayer}>
                            <Text style={styles.title}>Confirm changes</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={handleDeletePlayer}>
                            <Text style={styles.delete}>{deleting ? 'Confirm delete' : 'Delete player'}</Text>
                        </TouchableHighlight>
                    </View> :
                    <View style={{ ...styles.modalView, justifyContent: 'center', gap: 30 }}>
                        <Text style={styles.title}>{currentPlayer?.name}</Text>
                        {editor ? <TouchableHighlight onPress={() => setEditMenu(true)}>
                            <Text style={styles.title}>Edit player</Text>
                        </TouchableHighlight> : null}
                        <TouchableHighlight onPress={() => selectPlayer(currentPlayer)}>
                            <Text style={styles.title}>View stats</Text>
                        </TouchableHighlight>
                    </View>
                }
            </Modal>
        </SafeAreaView >
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
        maxHeight: 200,
        maxWidth: 300,
        minWidth: 300,
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
        marginBottom: 20
    },
    delete: {
        fontSize: 20,
        flexShrink: 1,
        textAlign: 'center',
        color: '#FF0000',
        marginVertical: 10
    }
});