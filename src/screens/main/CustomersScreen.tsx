import React, { useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Surface, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomersScreen'>;

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useContext(UserContext)
  return (
    <Surface elevation={2} style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>


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
