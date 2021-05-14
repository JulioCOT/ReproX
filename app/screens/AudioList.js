import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableNativeFeedbackBase } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import color from '../misc/color';
import { play, pause, resume, playNext } from '../misc/audioController'
import { storeAudioForNextOpening } from '../misc/helper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';



export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            OptionModalVisible: false,
        };
        this.currentItem = {}
    }


    layoutProvider = new LayoutProvider(i => 'audio', (type, dim) => {
        switch (type) {
            case 'audio':

                dim.width = Dimensions.get('window').width;
                dim.height = 70;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
        }
    }
    );

    handleAudioPress = async audio => {
        const { soundObj, playbackObj, currentAudio, updateState, audioFiles } = this.context;
        //reproducir audio (primera vez)
        if (soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio)
            updateState(this.context, {
                currentAudio: audio,
                playbackObj: playbackObj,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: index,
            });
            playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate);
            return storeAudioForNextOpening(audio, index);

        }
        //pausar audio
        if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playbackObj);

            console.log('El usuario ha pausado la canción')
            return updateState(this.context, {
                soundObj: status,
                isPlaying: false,
            });
        }
        //resumir audio
        if (soundObj.isLoaded &&
            !soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await resume(playbackObj)
            console.log('El usuario ha reanudado la canción')
            return updateState(this.context, { soundObj: status, isPlaying: true, });
        }


        //seleccionar otro audio
        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            console.log('El usuario ha seleccionado otra canción')
            updateState(this.context,
                {
                    currentAudio: audio,
                    soundObj: status,
                    isPlaying: true,
                    currentAudioIndex: index,
                }
            );
            return storeAudioForNextOpening(audio, index);
        }
    };

    componentDidMount() {
        this.context.loadPreviousAudio();
        Font.loadAsync({
           
           
            'wishyou': require('../screens/assets/Wishyou.ttf'),    
            'klik-light': require('../screens/assets/Klik-Light.otf'),
            'roots': require('../screens/assets/Roots.ttf'),


        });
    }

    rowRenderer = (type, item, index, extendedState) => {
        return (
            <AudioListItem
                title={item.filename}
                isPlaying={extendedState.isPlaying}
                activeListItem={this.context.currentAudioIndex === index}
                duration={item.duration}
                onAudioPress={() => this.handleAudioPress(item)}
                onOptionPress={() => {
                    this.currentItem = item;
                    this.setState({ ...this.state, OptionModalVisible: true });
                }}
            />
        );
    };

    render() {
        return (
            <AudioContext.Consumer>

                {({ dataProvider, isPlaying }) => {
                    if (!dataProvider._data.length) return null;
                    return (
                        <Screen style={styles.backG}>
                            <View style={styles.mainView}>
                            </View>
                            <LinearGradient
                                colors={['black', '#7574b4']}
                                style={{
                                    height: "120%", width: "100%",
                                    padding: -20,
                                    borderRadius: 0,
                                    marginTop:"-12%",
                                    marginLeft: "0%",

                                }}
                            >
                                <Text style={styles.mainTitle}>Biblioteca</Text>
                                <RecyclerListView style={{  marginTop: 5, fontFamily: 'wishyou', color: 'white',}}
                                    dataProvider={dataProvider}
                                    layoutProvider={this.layoutProvider}
                                    rowRenderer={this.rowRenderer}
                                    extendedState={{ isPlaying }}
                                />

                                
                            </LinearGradient>
                            <OptionModal 
                                onPlayPress={() => console.log('Play Audio')}
                                onPlayListPress={() => {
                                    this.context.updateState(this.context, {
                                        addToPlayList: this.currentItem,
                                    });
                                    this.props.navigation.navigate('PlayList');
                                }}
                                currentItem={this.currentItem}
                                onClose={() => this.setState({ ...this.state, OptionModalVisible: false })
                                }
                                visible={this.state.OptionModalVisible}
                            />

                        </Screen>
                    );
                }}
            </AudioContext.Consumer>

        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        color: 'white',
        alignItems: 'center'
    },
    mainTitle:{
        marginTop: 15,
        marginBottom: 10,
        fontFamily: 'wishyou',
        fontSize: 25,
        textAlign: 'center',
        width: '100%',
        height: -2,
        color: 'white',
        alignContent:'center',
        textShadowColor: color.ANIMATE,
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },
    mainView:{
        alignContent:'center',
    },
 
});

export default AudioList;

//C:\Users\Administrador.DESKTOP-BR7MSJR\Desktop\PDM/reproductor