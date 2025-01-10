import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { UserContext } from '../../contexts/UserContext';
import { BackendError } from '../../..';
import FuzzySearch from 'fuzzy-search';
import { Card, Avatar, Button, Text, TextInput } from 'react-native-paper';
import { GetUserDto } from '../../dto/user.dto';
import { GetAllUsers } from '../../services/UserService';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomerDetailsScreen'>;

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [hidden, setHidden] = useState(false);
  const [customers, setCustomers] = useState<GetUserDto[]>([])
  const [prefilteredCustomers, setPrefilteredCustomers] = useState<GetUserDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", id], async () => GetAllUsers({ hidden: false, customer: String(id) }))

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
        title={item.role == "admin" ? `${item.username.toUpperCase()}-(Admin)` : item.role == "engineer" ? `${item.username.toUpperCase()}-(Engineer)` : `${item.username.toUpperCase()}-(Customer)` || "Member" + item.username.toUpperCase()}
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
        <Text style={{ marginLeft: 56 }}>Company : {item.customer.toUpperCase() || ''}</Text>
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

      {/* Toggle Active/Inactive Customers */}
      {user && user.role == "admin" && (
        <Button
          mode="contained"
          onPress={() => setHidden(!hidden)}
          style={styles.toggleButton}
        >
          {hidden ? "Show Active Customers" : "Show Inactive Customers"}
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
