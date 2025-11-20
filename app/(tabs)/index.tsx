import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Text, View, Button, FlatList, Modal, RefreshControl } from 'react-native';
import TaskCard from '../../components/TaskCard'
import { CommonStyles } from '../../styles';
import { Colors, Spacing } from '../../constants';


export default function Login() {

  return (
    <View style={CommonStyles.fullScreenContainer}>
      <Text>login screen! hello</Text>
    </View>
  );
}