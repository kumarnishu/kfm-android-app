import React, { useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Surface, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { AuthenticatedStackParamList } from '../navigation/AppNavigator';
import { Logout } from '../services/UserService';
import { UserContext } from '../contexts/UserContext';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomersScreen'>;

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useContext(UserContext)
  return (
    <Surface elevation={2} style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        mode='contained'
        onPress={() =>
          navigation.navigate('CustomerDetailsScreen', { id: 42 })
        }
      >
        Go to Details
      </Button>
      <Button
        mode='outlined'
        buttonColor='grey'
        onPress={async () => {
          await Logout()
          setUser(undefined)
        }
        }
      >
       Logout
      </Button>
    </Surface >
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

export default CustomersScreen;
