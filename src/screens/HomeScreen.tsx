import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Button, Surface, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Surface elevation={2} style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        mode='contained'
        onPress={() =>
          navigation.navigate('Details', { itemId: 42, message: 'Hello from Home!' })
        }
      >
        Go to Details
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
