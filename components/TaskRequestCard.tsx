import { View, Text, StyleSheet, Pressable } from 'react-native'
import Svg, { Rect } from 'react-native-svg'

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
            <Text style={styles.darkSubtitle}>{requesterName}</Text>
            <Text style={styles.darkSubtitle}>{taskName}</Text>
            <Text style={styles.darkSubtitle}>{taskTime}</Text>
            <Text style={styles.darkSubtitle}>{requesterId}</Text>
            <Text style={styles.darkSubtitle}>{taskId}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#84a98c',
        borderRadius: 10,
        marginBottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
        
    },
    darkSubtitle: {
        fontFamily: 'Quicksand-Regular',
        color: '#2f3e46',
        fontSize: 15,
    },

    button: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#52796f',
        width: 80,
        padding: 8,
        margin: 8,
    },
})