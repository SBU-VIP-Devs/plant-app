import { View, Text, StyleSheet, Pressable } from 'react-native'
import Svg, { Rect } from 'react-native-svg'
import { CommonStyles } from '../styles';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '../constants';

export interface TaskRequestProps {
    id: string
    requesterName: string,
    requesterId: string,
    taskTime: string,
    taskName: string,
    taskId: string,
}

export default function TaskRequestCard({id, taskTime, requesterName, taskName, requesterId, taskId}: TaskRequestProps) {

    return (
        <View>
            <Text style={CommonStyles.darkSubtitle}>{requesterName}</Text>
            <Text style={CommonStyles.darkSubtitle}>{taskName}</Text>
            <Text style={CommonStyles.darkSubtitle}>{taskTime}</Text>
            <Text style={CommonStyles.darkSubtitle}>{requesterId}</Text>
            <Text style={CommonStyles.darkSubtitle}>{taskId}</Text>
        </View>
    )
}

// Note: The unused container and button styles were removed since they weren't being used in the component