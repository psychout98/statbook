import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, TouchableHighlight, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseStats, statCodes } from '../statbook';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'


export default function Stats({ teamData, currentPlayer }) {

    const [currentStats, setCurrentStats] = useState(statCodes)
    const [openSettings, setOpenSettings] = useState(false)
    const [games, setGames] = useState(teamData.games.map(game => game._id))

    useEffect(() => {
        if (games.length > 0) {
            axios({
                method: "POST",
                url: "/stats",
                data: {
                    games: games,
                    players: [currentPlayer._id]
                }
            }).then((result) => {
                const playerStats = result.data.find(stat => stat.playerid === currentPlayer._id)
                if (playerStats) {
                    setCurrentStats(buildStatList(playerStats))
                } else {
                    setCurrentStats(buildStatList(baseStats))
                }
            }).catch((error) => {
                console.log(error)
            })
        } else {
            setCurrentStats(buildStatList(baseStats))
        }
    }, [games])

    function buildStatList(stats) {
        return Object.keys(statCodes).map(code => {
            return `${stats[code]} ${statCodes[code]}`
        })
    }

    function toggleGame(gameid) {
        const index = games.findIndex(id => id === gameid)
        if (index >= 0) {
            const tempGames = [...games]
            tempGames.splice(index, 1)
            setGames(tempGames)
        } else {
            setGames([...games, gameid])
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableHighlight style={{ position: 'absolute', top: -40, right: 15 }} onPress={() => setOpenSettings(true)}>
                <Ionicons name="settings-sharp" size={30} color='#FFFFFF' />
            </TouchableHighlight>
            <View style={styles.statList}>
                <FlatList data={currentStats}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>{item}</Text>
                        </View>
                    )}
                >
                </FlatList>
            </View>
            <Modal isVisible={openSettings} onBackdropPress={() => setOpenSettings(false)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                <View style={{ ...styles.modalView, maxHeight: '35%', justifyContent: 'center', gap: 30 }}>
                    <Text style={{ ...styles.title, marginTop: 15 }}>Filter games</Text>
                    <FlatList data={teamData.games}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableHighlight onPress={() => {
                                    toggleGame(item._id)
                                }}>
                                    <View style={styles.menuItem}>
                                        {games.includes(item._id) ? <Ionicons style={{ position: 'absolute', right: 10, top: 10 }} name="checkmark-sharp" size={30} color='#1b2838' /> : null}
                                        <Text style={styles.menuItemTitle}>{`${item.opponent} Game ${item.game} Set ${item.set}`}</Text>
                                        <Text style={styles.itemDate}>{new Date(item.date).toDateString()}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        )}
                    >
                    </FlatList>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    statList: {
        flex: 1
    },
    item: {
        backgroundColor: '#c7d5e0',
        padding: 10,
        marginBottom: 3,
        flexDirection: 'row'
    },
    menuItem: {
        backgroundColor: '#c7d5e0',
        padding: 10,
        marginBottom: 3,
        minWidth: '90%'
    },
    itemTitle: {
        flex: 1,
        fontSize: 20,
        color: '#000000'
    },
    menuItemTitle: {
        flex: 1,
        fontSize: 16,
        color: '#000000'
    },
    itemDate: {
        flex: 1,
        fontSize: 12,
        color: '#000000'
    },
    title: {
        fontSize: 20,
        flexShrink: 1,
        color: '#ffffff'
    },
    container: {
        flex: 3,
        flexDirection: 'row',
        backgroundColor: '#1b2838',
        color: '#fff'
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
    modalView: {
        flex: 1,
        backgroundColor: '#2a475e',
        borderRadius: 20,
        maxHeight: '50%',
        maxWidth: '80%',
        minWidth: '80%',
        alignItems: 'center',
        padding: 5
    }
});