import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { BackendError } from '../../..';
import FuzzySearch from 'fuzzy-search';
import { Card, Avatar, Button, Text, TextInput } from 'react-native-paper';
import { GetUserDto } from '../../dto/UserDto';
import { GetAllCustomersStaffForAdmin } from '../../services/CustomerService';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomerDetailsScreen'>;

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [customers, setCustomers] = useState<GetUserDto[]>([])
  const [prefilteredCustomers, setPrefilteredCustomers] = useState<GetUserDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", id], async () => GetAllCustomersStaffForAdmin({ id: String(id) }))

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(customers, ['username', 'email', 'mobile'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setCustomers(result)
    }
    if (!filter)
      setCustomers(prefilteredCustomers)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setCustomers(data.data)
      setPrefilteredCustomers(data.data)
    }
  }, [isSuccess, data])
  // Render each customer as a card
  const renderCustomer = ({ item }: { item: GetUserDto }) => (

    <Card style={styles.card}>
      <Card.Title
        style={{ width: '100%' }}
        title={`${item.username.toUpperCase()}-(${item.role.toUpperCase()})`}
        subtitle={`Mob : ${item.mobile || "N/A"}`}
        subtitleStyle={{ color: 'black', flexWrap: 'wrap' }}
        left={(props) => (
          <Avatar.Text
            {...props}
            label={item.username ? item.username.charAt(0).toUpperCase() : "C"}
          />
        )}
      />
      <Card.Content>
        <Text style={{ marginLeft: 56 }}>Company : {item.customer.label.toUpperCase() || ''}</Text>
        <Text style={{ marginLeft: 56 }}>Email : {item.email || ''}</Text>
      </Card.Content>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Customers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load customers. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}

      <Text style={styles.title}>Members</Text>
      <TextInput style={{ marginBottom: 10 }} placeholder='Members' mode='outlined' onChangeText={(val) => setFilter(val)} />


      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderCustomer}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No customers found.</Text>
        }
      />


    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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

export default CustomerDetailsScreen;
