import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Currentgame from './Currentgame';
import { plays, playCodes } from '../statbook';
import Modal from 'react-native-modal'
import SelectDropdown from 'react-native-select-dropdown';

export default function Selector({ currentGame, setCurrentGame, players, deleteGame }) {

    const [currentPlayer, setCurrentPlayer] = useState(players[0] || null)
    const [currentCategory, setCurrentCategory] = useState(null)
    const [undos, setUndos] = useState([])
    const [openSettings, setOpenSettings] = useState(false)
    const [opponent, onChangeOpponent] = useState(currentGame.opponent)
    const [game, onChangeGame] = useState(currentGame.game)
    const [set, onChangeSet] = useState(currentGame.set)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {

    }, [currentGame])

    function handlePlay(code) {
        axios({
            method: "PUT",
            url: "/play",
            params: {
                playerid: currentPlayer._id,
                gameid: currentGame._id,
                play1: code,
                play2: playCodes[code].play2
            }
        }).then((result) => {
            setCurrentGame(result.data)
            setUndos([])
            setCurrentCategory(null)
        }).catch((error) => {
            console.log(error)
        })
    }

    function handleUndo() {
        if (currentGame.history.length > 0) {
            const lastPlay = currentGame.history.pop()
            axios({
                method: "PUT",
                url: "/undo",
                params: {
                    gameid: currentGame._id
                },
                data: {
                    lastPlay: lastPlay
                }
            }).then((result) => {
                setCurrentGame(result.data)
                setUndos([...undos, lastPlay])
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    function handleRedo() {
        if (undos.length > 0) {
            const lastUndo = undos.pop()
            axios({
                method: "PUT",
                url: "/redo",
                params: {
                    gameid: currentGame._id
                },
                data: {
                    lastUndo: lastUndo
                }
            }).then((result) => {
                setCurrentGame(result.data)
                setUndos(undos)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    function handleEditGame() {
        if (opponent !== currentGame.opponent || game !== currentGame.game || set !== currentGame.set) {
            axios({
                method: "PUT",
                url: "/game",
                params: {
                    gameid: currentGame._id,
                    opponent: opponent,
                    game: game,
                    set: set
                }
            }).then((result) => {
                if (result.data) {
                    setCurrentGame({
                        ...currentGame,
                        opponent: opponent,
                        game: game,
                        set: set
                    })
                }
                setOpenSettings(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    function handleDeleteGame() {
        if (deleting) {
            axios({
                method: "DELETE",
                url: "/game",
                params: {
                    gameid: currentGame._id
                }
            }).then((result) => {
                if (result.data) {
                    setDeleting(false)
                    deleteGame()
                }
                setOpenSettings(false)
            }).catch((error) => {
                console.log(error)
            })
        } else {
            setDeleting(true)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableHighlight style={{ position: 'absolute', top: -40, right: 15 }} onPress={() => setOpenSettings(true)}>
                <Ionicons name="settings-sharp" size={30} color='#FFFFFF' />
            </TouchableHighlight>
            <SafeAreaView style={styles.container}>
                <FlatList data={players}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <TouchableHighlight onPress={() => {
                            setCurrentPlayer(item)
                        }}>
                            <View style={{ ...styles.item, backgroundColor: (item === currentPlayer ? '#66c0f4' : '#c7d5e0') }}>
                                <Text style={styles.titleBlack}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                >
                </FlatList>
            </SafeAreaView>
            <View style={styles.row}>
                {currentCategory ?
                    plays[currentCategory].map((play, i) => {
                        return (
                            <TouchableHighlight key={i} onPress={() => handlePlay(play.code)}>
                                <View style={styles.button}>
                                    <Text>
                                        {play.short}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )
                    })
                    :
                    Object.keys(plays).map((category, i) => {
                        return (
                            <TouchableHighlight key={i} onPress={() => { setCurrentCategory(category) }} >
                                <View style={styles.button}>
                                    <Text>
                                        {category}
                                    </Text>
                                </View></TouchableHighlight>
                        )
                    })}
            </View>
            <View style={styles.bottom}>
                <Text style={styles.titleWhite}>{currentGame.opponent}</Text>
                <Text style={styles.gameSet}>{`Game ${currentGame.game}\tSet ${currentGame.set}`}</Text>
                <TouchableHighlight style={{ position: 'absolute', top: 5, left: 10 }} onPress={handleUndo}>
                    <Ionicons name="arrow-undo-outline" size={40} color='#FFFFFF' />
                </TouchableHighlight>
                <TouchableHighlight style={{ position: 'absolute', top: 5, right: 10 }} onPress={handleRedo}>
                    <Ionicons name="arrow-redo-outline" size={40} color='#FFFFFF' />
                </TouchableHighlight>
            </View>
            <Currentgame history={currentGame.history.map(item => {
                return `${players.find(player => player._id === item.playerid)?.name} ${playCodes[item.play1].title}`
            })} />
            <Modal isVisible={openSettings} onBackdropPress={() => setOpenSettings(false)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                <View style={styles.modalView}>
                    <Text style={styles.titleWhite}>Game settings</Text>
                    <TextInput style={styles.textBox} onChangeText={onChangeOpponent} defaultValue={opponent} />
                    <View style={styles.selector}>
                        <Text style={styles.titleWhite}>Game</Text>
                        <SelectDropdown data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} defaultButtonText={game} dropdownIconPosition='right'
                            renderDropdownIcon={isOpened => {
                                return <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} />
                            }} buttonStyle={styles.dropdownButton} onSelect={(selectedItem) => onChangeGame(selectedItem)} />
                    </View>
                    <View style={styles.selector}>
                        <Text style={styles.titleWhite}>Set</Text>
                        <SelectDropdown data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} defaultButtonText={set} dropdownIconPosition='right'
                            renderDropdownIcon={isOpened => {
                                return <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} />
                            }} buttonStyle={styles.dropdownButton} onSelect={(selectedItem) => onChangeSet(selectedItem)} />
                    </View>
                    <TouchableHighlight onPress={handleEditGame}>
                        <Text style={styles.titleWhite}>Confirm changes</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={handleDeleteGame}>
                        <Text style={styles.delete}>{deleting ? 'Confirm delete' : 'Delete game'}</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    dropdownButton: {
        borderRadius: 8,
        maxWidth: '25%',
        maxHeight: '60%'
    },
    row: {
        flex: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        padding: 5
    },
    button: {
        minWidth: '32%',
        minHeight: '48%',
        borderRadius: 10,
        backgroundColor: '#c7d5e0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        padding: 10,
        marginBottom: 3,
        flexDirection: 'row'
    },
    titleBlack: {
        fontSize: 20,
        flexShrink: 1,
        textAlign: 'center'
    },
    delete: {
        fontSize: 20,
        flexShrink: 1,
        textAlign: 'center',
        color: '#FF0000',
        marginVertical: 10
    },
    titleWhite: {
        fontSize: 20,
        flexShrink: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    gameSet: {
        fontSize: 14,
        flexShrink: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    container: {
        flex: 6,
        backgroundColor: '#1b2838',
        color: '#fff'
    },
    bottom: {
        flex: 1,
        padding: 3,
        position: 'relative',
        backgroundColor: '#1b2838'
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
        marginVertical: 10,
        padding: 5,
        minWidth: '80%',
        borderRadius: 8,
        fontSize: 18,
        textAlign: 'center'
    },
    modalView: {
        flex: 1,
        backgroundColor: '#2a475e',
        borderRadius: 20,
        maxHeight: '50%',
        maxWidth: '80%',
        minWidth: '80%',
        alignItems: 'center',
        padding: 20
    }
});