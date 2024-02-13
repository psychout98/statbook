import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, Modal, TouchableHighlight, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Axios from 'axios';


export default function Stats({ teamname }) {
    return (
        <SafeAreaView style={styles.container}>
            <Text>This where the stats go</Text>
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