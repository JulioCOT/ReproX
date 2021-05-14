import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { Ionicons, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    return(
        <Tab.Navigator>
            <Tab.Screen
            name= 'AudioList' 
            component={AudioList} 
            options={{
                tabBarIcon: ({color, size}) =>  (
                    <Ionicons name="headset-outline" size={size} color={color} />
                ),
            }}
            />
            <Tab.Screen 
            name= 'Player' 
            component={Player} 
            options={{
                tabBarIcon: ({color, size}) =>  (
                    <SimpleLineIcons name="disc"  size={size} color={color} />
                ),
            }}
            />
            <Tab.Screen 
            name= 'PlayList' 
            component={PlayList}   
            options={{
                tabBarIcon: ({color, size}) =>  (
                    <MaterialIcons name="library-music" size={size} color={color} />
                ),
            }}/>

        </Tab.Navigator>
        
    );      

};

export default AppNavigator;