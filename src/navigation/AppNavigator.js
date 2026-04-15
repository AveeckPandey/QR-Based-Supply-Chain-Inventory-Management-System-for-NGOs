import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/main/Dashboard';
import Inventory from '../screens/main/Inventory';
import ScanQR from '../screens/main/ScanQR';
import Boxes from '../screens/main/Boxes';
import AddBox from '../screens/main/AddBox';
import EditBox from '../screens/main/EditBox';
import BoxDetails from '../screens/main/BoxDetails';
import AdminInventory from '../screens/main/AdminInventory';
import PrintQR from '../screens/main/PrintQR';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="BoxDetails" component={BoxDetails} />
      <Stack.Screen name="Inventory" component={Inventory} />
      <Stack.Screen name="ScanQR" component={ScanQR} />
      <Stack.Screen name="EditBox" component={EditBox} />
      <Stack.Screen name="Boxes" component={Boxes} />
      <Stack.Screen name="AddBox" component={AddBox} />
      <Stack.Screen name="PrintQR" component={PrintQR} />
      <Stack.Screen name="AdminInventory" component={AdminInventory} />
    </Stack.Navigator>
  );
}
