import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<AuthenticatedStackParamList, 'EngineerDetailsScreen'>;

const EngineerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text> Available Soon</Text>
    </View>
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

export default EngineerDetailsScreen;
