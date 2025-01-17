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
import moment from 'moment';
import { GetAllServiceRequests } from '../../services/ServiceRequestService';
import { GetServiceRequestDto } from '../../dto/ServiceRequestDto';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ServiceRequestsScreen'>;

const ServiceRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<GetServiceRequestDto[]>([])
  const [request, setRequest] = useState<GetServiceRequestDto>()
  const [prefilteredRequests, setPrefilteredRequests] = useState<GetServiceRequestDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);

  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetServiceRequestDto[]>, BackendError>(["requests"], async () => GetAllServiceRequests())

  console.log(requests)
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(requests, ['slno', 'machine', 'customer'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setRequests(result)
    }
    if (!filter)
      setRequests(prefilteredRequests)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setRequests(data.data)
      setPrefilteredRequests(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderEngineer = ({ item }: { item: GetServiceRequestDto }) => (

    <Card style={styles.card} onPress={() => {
      setRequest(item)
      request && navigation.navigate('ServiceRequestDetailsScreen', { id: request._id })
    }}>
      <Card.Content style={styles.cardContent}>

        <View style={styles.textContainer}>
          <Title style={styles.title}>{item.request_id}</Title>
          <Paragraph style={styles.paragraph}>{item.product.label}</Paragraph>
          <Paragraph style={styles.paragraph}>{`Approved on : ${moment(item.approved_on).format("DD-MM-YYYY")}`}</Paragraph>

        </View>

      </Card.Content>

    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Requests...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load requests. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 350 }}>
        <Text style={styles.title}>Service Requests</Text>

      </View>
      <TextInput style={{ marginBottom: 10 }} placeholder='Search' mode='outlined' onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      {requests && <FlatList
        data={requests}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderEngineer}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests found.</Text>
        }
      />}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderColor: 'red',
    borderWidth: 1,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'capitalize'
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
    color: 'black'
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
});
export default ServiceRequestsScreen;
