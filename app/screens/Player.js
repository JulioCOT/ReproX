import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Screen from '../components/Screen';
import color from '../misc/color';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { pause, play, playNext, resume } from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';


const { width } = Dimensions.get('window')


const Player = () => {

    const [fontsLoaded, setFontsLoaded] = useState(false);

    const context = useContext(AudioContext);
    const { playbackPosition, playbackDuration, } = context;

    const calculateSeebBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    };

    useEffect(() => {
        context.loadPreviousAudio();
        if (!fontsLoaded) {
            loadFonts();
        }

    }, []);

    const loadFonts = async () => {
        await Font.loadAsync({

            'klik-light': require('../screens/assets/Klik-Light.otf'),
            'mystic': require('../screens/assets/Mystic.ttf'),
            'roots': require('../screens/assets/Roots.ttf'),
            'snow': require('../screens/assets/Snowfun.ttf'),
        });
        setFontsLoaded(true);
    }

    if (!fontsLoaded) {
        return (<View />);
    }

    const handlePlayPause = async () => {

        //reproducir
        if (context.soundObj === null) {
            const audio = context.currentAudio;
            const status = await play(context.playbackObj, audio.uri)
            context.playbackObj.setOnPlaybackStatusUpdate(

                context.onPlaybackStatusUpdate
            );
            return context.updateState(context, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: context.currentAudioIndex,
            });
        }
        //pausar
        if (context.soundObj && context.soundObj.isPlaying) {
            const status = await pause(context.playbackObj)
            return context.updateState(context, {
                soundObj: status,
                isPlaying: false,

            });
        }
        //resumir
        if (context.soundObj && !context.soundObj.isPlaying) {
            const status = await resume(context.playbackObj)
            return context.updateState(context, {
                soundObj: status,
                isPlaying: true,

            });
        }

    };







    const handleNext = async () => {
        const { isLoaded } = await context.playbackObj.getStatusAsync();
        const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
        let audio = context.audioFiles[context.currentAudioIndex + 1];
        let index;
        let status;


        if (!isLoaded && !isLastAudio) {
            index = context.currentAudioIndex + 1;
            status = await play(context.playbackObj, audio.uri);

        }
        if (isLoaded && !isLastAudio) {
            index = context.currentAudioIndex + 1;
            status = await playNext(context.playbackObj, audio.uri);

        }

        if (isLastAudio) {
            index = 0;
            audio = context.audioFiles[index];
            if (isLoaded) {
                status = await playNext(context.playbackObj, audio.uri);
            } else {
                status = await play(context.playbackObj, audio.uri);
            }

        }

        context.updateState(context, {
            currentAudio: audio,
            playbackObj: context.playbackObj,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
        });
        storeAudioForNextOpening(audio, index);
    }


    const handlePrevious = async () => {
        const { isLoaded } = await context.playbackObj.getStatusAsync();
        const isFirstAudio = context.currentAudioIndex <= 0
        let audio = context.audioFiles[context.currentAudioIndex - 1];
        let index;
        let status;


        if (!isLoaded && !isFirstAudio) {
            index = context.currentAudioIndex - 1;
            status = await play(context.playbackObj, audio.uri);

        }
        if (isLoaded && !isFirstAudio) {
            index = context.currentAudioIndex - 1;
            status = await playNext(context.playbackObj, audio.uri);

        }

        if (isFirstAudio) {
            index = context.totalAudioCount - 1;
            audio = context.audioFiles[index];
            if (isLoaded) {
                status = await playNext(context.playbackObj, audio.uri);
            } else {
                status = await play(context.playbackObj, audio.uri);
            }

        }

        context.updateState(context, {
            currentAudio: audio,
            playbackObj: context.playbackObj,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,

        });
        storeAudioForNextOpening(audio, index);
    }


    if (!context.currentAudio) return null;




    return (
        <Screen>
            <LinearGradient
                colors={['black', '#ff2ea6', '#ff9f22', '#51489a', 'black']}
                style={{
                    height: "110%", width: "100%",
                    padding: 0,
                    borderRadius: 0,
                    marginTop: "-15%",
                    marginLeft: "0%",

                }}
            >
                <View style={styles.container}>

                    <Text style={styles.audioCount}>
                        {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}

                    </Text>

                    <View style={styles.midBannerContainer}>

                    <FontAwesome
                            name="circle"
                            style={styles.iconshadow}
                            size={300}
                            alignSelf={'center'}
                            color={context.isPlaying ? 'rgba(0,0,0, .5)' : 'rgba(0,0,0,0)'}

                        />
                        <FontAwesome
                            name="circle"
                            style={styles.iconbg}
                            size={300}
                            alignSelf={'center'}
                            color={context.isPlaying ? color.ONBACK : color.OFF}

                        />
                        <Image
                            name="logo-repro"
                            source={require('../screens/assets/sound-waves.png')}
                            style={styles.img}


                        ></Image>
                        <FontAwesome
                            name="circle"
                            style={styles.icon}
                            size={310}
                            alignSelf={'center'}
                            color={context.isPlaying ? color.ON : color.OFF}
                        />
                    </View>
                    <View style={styles.audioPlayerContainer}>
                        <Text numberOfLines={1} 
                        style={styles.audioTitle}>
                            {context.currentAudio.filename}
                        </Text>
                        <Slider
                            style={styles.sliderComponent}
                            minimumValue={0}
                            maximumValue={1}
                            value={calculateSeebBar()}
                            minimumTrackTintColor={'#8AAAFF'}
                            maximumTrackTintColor={'yellow'}
                            thumbTintColor={'#FFFFFF'}
                        />
                        <View style={styles.audioControllers}>
                            <Ionicons name={'ios-play-back'} style={styles.arrowleft} size={35} color={context.isPlaying ? '#ff9f22' : color.ICOFF} onPress={handlePrevious} />
                            <Ionicons
                                onPress={handlePlayPause}
                                style={{ marginHorizontal: 25 }}
                                name={context.isPlaying ? 'ios-pause-circle-sharp' : 'ios-play-circle-outline'}
                                style={styles.arrow}
                                color={context.isPlaying ? 'white' : color.ICOFF}
                                size={color.SIZE_BG} />
                            <Ionicons name={'ios-play-forward'}style={styles.arrow} size={35} color={context.isPlaying ? '#ff9f22' : color.ICOFF} onPress={handleNext} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Screen>
    );
};



