import React from 'react';
import {View, StyleSheet, Modal, FlatList, Text, Dimensions, Image} from 'react-native';
import color from '../misc/color';
import AudioListItem from './AudioListItem';





const PlayListDetail = ({visible, playList, onClose}) => {
    return(
        <Modal visible={visible} animationType='slide' transparent onRequestClose={onClose}>
            <View style= {styles.container}>
                <Text style={styles.title}>
            {playList.title}
                </Text>
            <FlatList 
            contentContainerStyle={styles.listContainer}
            data={playList.audios} 
            keyExtractor={item => item.id.toString()} 
            renderItem={({item}) => (
            <View style={{marginBottom: 10}}> 
            <AudioListItem title={item.filename} 
            duration={item.duration} />         

            </View>
    )}
    />
       <Image
                            name="ALERT"
                            source={require('../screens/assets/zone.gif')}
                            style={styles.img}
                        >
                                    </Image>
                                    
    </View>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}/>
        </Modal>
    );

};


const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container:{
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: height - 150,
    width: width - 15,
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius:30,



    },
    modalBG:{
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
    listContainer:{
    padding: 20,
    },
    title:{
        textAlign:'center',
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: 'bold',
        color:color.ACTIVE_BG,
        textShadowColor: 'black',
        shadowOpacity:.1,
        textShadowRadius:2,
        textShadowOffset:{width: 0,height: 1}
    },
    img:{

        width:320,
        height:220,
               alignSelf:'center',
        top:-360,

    },
});

export default PlayListDetail;