export type RootStackParamList = {
    Home: undefined; // No params expected
    Details: { itemId: number; message: string }; // Params expected
  };