const styles = StyleSheet.create({
    audioControllers: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 50,
        
    },
    container: {
        flex: 1,
    },
    audioCount: {
        textAlign: 'right',
        padding: 15,
        fontSize: 15,
        //fontFamily: 'klik-light',
        fontFamily: 'roots',
        color: 'rgba(255, 117, 197, .4)',
        textShadowColor: 'black',
        shadowOpacity: 1,
        textShadowRadius:1,
        textShadowOffset:{width: 1,height: 3}
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 22,
        alignItems: 'center',
        shadowColor: "#5D3F6A",
        alignSelf: 'center',
    },
    audioTitle: {
        alignSelf: 'center',
        fontSize: 23,
        fontFamily: 'roots',
        backgroundColor: 'rgba(0,0,0,.0)',
        borderRadius: 20,
        color: '#e0deef',
        padding: 15,
        margin: 10,
        textShadowColor: 'black',
        shadowOpacity:.4,
        textShadowRadius:4,
        textShadowOffset:{width: 0,height: 3}

    },
    sliderComponent: {
        width: width,
        height: 40,
    },
    img: {

        alignContent: 'center',
        width: 240, height: 240,
        shadowOffset: { height: 8 },
        shadowOpacity: 0.9,
        position: 'absolute'

    },
    icon: {
        position: 'absolute',

    },
    iconbg: {
        position: 'absolute',
        /*shadowOpacity: 2,
textShadowRadius:1,
textShadowOffset:{width: 0,height: 10}*/
},
iconshadow:{
position:'absolute',
opacity: .8,
top: 28,
},
arrow:{
    shadowOpacity: 2,
    textShadowRadius:3,
    textShadowOffset:{width: 0,height: 5}
    },
    arrowleft:{
        marginRight:7,
        shadowOpacity: 2,
        textShadowRadius:3,
        textShadowOffset:{width: 0,height: 5}

    },
});

export default Player;