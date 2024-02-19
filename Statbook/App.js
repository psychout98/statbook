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

axios.defaults.baseURL = 'https://statbook-server-cde0e4e8f06d.herokuapp.com'

/**
 * Color pallette
 * #171a21  dark gray
 * #66c0f4  light sky blue
 * #1b2838  dark mat gray with slight blue
 * #2a475e  lighter mat blue and gray
 * #c7d5e0  light gray
 */
export default function App() {

  const [teamname, onChangeTeamname] = useState('')
  const [login, setLogin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [module, setModule] = useState('Games')
  const [currentGame, setCurrentGame] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [printLoginFail, setPrintLoginFail] = useState(false)

  useEffect(() => {
    if (currentGame) {
      const games = teamData.games
      games[teamData.games.findIndex(game => game._id === currentGame._id)] = currentGame
      setTeamData({
        ...teamData,
        games: games
      })
    }
  }, [currentGame])

  useEffect(() => {
    if (module !== '') {
      setCurrentGame(null)
    }
  }, [module])

  function handleLogin() {
    if (teamname.length > 0) {
      axios({
        method: "POST",
        url: "/team",
        params: {
          teamname: teamname
        }
      }).then((result) => {
        setTeamData(result.data)
        setLogin(true)
      }).catch((error) => {
        console.log(error)
      })
    } else {
      setPrintLoginFail(true)
    }
  }

  function selectGame(game) {
    setCurrentGame(game)
    setModule('')
  }

  function addGame(game) {
    setTeamData({
      ...teamData,
      games: [...teamData.games, game]
    })
    setCurrentGame(game)
    setModule('')
  }

  function handleNewPlayer(player) {
    setTeamData({
      ...teamData,
      players: [...teamData.players, player]
    })
  }

  function deleteGame() {
    const games = teamData.games
    games.splice(teamData.games.findIndex(game => game._id === currentGame._id), 1)
    setTeamData({
      ...teamData,
      games: games
    })
    setCurrentGame(null)
    setModule('Games')
  }

  function editPlayer(id, name) {
    const players = teamData.players
    players[players.findIndex(player => player._id === id)].name = name
    setTeamData({
      ...teamData,
      players: players
    })
  }

  function deletePlayer(id) {
    const players = teamData.players
    players.splice(players.findIndex(player => player._id === id), 1)
    setTeamData({
      ...teamData,
      players: players
    })
  }

  function selectPlayer(player) {
    setModule('Stats')
    setCurrentPlayer(player)
  }

  function openTeamStats() {
    setModule('Stats')
    setCurrentPlayer(null)
  }

  return (login && teamData ?
    <SafeAreaView style={styles.screen}>
      <StatusBar />
      <View style={{ position: 'relative', paddingVertical: 10, minHeight: 50 }}>
        <Text style={styles.title}>{`${currentPlayer ? currentPlayer.name : teamname} ${module}`}</Text>
        <TouchableHighlight style={{ position: 'absolute', top: 10 }} onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name="menu" size={40} color='#FFFFFF' />
        </TouchableHighlight>
      </View>
      {
        module === 'Stats' ?
          <Stats teamname={teamname} teamData={teamData} players={currentPlayer ? [currentPlayer._id] : teamData.players.map(player => player._id) } /> :
          module === 'Players' ?
            <Players teamid={teamData._id} players={teamData.players} handleNewPlayer={handleNewPlayer} editPlayer={editPlayer} deletePlayer={deletePlayer} selectPlayer={selectPlayer} /> :
            module === '' && currentGame ?
              <Selector currentGame={currentGame} setCurrentGame={setCurrentGame} players={teamData.players} deleteGame={deleteGame} /> :
              <Games teamid={teamData._id} games={teamData.games} selectGame={selectGame} addGame={addGame} />
      }
      <Modal isVisible={menuOpen} animationIn='slideInLeft' animationOut='slideOutLeft' onBackdropPress={() => setMenuOpen(false)} backdropOpacity={0} style={{ margin: 0 }}>
        <Menubar teamname={teamname} setLogin={setLogin} setMenuOpen={setMenuOpen} setModule={setModule} openTeamStats={openTeamStats} />
      </Modal>
    </SafeAreaView> :
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Volleyball Stat Tracker</Text>
        <TextInput style={styles.textBox} onChangeText={onChangeTeamname} placeholder='enter team name' />
        {printLoginFail ? <Text style={{ color: "#ff0000" }}>Please enter a valid team name</Text> : null}
        <Button onPress={handleLogin} title="log in" />
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
    marginVertical: 20,
    padding: 5
  }
});

