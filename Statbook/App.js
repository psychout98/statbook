import { StyleSheet, SafeAreaView, Button, View, Text, TextInput, StatusBar, TouchableHighlight, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from 'react-native-modal'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Selector from './components/Selector';
import Menubar from './components/Menubar';
import Games from './components/Games';
import Players from './components/Players';
import Stats from './components/Stats';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking'
import Members from './components/Members';

axios.defaults.baseURL = 'https://statbook-server-2-44b2c841f80c.herokuapp.com/api/v2'

export default function App() {

  const [username, onChangeUsername] = useState('')
  const [password1, onChangePassword1] = useState('')
  const [password2, onChangePassword2] = useState('')
  const [newAccount, setNewAccount] = useState(false)
  const [newTeam, setNewTeam] = useState(true)
  const [teamname, onChangeTeamname] = useState('')
  const [joinCode, onChangeJoinCode] = useState('')
  const [login, setLogin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [module, setModule] = useState('Games')
  const [currentGame, setCurrentGame] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [loginError, setLoginError] = useState(null)
  const [editor, setEditor] = useState(true)

  const url = Linking.useURL()

  useEffect(() => {
    SecureStore.getItemAsync("username")
      .then((localUsername) => {
        if (localUsername) {
          SecureStore.getItemAsync("password")
            .then((localPassword) => {
              if (localPassword) {
                onChangeUsername(localUsername)
                onChangePassword1(localPassword)
                handleButton1(localUsername, localPassword)
              }
            })
        }
      })
  }, [])

  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url)
      if (queryParams && queryParams.teamname && queryParams.joinCode) {
        setNewTeam(false)
        onChangeTeamname(queryParams.teamname)
        onChangeJoinCode(queryParams.joinCode)
      }
    }
  }, [url])

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
    if (module !== 'Stats') {
      setCurrentPlayer(null)
    }
  }, [module])

  useEffect(() => {
    if (teamData) {
      onChangeTeamname(teamData.teamname)
      setEditor(teamData.editors.includes(username))
    }
  }, [teamData])

  function handleButton1(username, password, password2) {
    if (newAccount) {
      if (password === password2) {
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password1)) {
          if (/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username)) {
            axios({
              method: "POST",
              url: "/auth/register",
              data: {
                username,
                password
              }
            }).then((result) => {
              SecureStore.setItemAsync("token", result.data.token)
              SecureStore.setItemAsync("username", username)
              SecureStore.setItemAsync("password", password)
              setLogin(true)
              setLoginError('')
            }).catch(() => {
              setLoginError('Username taken or bad format')
            })
          } else {
            setLoginError('Invalid username (must be 8-20 characters with no special characters)')
          }
        } else {
          setLoginError('Password must be at least eight characters with at least one letter, one number, and one special character')
        }
      } else {
        setLoginError('Passwords must match')
      }
    } else {
      axios({
        method: "POST",
        url: "/auth/login",
        data: {
          username,
          password
        }
      }).then((result) => {
        SecureStore.setItemAsync("token", result.data.token)
        SecureStore.setItemAsync("username", username)
        SecureStore.setItemAsync("password", password1)
        setLogin(true)
        setLoginError('')
        if (result.data.teamData) {
          setTeamData(result.data.teamData)
        }
      }).catch(() => {
        setLoginError('Invalid username or password')
      })
    }
  }

  function handleButton2() {
    if (newAccount) {
      setNewAccount(false)
      setLoginError('')
    } else {
      setNewAccount(true)
      setLoginError('')
    }
  }

  async function handleButton3() {
    const token = await SecureStore.getItemAsync("token")
    if (newTeam) {
      axios({
        method: "POST",
        url: "/app/team/create",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          teamname,
          username
        }
      }).then((result) => {
        SecureStore.setItemAsync("token", result.data.token)
        setTeamData(result.data.teamData)
        setLoginError('')
      }).catch(() => {
        setLoginError('Unable to create team')
      })
    } else {
      axios({
        method: "POST",
        url: "/app/team/join",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          teamname,
          joinCode,
          username
        }
      }).then((result) => {
        SecureStore.setItemAsync("token", result.data.token)
        setTeamData(result.data.teamData)
        setLoginError('')
      }).catch(() => {
        setLoginError('Invalid invite code or team name')
      })
    }
  }

  function handleButton4() {
    if (newTeam) {
      setNewTeam(false)
      setLoginError('')
    } else {
      setNewTeam(true)
      setLoginError('')
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

  async function logout() {
    await SecureStore.deleteItemAsync("username")
    await SecureStore.deleteItemAsync("password")
    setModule('Games')
    setCurrentPlayer(null)
    setTeamData(null)
    onChangeUsername('')
    onChangeJoinCode('')
    onChangePassword1('')
    onChangePassword2('')
    onChangeTeamname('')
    setEditor(false)
    setLoginError('')
    setNewAccount(false)
    setNewTeam(true)
    setLogin(false)
  }

  async function updateAccess(member, access) {
    const token = await SecureStore.getItemAsync("token")
    const viewers = teamData.viewers
    const editors = teamData.editors
    if (access === 'Editor' && viewers.includes(member) && !editors.includes(member)) {
      axios({
        method: "PUT",
        url: "/app/member",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          teamname,
          member,
          canEdit: true
        }
      }).then((result) => {
        if (result.data.acknowledged) {
          viewers.splice(viewers.findIndex(m => m === member), 1)
          editors.push(member)
          setTeamData({
            ...teamData,
            viewers,
            editors
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    if (access === 'Viewer' && !viewers.includes(member) && editors.includes(member)) {
      axios({
        method: "PUT",
        url: "/app/member",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          teamname,
          member,
          canEdit: false
        }
      }).then((result) => {
        if (result.data.acknowledged) {
          editors.splice(editors.findIndex(m => m === member), 1)
          viewers.push(member)
          setTeamData({
            ...teamData,
            viewers,
            editors
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  return (login ?
    (teamData ?
      <SafeAreaView style={styles.screen}>
        <StatusBar />
        <View style={{ position: 'relative', paddingVertical: 10, minHeight: 50 }}>
          <Text style={styles.title}>{`${currentPlayer ? currentPlayer.name : teamname} ${module}`}</Text>
          <TouchableHighlight style={{ position: 'absolute', top: 10 }} onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={40} color='#FFFFFF' />
          </TouchableHighlight>
        </View>
        {
          module === 'Members' ?
            <Members editor={editor} teamData={teamData} username={username} updateAccess={updateAccess} /> :
            module === 'Stats' ?
              <Stats teamData={teamData} players={currentPlayer ? [currentPlayer._id] : teamData.players.map(player => player._id)} /> :
              module === 'Players' ?
                <Players editor={editor} teamid={teamData._id} players={teamData.players} handleNewPlayer={handleNewPlayer} editPlayer={editPlayer} deletePlayer={deletePlayer} selectPlayer={selectPlayer} /> :
                module === '' && currentGame && editor ?
                  <Selector currentGame={currentGame} setCurrentGame={setCurrentGame} players={teamData.players} deleteGame={deleteGame} /> :
                  <Games editor={editor} teamid={teamData._id} games={teamData.games} selectGame={selectGame} addGame={addGame} />
        }
        <Modal isVisible={menuOpen} animationIn='slideInLeft' animationOut='slideOutLeft' onBackdropPress={() => setMenuOpen(false)} backdropOpacity={0} style={{ margin: 0 }}>
          <Menubar teamname={teamname} logout={logout} setMenuOpen={setMenuOpen} setModule={setModule} openTeamStats={openTeamStats} />
        </Modal>
      </SafeAreaView> :
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.screen}>
          <View style={styles.container}>
            <Text style={styles.title}>{newTeam ? 'Create a team' : 'Join a team'}</Text>
            <TextInput autoCorrect={false} autoCapitalize='none' key='teamname' style={styles.textBox} onChangeText={onChangeTeamname} placeholder='team name' defaultValue={teamname} />
            {newTeam ? null : <TextInput autoCorrect={false} autoCapitalize='none' key='invitecode' style={styles.textBox} onChangeText={onChangeJoinCode} placeholder='enter invite code' defaultValue={joinCode} />}
            {loginError ? <Text style={{ color: "#ff0000" }}>{loginError}</Text> : null}
            <Button onPress={handleButton3} title={newTeam ? 'Create team' : 'Join your team'} />
            <Text style={styles.title}>or</Text>
            <Button onPress={handleButton4} title={newTeam ? 'Join an existing team' : 'Create a new team'} />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    ) :
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.title}>Volleyball Stat Tracker</Text>
          <TextInput autoCorrect={false} autoCapitalize='none' key='username' style={styles.textBox} onChangeText={onChangeUsername} placeholder='username' defaultValue={username} />
          <TextInput autoCorrect={false} autoCapitalize='none' key='password1' secureTextEntry={true} style={styles.textBox} onChangeText={onChangePassword1} placeholder='password' defaultValue={password1} />
          {newAccount ? <TextInput autoCorrect={false} autoCapitalize='none' key='password2' secureTextEntry={true} style={styles.textBox} onChangeText={onChangePassword2} placeholder='confirm password' /> : null}
          {loginError ? <Text style={{ color: "#ff0000" }}>{loginError}</Text> : null}
          <Button onPress={() => handleButton1(username, password1, password2)} title={newAccount ? 'Create account' : 'Log in'} />
          <Text style={styles.title}>or</Text>
          <Button onPress={handleButton2} title={newAccount ? 'Go back' : 'Create an account'} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
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
    alignItems: 'center',
    alignSelf: "stretch",
    marginHorizontal: 60
  },
  textBox: {
    textAlignVertical: 'center',
    backgroundColor: "white",
    marginVertical: 10,
    padding: 5,
    minWidth: 200
  }
});

