import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking'
import SelectDropdown from 'react-native-select-dropdown';

export default function Members({ editor, teamData, username, updateAccess }) {

    const [addingMember, setAddingMember] = useState(false)
    const [copied, setCopied] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [access, onChangeAccess] = useState('Viewer')

    const editorUrl = Linking.createURL("", {
        queryParams: {
            teamname: teamData.teamname,
            joinCode: teamData.editorCode
        }
    })

    const viewerUrl = Linking.createURL("", {
        queryParams: {
            teamname: teamData.teamname,
            joinCode: teamData.viewerCode
        }
    })

    async function copyToClipboard(text) {
        await Clipboard.setStringAsync(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableHighlight style={{ position: 'absolute', top: -45, right: 10 }} onPress={() => setAddingMember(true)}>
                <Ionicons name="add" size={40} color='#FFFFFF' />
            </TouchableHighlight>
            <FlatList data={[...teamData.editors, ...teamData.viewers]}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <TouchableHighlight onPress={editor && item !== username ? () => {
                        setSelectedMember(item)
                    } : null}>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>{item}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            >
            </FlatList>
            <Modal isVisible={selectedMember !== null} onBackdropPress={() => setSelectedMember(null)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{`Update ${selectedMember}'s access`}</Text>
                    <View style={styles.selector}>
                        <SelectDropdown data={['Editor', 'Viewer']} defaultButtonText={teamData.editors.includes(selectedMember) ? 'Editor' : 'Viewer'} dropdownIconPosition='right'
                            renderDropdownIcon={isOpened => {
                                return <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} />
                            }} buttonStyle={styles.dropdownButton} onSelect={onChangeAccess} />
                    </View>
                    <TouchableHighlight onPress={() => {
                        updateAccess(selectedMember, access).then(() => setSelectedMember(null))
                    }}>
                        <Text style={styles.title}>Update</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
            <Modal isVisible={addingMember} onBackdropPress={() => setAddingMember(false)} backdropOpacity={0} style={{ alignItems: 'center' }}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Add a team member</Text>
                    {editor ?
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.linkTitle}>For viewer access:</Text>
                            <TouchableHighlight onPress={() => copyToClipboard(viewerUrl)}>
                                <Text style={styles.link}>Copy invite link</Text>
                            </TouchableHighlight>
                            <Text style={styles.link}>or</Text>
                            <TouchableHighlight onPress={() => copyToClipboard(teamData.viewerCode)}>
                                <Text style={styles.link}>{`Copy invite code (${teamData.viewerCode})`}</Text>
                            </TouchableHighlight>
                            <Text style={styles.linkTitle}>For editor access:</Text>
                            <TouchableHighlight onPress={() => copyToClipboard(editorUrl)}>
                                <Text style={styles.link}>Copy invite link</Text>
                            </TouchableHighlight>
                            <Text style={styles.link}>or</Text>
                            <TouchableHighlight onPress={() => copyToClipboard(teamData.editorCode)}>
                                <Text style={styles.link}>{`Copy invite code (${teamData.editorCode})`}</Text>
                            </TouchableHighlight>
                        </View> :
                        <View style={{ alignItems: 'center' }}>
                            <TouchableHighlight onPress={() => copyToClipboard(viewerUrl)}>
                                <Text style={styles.link}>Copy invite link</Text>
                            </TouchableHighlight>
                            <Text style={styles.link}>or</Text>
                            <TouchableHighlight onPress={() => copyToClipboard(teamData.viewerCode)}>
                                <Text style={styles.link}>{`Copy invite code (${teamData.viewerCode})`}</Text>
                            </TouchableHighlight>
                        </View>}
                    {copied ? <Text style={styles.link}>Copied to clipboard!</Text> : null}
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
        flexDirection: 'row'
    },
    itemTitle: {
        flex: 1,
        fontSize: 20,
        color: '#000000'
    },
    title: {
        fontSize: 20,
        flexShrink: 1,
        color: '#ffffff'
    },
    linkTitle: {
        fontSize: 20,
        flexShrink: 1,
        color: '#ffffff',
        marginVertical: 15
    },
    link: {
        fontSize: 16,
        flexShrink: 1,
        color: '#ffffff',
        marginTop: 5
    },
    container: {
        flex: 3,
        backgroundColor: '#1b2838',
        color: '#fff'
    },
    modalView: {
        flex: 1,
        backgroundColor: '#2a475e',
        borderRadius: 20,
        maxHeight: 350,
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
    dropdownButton: {
        borderRadius: 8,
        maxWidth: '50%',
        maxHeight: '60%'
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    }
});