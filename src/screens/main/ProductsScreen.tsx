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
import { GetAllRegisteredProducts } from '../../services/RegisteredProductService';
import { GetRegisteredProductDto } from '../../dto/RegisteredProducDto';
import CreateOrEditRegisteredProductDialog from '../../components/dialogs/products/CreateOrEditRegisteredProductDialog';
import moment from 'moment';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ProductsScreen'>;

const ProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<GetRegisteredProductDto[]>([])
  const [dialog, setDialog] = useState<string>()
  const [product, setProduct] = useState<GetRegisteredProductDto>()
  const [prefilteredProducts, setPrefilteredProducts] = useState<GetRegisteredProductDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);

  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetRegisteredProductDto[]>, BackendError>(["products"], async () => GetAllRegisteredProducts())

  console.log(products)
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(products, ['slno', 'machine', 'customer'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setProducts(result)
    }
    if (!filter)
      setProducts(prefilteredProducts)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setProducts(data.data)
      setPrefilteredProducts(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderEngineer = ({ item }: { item: GetRegisteredProductDto }) => (

    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View>
          <Image style={styles.image} source={item.machine_photo !== "" ? { uri: item.machine_photo } : require("../../assets/img/placeholder.png")} />
          <Paragraph style={{
            fontSize: 18,
            fontWeight: 'bold',
            padding: 5,
            textTransform: 'capitalize'
          }}>{item.machine.label}</Paragraph>
        </View>
        <View style={styles.textContainer}>
          <Title style={styles.title}>{item.sl_no}</Title>
          <Paragraph style={styles.paragraph}>{item.customer.label}</Paragraph>
          <Paragraph style={styles.paragraph}>{item.installationDate ? `Installation Date : ${moment(item.installationDate).format("DD-MM-YYYY")}` : 'Not Installed'}</Paragraph>
          <Paragraph style={styles.paragraph}>{item.warrantyUpto ? `Warranty upto : ${moment(item.warrantyUpto).format("DD-MM-YYYY")}` : 'Not Applicable'}</Paragraph>
          <Button onPress={() => {
            setProduct(item)
            setDialog('CreateOrEditRegisteredProductDialog')
          }} labelStyle={{ width: '100%', textAlign: 'right' }}>Edit</Button>
        </View>

      </Card.Content>
      <Button
        disabled={product?.warrantyUpto && new Date(product.warrantyUpto) >= new Date() ? true : false} onPress={() => {
          console.log(product && new Date(product.warrantyUpto) >= new Date())
          setProduct(item)
          setDialog('CreateOrEditRegisteredProductDialog')
        }} labelStyle={{ width: '100%', textAlign: 'center' }}>New Service Request</Button>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load products. Please try again later.</Text>
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
        <Text style={styles.title}>Registered Products</Text>
        {user?.role == "admin" && <Button onPress={() => {
          setProduct(undefined)
          setDialog('CreateOrEditRegisteredProductDialog')
        }}>+New</Button>}
      </View>
      <TextInput style={{ marginBottom: 10 }} placeholder='Search' mode='outlined' onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      {products && <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderEngineer}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
      />}

      <CreateOrEditRegisteredProductDialog product={product} dialog={dialog} setDialog={setDialog} />
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
}); export default ProductsScreen;
