import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, Modal, TouchableHighlight, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Currentgame from './Currentgame';

const categories = ['Serve', 'Serve Receive', 'Defense', 'Spike', 'Block', 'Set']
const plays = {
    'Serve': ['Ace', 'Attempt', 'Error'],
    'Serve Receive': ['Dig', 'Attempt', 'Error'],
    'Defense': ['Dig', 'Attempt', 'Error'],
    'Spike': ['Kill', 'Attempt', 'Error'],
    'Block': ['Block', 'Touch', 'Error'],
    'Set': ['Assist', 'Dump', 'Error']
}

export default function Selector({ teamname, setPlays }) {

    const [players, setPlayers] = useState(['Harmon', 'Haas', 'Lam', 'Barton', 'Gordon', 'Ji', 'Patel', 'Davis', 'Lascek', 'Masua'])
    const [currentPlayer, setCurrentPlayer] = useState(players[0] || null)
    const [currentCategory, setCurrentCategory] = useState(null)
    const [history, setHistory] = useState([])

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <FlatList data={players}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <TouchableHighlight onPress={() => {
                            setCurrentPlayer(item)
                        }}>
                            <View style={{ ...styles.item, backgroundColor: (item === currentPlayer ? '#66c0f4' : '#c7d5e0') }}>
                                <Text style={styles.title}>{item}</Text>
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
                            <TouchableHighlight key={i} onPress={() => {
                                setCurrentCategory(null)
                                setHistory([...history, `${currentPlayer} ${currentCategory} ${play}`])
                            }}>
                                <View style={styles.button}>
                                    <Text>
                                        {play}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )
                    })
                    :
                    categories.map((category, i) => {
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
                <Text style={[styles.title, {color: '#FFFFFF'}]}>Gannon U Set 3</Text>
                <TouchableHighlight style={{ position: 'absolute', top: 5, left: 10 }}>
                    <Ionicons name="arrow-undo-outline" size={40} color='#FFFFFF' />
                </TouchableHighlight>
                <TouchableHighlight style={{ position: 'absolute', top: 5, right: 10 }}>
                    <Ionicons name="arrow-redo-outline" size={40} color='#FFFFFF' />
                </TouchableHighlight>
            </View>
            <Currentgame history={history} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    title: {
        fontSize: 20,
        flexShrink: 1,
        textAlign: 'center'
    },
    container: {
        flex: 6,
        backgroundColor: '#1b2838',
        color: '#fff'
    },
    bottom: {
        flex: 1,
        padding: 10,
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
    }
});