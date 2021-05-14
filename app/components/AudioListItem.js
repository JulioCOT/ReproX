import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';
import * as Font from 'expo-font';



    Font.loadAsync({
       
        'wishyou': require('../screens/assets/Wishyou.ttf'),
        'klik-light': require('../screens/assets/Klik-Light.otf'),
        'roots': require('../screens/assets/Roots.ttf'),


    });



const getThumbnailText = (filename) => filename[0]


const convertTime = minutes => {
    if(minutes) {
        const hrs = minutes / 60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0,2));
        const sec = Math.ceil((60 * percent) / 100);
        
        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (sec < 10) {
            return `0${minute}:${sec}`;
        }
        return `${minute}:${sec}`;
    }
};

const renderPlayPauseIcon = isPlaying => {
if(isPlaying) return (
<Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />);

return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />;

};




const AudioListItem = ({
    title, 
    duration, 
    onOptionPress, 
    onAudioPress,
    isPlaying,
    activeListItem,
    }) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onAudioPress}>
                <View style={styles.leftContainer}>
                    <View style={[styles.thumbnail, {backgroundColor: 
                        activeListItem 
                        ? color.ACTIVE_BG 
                        : color.FONT_LIGHT}]}>
                        <Text styles={styles.thumbnailText}>
                            {activeListItem
                            ? renderPlayPauseIcon(isPlaying) 
                            : getThumbnailText(title) }
                        </Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={1} style={styles.title}>
                            {title}
                        </Text>
                        <Text style={styles.timeText}>
                            {convertTime(duration)}
                        </Text>
                    </View>
                </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo 
                        onPress={onOptionPress}
                        name="dots-three-vertical"
                        size={18}
                        color={'#a8a7cf'}
                        style={{padding: 10}}
                    />
                </View>
            </View>
            <View style={styles.separator} />
        </>
    );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 50,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightContainer: {
        flexBasis: 35,
        color: 'white',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        height: 50,
        flexBasis: 50,
        backgroundColor: color.FONT_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT,
    },
    titleContainer: {
        width: width - 140,
        paddingLeft: 15,
    },
    title: {
        fontSize: 16,
        color: '#f1f1f8',
        //fontFamily: 'roots',
        fontFamily: 'klik-light',
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    separator: {
        width: width - 60,
        backgroundColor: 'white',
        opacity: 0.2,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10,
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGHT,
        fontFamily: 'klik-light',
    }
});

export default AudioListItem;