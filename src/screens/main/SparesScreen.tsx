import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Card, Paragraph, Surface, Text, TextInput, Title } from 'react-native-paper';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { GetSparePartDto } from '../../dto/spare-part.dto';
import { GetAllSpareParts } from '../../services/SparePartService';
import { formatter } from '../../utils/formatter';

type Props = StackScreenProps<AuthenticatedStackParamList, 'SparesScreen'>;

const SparesScreen: React.FC<Props> = ({ navigation }) => {
  const [spares, setSpares] = useState<GetSparePartDto[]>([])
  const [prefilteredSpares, setPrefilteredSpares] = useState<GetSparePartDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetSparePartDto[]>, BackendError>(["spares", hidden], async () => GetAllSpareParts({ hidden: hidden }))

  console.log(spares)
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(spares, ['name', 'partno'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setSpares(result)
    }
    if (!filter)
      setSpares(prefilteredSpares)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setSpares(data.data)
      setPrefilteredSpares(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderEngineer = ({ item }: { item: GetSparePartDto }) => (

    <Card style={styles.card}>
      <Image style={styles.image} source={item.photo !== "" ? { uri: item.photo } : require("../../assets/img/placeholder.png")} />
      <Card.Content style={styles.cardContent} >
        <Title style={styles.title}>{item.name}</Title>
        <Paragraph style={styles.paragraph}>Part No : {item.partno}</Paragraph>
        {item.compatible_machines && <Text style={styles.paragraph}>Compatibility : {item.compatible_machines}</Text>}
        <Paragraph style={styles.rupees}>{formatter.format(item.price) + " Rs"}</Paragraph>
      </Card.Content>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Spares...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load spares. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}

      <Text style={styles.title}>Spares</Text>
      <TextInput style={{ marginBottom: 10 }} placeholder='Spares' mode='outlined' onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      <FlatList
        data={spares}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderEngineer}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No spares found.</Text>
        }
      />

      {/* Toggle Active/Inactive Customers */}
      {user && user.role=="admin" && (
        <Button
          mode="contained"
          onPress={() => setHidden(!hidden)}
          style={styles.toggleButton}
        >
          {hidden ? "Show Active Spares" : "Show Inactive Spares"}
        </Button>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    width: '100%',
    padding: 10,
  },
  image: {
    minHeight: 200,
    maxHeight: 400,
    borderColor: 'red',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase'
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  paragraph: {
    paddingLeft: 2,
    textTransform: 'capitalize',
    color: 'black',
    overflow: 'scroll'
  },
  rupees: {
    paddingLeft: 2,
    textTransform: 'capitalize',
    overflow: 'scroll'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  toggleButton: {
    marginTop: 16,
  },
});export default SparesScreen;
