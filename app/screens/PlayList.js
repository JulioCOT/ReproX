import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Image} from 'react-native';
import PlayListDetail from '../components/PlayListDetail';
import PlayListInputModal from '../components/PlayListInputModal';
import { AudioContext } from '../context/AudioProvider';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import color from '../misc/color';


let selectedPlayList = {}
const PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showPlayList, setShowPlayList] = useState(false);
    const context = useContext(AudioContext)
    const { playList, addToPlayList, updateState } = context

    const createPlayList = async playListName => {
        const result = await AsyncStorage.getItem('playlist')
        if (result !== null) {
            const audios = [];
            if (addToPlayList) {
                audios.push(addToPlayList)
            }
            const newList = {
                id: Date.now(),
                title: playListName,
                audios: audios
            }

            const updateList = [...playList, newList];
            updateState(context, { addToPlayList: null, playList: updateList });
            await AsyncStorage.setItem('playlist', JSON.stringify(updateList))
        }
        setModalVisible(false)
    }

    const renderPlayList = async () => {
        const result = await AsyncStorage.getItem('playlist');
        if (result === null) {
            const defaultPlayList = {
                id: Date.now(),
                title: 'Mis Favoritas',
                audios: []
            }

            const newPlayList = [...playList, defaultPlayList];
            updateState(context, { playList: [...newPlayList] });
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlayList]));
        }

        updateState(context, { playList: JSON.parse(result) });
    }

    useEffect(() => {
        if (!playList.length) {
            renderPlayList()
        }
    }, []);

    const handleBannerPress = async (playList)=>{

        if(addToPlayList){
            const result = await AsyncStorage.getItem('playlist');

            let oldList = [];
            let updatedList = [];
            let sameAudio = false;

            if(result !== null){
                oldList = JSON.parse(result);

                updatedList= oldList.filter(list=>{
                        if(list.id === playList.id){
                            //Validar si el audio ya está dentro de la lista o no
                            for(let audio of list.audios){
                                if(audio.id === addToPlayList.id){
                                    //Mostrar alguna alerta

                                    sameAudio = true;
                                    return;
                                }
                            }
                            
                            // Si no, Actualizar "playlist" solo si hay algun audio seleccionado
                            list.audios = [...list.audios, addToPlayList];
                        }
                        return list;
                });
             }
          
            if(sameAudio){
                Alert.alert('Se encontró un audio similar en la lista', `${addToPlayList.filename} Ya está en la lista`)
                sameAudio = false;
                return updateState(context, {addToPlayList: null});
            }
            updateState(context, {addToPlayList: null, playList: [...updatedList]});
          return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));
        }
        //Si no hay audios seleccionados, entonces abriremos la lista
        selectedPlayList = playList
        setShowPlayList(true);
    };

    return (
        <>
         
         <LinearGradient
                colors={['black', '#7574b4']}
                style={{
                    height: "110%", width: "100%",
                    padding: 0,
                    borderRadius: 0,
                    marginTop: "-15%",
                    marginLeft: "0%",

                }}
            >
                <Image
                            name="bgwaveter"
                            source={require('../screens/assets/audiowave.png')}
                            style={styles.imgter}
                        >
                                    </Image>
                 <Image
                            name="bgwavesec"
                            source={require('../screens/assets/audiowave.png')}
                            style={styles.imgsec}
                        >
                                    </Image>
                <Image
                            name="bgwaves"
                            source={require('../screens/assets/audiowave.png')}
                            style={styles.img}
                        >
                                    </Image>
        <ScrollView contentContainerStyle={styles.container}>
            
            {playList.length
                ? playList.map(item => (
                    <TouchableOpacity 
                        key={item.id.toString()}
                        style={styles.playListBanner}
                        onPress={() => handleBannerPress(item)}
                        >
                        <Text style={styles.mainTitle} >{item.title}</Text>
                        <Text style={styles.audioCount}>
                            {item.audios.length > 1
                                ? `${item.audios.length} Canciones`
                                : `${item.audios.length} Canción`}
                        </Text>
                    </TouchableOpacity>
                ))
                : null}
            <TouchableOpacity onPress={() =>
                setModalVisible(true)}
                style={{ marginTop: 15 }}>
                <Text style={styles.playListBtn}>+ Añadir nueva "Lista de Reproducción" </Text>
            </TouchableOpacity>

            <PlayListInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={createPlayList}
            />
        </ScrollView>
        </LinearGradient>
        <PlayListDetail visible={showPlayList} playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
        />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        padding: 20
    },
    audioCount: {
        marginTop: 3,
        opacity: 0.5,
        fontSize: 14,
        color: '#d6d6d6',
    },
    playListBanner: {
        padding: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        marginBottom: 15,
    },
    playListBtn: {
        color: '#ff9f22',
        opacity: .8,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontSize: 14,
        textShadowColor: 'black',
        shadowOpacity:.2,
        textShadowRadius:4,
        textShadowOffset:{width: 0,height: 3}
    },
    mainTitle: {
        color: '#e0deef',
    },
    img:{
width:360,
height: 190,
position:'absolute',
top: 280,
alignSelf: 'center',
opacity:1,
tintColor: 'black',

    },
    imgsec:{
        width:360,
        height: 190,
        position:'absolute',
        top: 300,
        alignSelf: 'center',
        opacity: .5,
        tintColor: '#43052c',
        
            },
    imgter:{
        width:360,
        height: 190,
        position:'absolute',
        top: 320,
        alignSelf: 'center',
        opacity: .5,
        tintColor: '#ffcc88',
    },


});

export default PlayList;