import React, { useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Card, Paragraph, Surface, Title } from 'react-native-paper';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AuthenticatedStackParamList } from '../navigation/AppNavigator';
import { UserContext } from '../contexts/UserContext';

type Props = StackScreenProps<AuthenticatedStackParamList, 'HomeScreen'>;


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useContext(UserContext)
  const cardData: { title: string, description: string, image: any, link: string }[] = [
    {
      title: 'Customers',
      description: 'Registered customers',
      image: require('../assets/img/customers.jpg'),
      link: 'CustomersScreen',
    },
    {
      title: 'Engineers',
      description: 'Our Hard working engineers',
      image: require('../assets/img/engineer.jpg'),
      link: 'EngineersScreen',
    },
    {
      title: 'Machines',
      description: 'Machines that Made us',
      image: require('../assets/img/machines.jpg'),
      link: 'MachinesScreen',
    },
    {
      title: 'Spares',
      description: 'Available spare parts',
      image: require('../assets/img/parts.jpeg'),
      link: 'SparesScreen',
    },
    {
      title: 'Products',
      description: 'Registered products',
      image: require('../assets/img/products.jpeg'),
      link: 'ProductsScreen',
    },

    {
      title: 'Service Requests',
      description: 'Requests sent to us',
      image: require('../assets/img/requests.jpeg'),
      link: 'ServiceRequestsScreen',
    },

    {
      title: 'Notifications',
      description: 'Nofications that matter to you',
      image: require('../assets/img/notifications.png'),
      link: 'NotificationScreen',
    },
    {
      title: 'Staff',
      description: 'Staff Of Company Responible for',
      image: require('../assets/img/staff.jpeg'),
      link: 'StaffsScreen',
    },
  ];

  return (
    <Surface elevation={2} >
      <ScrollView >
        {cardData.map((card) => (
          //@ts-ignore
          <TouchableOpacity key={card.title} onPress={() => navigation.navigate(card.link)}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Image style={styles.image} source={card.image} />
                <View style={styles.textContainer}>
                  <Title style={styles.title}>{card.title}</Title>
                  <Paragraph style={styles.paragraph}>{card.description}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Surface >
  );
};

const styles = StyleSheet.create({

  card: {
    marginBottom: 10,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderColor: 'red',
    borderWidth: 1,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  paragraph: {
    paddingLeft: 2,
    textTransform: 'capitalize',
    color: 'black'
  },
});

export default HomeScreen;
