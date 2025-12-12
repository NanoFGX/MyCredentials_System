import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Dashboard from "./screens/DashboardScreen";
import DocumentViewer from "./screens/DocumentViewer";
import EkycLoginScreen from "./screens/EkycLoginScreen";
import LoginScreen from "./screens/LoginScreen";
import UploadHandler from "./screens/UploadHandler.js";
import UploadSelect from "./screens/UploadSelect";
import Vault from "./screens/Vault";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
    }}
  >

    {/* Login is the first screen */}
    <Stack.Screen name="Login" component={LoginScreen} />

    {/* EKYC should be right after Login */}
    <Stack.Screen name="EKYC" component={EkycLoginScreen} />

    {/* Main app screens */}
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="UploadSelect" component={UploadSelect} />
    <Stack.Screen name="Vault" component={Vault} />
    <Stack.Screen name="UploadHandler" component={UploadHandler} />
    <Stack.Screen name="DocumentViewer" component={DocumentViewer} />

  </Stack.Navigator>
</NavigationContainer>

  );
}
