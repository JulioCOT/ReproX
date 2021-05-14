import React from 'react';
import {AntDesign} from '@expo/vector-icons'
import color from '../misc/color'


const PlayerButton = (props) => {

    const {
        iconType, 
        size = 40, 
        iconColor = color.FONT,  
        onPress} = props;

    const getIconName=(type) =>{
        switch(type) {
            case 'PLAY':
                return 'pausecircle'// relacionado a reproducir
            case 'PAUSE':
                return 'playcircleo'// relacionado a pausar
            case 'NEXT':
                return 'forward'// relacionado a pasar a la siguiente cancion
            case 'PREV':
                return 'banckward'// relacionado a regresar a la canciona anterior
        }
    }
    
    return(
        <AntDesign 
        {...props}

        onPress={onPress} 
        name={getIconName(iconType)} 
        size={size} 
        color={iconColor} 
        />
    )
}



export default PlayerButton;