import { StyleSheet, SafeAreaView, Button, View, Text, TextInput, StatusBar, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Selector from './components/Selector';
import Menubar from './components/Menubar';
import Games from './components/Games';
import Players from './components/Players';
import Stats from './components/Stats';

axios.defaults.baseURL = 'http://75.102.64.40:3000'

/**
 * Color pallette
 * #171a21  dark gray
 * #66c0f4  light sky blue
 * #1b2838  dark mat gray with slight blue
 * #2a475e  lighter mat blue and gray
 * #c7d5e0  light gray
 */
export default function App() {

  const [teamname, onChangeTeamname] = useState()
  const [login, setLogin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [module, setModule] = useState(2)
  const [currentGame, setCurrentGame] = useState(null)

  useEffect(() => {

  }, [teamname, login])

  function selectGame(id) {
    setCurrentGame(id)
    setModule(2)
  }

  return (login ?
    <SafeAreaView style={styles.screen}>
      <StatusBar />
      <View style={{ position: 'relative', paddingVertical: 10, minHeight: 50 }}>
        <Text style={styles.title}>{teamname}</Text>
        <TouchableHighlight style={{ position: 'absolute', top: 10 }} onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name="menu" size={40} color='#FFFFFF' />
        </TouchableHighlight>
      </View>
      {/* Title (team name) */}
      {/* Menu bar */}
      {/* <Currentgame plays={['#1 service ace', '#2 serve receive dig']} /> */}
      {
        module === 0 ?
        <Stats teamname={teamname}/> :
        module === 1 ?
        <Players /> :
        module === 2 && currentGame ?
        <Selector currentGame={currentGame} /> : <Games selectGame={selectGame}/>
      }
      <Modal isVisible={menuOpen} animationIn='slideInLeft' animationOut='slideOutLeft' onBackdropPress={() => setMenuOpen(false)} backdropOpacity={0} style={{ margin: 0 }}>
        <Menubar teamname={teamname} setLogin={setLogin} setMenuOpen={setMenuOpen} setModule={setModule} />
      </Modal>
    </SafeAreaView> :
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TextInput style={styles.textBox} onChangeText={onChangeTeamname} multiline={true} placeholder='enter team name'></TextInput>
        <Button onPress={() => setLogin(true)} title="log in" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#1b2838',
    flex: 1
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 5,
    flexShrink: 1,
    position: 'relative'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: "stretch",
    marginHorizontal: 60
  },
  textBox: {
    textAlignVertical: 'center',
    backgroundColor: "white",
    marginBottom: 20,
    padding: 5
  }
});

