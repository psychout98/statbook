import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, Modal, TouchableHighlight, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseStats, statCodes } from '../statbook';


export default function Stats({ teamData, currentPlayer }) {

    const [currentStats, setCurrentStats] = useState(statCodes)

    useEffect(() => {
        axios({
            method: "POST",
            url: "/stats",
            data: {
                games: teamData.games.map(game => game._id),
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
    }, [teamData, currentPlayer])

    function buildStatList(stats) {
        return Object.keys(statCodes).map(code => {
            return `${stats[code]} ${statCodes[code]}`
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.statList}>
            <FlatList data={currentStats}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item}</Text>
                        </View>
                )}
            >
            </FlatList>
            </View>
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
    title: {
        fontSize: 20,
        flexShrink: 1
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
    }
});