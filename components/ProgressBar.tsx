import { View } from 'react-native'
import Svg, { Rect } from 'react-native-svg'
import { Colors } from '../constants';

interface Props {
    progress: number
}

export default function ProgressBar({ progress }: Props) {

    const barWidth = 230;
    const progressWidth = (progress / 100) * barWidth;
    return (
        <View>
            <Svg width={barWidth} height={'7'}>
                <Rect width={barWidth} height={'100%'} fill={Colors.primary} rx={3.5} ry={3.5}/>
                <Rect width={progressWidth} height={'100%'} fill={Colors.darkText} rx={3.5} ry={3.5}/>
            </Svg>
        </View>
    )
}